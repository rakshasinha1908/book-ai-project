import requests

def generate_answer(context, question):
    url = "http://localhost:1234/v1/chat/completions"

    prompt = f"""
You are an AI assistant.

Answer the question clearly and concisely.
Context:
{context}

Question:
{question}

Answer:
"""
    data = {
        "model": "phi-3-mini-4k-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, json=data)
        result = response.json()

        print("LM STUDIO RESPONSE:", result)  # 🔥 DEBUG

        if "choices" in result:
            return result["choices"][0]["message"]["content"]

        elif "error" in result:
            return f"LM Studio Error: {result['error']}"

        else:
            return "Unexpected response from AI model."

    except Exception as e:
        return f"Error connecting to AI: {str(e)}"