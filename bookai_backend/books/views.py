from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .utils import get_embedding
import json
import numpy as np
from .lm_studio_utils import generate_answer


# GET all books + POST create book (merged)
@api_view(['GET', 'POST'])
def books(request):

    # 🔹 GET → fetch all books
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    # 🔹 POST → create new book
    elif request.method == 'POST':
        serializer = BookSerializer(data=request.data)

        if serializer.is_valid():
            book = serializer.save()

            # generate embedding
            text = f"{book.title} {book.description}"
            embedding = get_embedding(text)

            if isinstance(embedding, np.ndarray):
                embedding = embedding.tolist()

            book.embedding = json.dumps(embedding)
            book.save()

            # Generate summary using LLM
            summary_prompt = f"""
Summarize the following book in 2-3 lines.

Description:
{book.description}

Only return the summary.
"""
            
            summary = generate_answer("", summary_prompt)
            
            # Generate genre
            genre_prompt = f"""
Classify this book into ONE word genre.

Rules:
- Only ONE word
- No explanation
- No sentence
- Examples: Fiction, Romance, Mystery, Business, Self-help

Description:
{book.description}

Answer:
"""
            genre = generate_answer("", genre_prompt)
            book.summary = summary
            book.genre = genre.strip()
            book.save()

            return Response({
                "book": serializer.data,
                "summary": summary,
                "genre": genre
            }, status=201)

        return Response(serializer.errors, status=400)


# GET single book
@api_view(['GET'])
def get_book(request, pk):
    try:
        book = Book.objects.get(id=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=404)

    serializer = BookSerializer(book)
    return Response(serializer.data)


#  Ask question (AI Q&A)
@api_view(['POST'])
def ask_question(request):
    question = request.data.get("question")
    print("QUESTION:", question)

    if not question:
        return Response({"error": "Question is required"}, status=400)

    # get query embedding
    query_embedding = get_embedding(question)
    if isinstance(query_embedding, list):
        query_embedding = np.array(query_embedding)

    similarities = []
    books = Book.objects.all()

    for book in books:
        if not book.embedding:
            continue

        emb = np.array(json.loads(book.embedding))

        # cosine similarity
        sim = np.dot(query_embedding, emb) / (
            np.linalg.norm(query_embedding) * np.linalg.norm(emb)
        )

        similarities.append((sim, book))

    similarities.sort(reverse=True, key=lambda x: x[0])

    # pick top matches
    top_books = [b for _, b in similarities[:3]]

    # fallback if none found
    if not top_books and similarities:
        top_books = [b for _, b in similarities[:1]]

    context = ""
    sources = []

    for b in top_books:
        # context += f"Title: {b.title}\nDescription: {b.description}\n\n"
        context += f"""
The book "{b.title}" is written by {b.author}.
Description: {b.description}
\n
"""
        if b.title not in sources:
            sources.append(b.title)

    answer = generate_answer(context, question)

    return Response({
        "answer": answer,
        "sources": sources
    })

@api_view(['POST'])
def scrape_books_api(request):
    from .scraper import scrape_books

    scrape_books()

    return Response({
        "message": "Books scraped and stored successfully"
    })
    
    
@api_view(['GET'])
def recommend_books(request, pk):
    try:
        book = Book.objects.get(id=pk)

        similar_books = Book.objects.filter(
            genre=book.genre
        ).exclude(id=book.id)[:5]

        serializer = BookSerializer(similar_books, many=True)
        return Response(serializer.data)

    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=404)