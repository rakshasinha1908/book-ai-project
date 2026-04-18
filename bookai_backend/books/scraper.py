 
import requests
from bs4 import BeautifulSoup
from .models import Book
from .utils import get_embedding
from .lm_studio_utils import generate_answer
import json
import numpy as np


def scrape_books():
    base_url = "https://books.toscrape.com/catalogue/page-{}.html"

    for page in range(1, 3):
        url = base_url.format(page)
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        books = soup.select(".product_pod")

        for b in books:
            title = b.h3.a["title"]
            price = b.select_one(".price_color").text

            # Image
            image = b.find("img")["src"]
            image_url = "https://books.toscrape.com/" + image.replace("../", "")

            # Book detail page URL
            relative_url = b.h3.a["href"]
            book_url = "https://books.toscrape.com/catalogue/" + relative_url.replace("../", "")

            # Rating
            rating_class = b.p["class"][1]
            rating_map = {
                "One": 1,
                "Two": 2,
                "Three": 3,
                "Four": 4,
                "Five": 5
            }
            rating = rating_map.get(rating_class, None)

            # Avoid duplicates
            if Book.objects.filter(title=title).exists():
                continue

            # Fetch book detail page
            book_page = requests.get(book_url)
            book_soup = BeautifulSoup(book_page.text, "html.parser")

            #  REAL DESCRIPTION
            desc_tag = book_soup.select_one("#product_description ~ p")
            if desc_tag:
                description = desc_tag.text.strip()
            else:
                description = f"{title} is a book."

            #  REAL GENRE (breadcrumb)
            breadcrumb = book_soup.select("ul.breadcrumb li a")
            if len(breadcrumb) >= 3:
                genre = breadcrumb[2].text.strip()
            else:
                genre = "General"

            #  Embedding
            text = f"{title} {description}"
            embedding = get_embedding(text)

            if isinstance(embedding, np.ndarray):
                embedding = embedding.tolist()

            #  Create book
            book = Book.objects.create(
                title=title,
                author="Unknown Author",
                description=description,
                rating=rating,
                embedding=json.dumps(embedding),
                image_url=image_url,
                genre=genre
            )

            #  AI SUMMARY (now works MUCH better)
            summary_prompt = f"""
Summarize this book in 2-3 lines.

Description:
{description}

Only return the summary.
"""
            summary = generate_answer("", summary_prompt)

            book.summary = summary.strip()
            book.save()

    print(" Books scraped with REAL data + AI summary!")