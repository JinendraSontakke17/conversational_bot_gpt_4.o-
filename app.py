from flask import Flask, request, jsonify, render_template
from openai import OpenAI


app = Flask(__name__)
client = OpenAI(api_key="")

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/chat", methods=["POST"])
def chat():
    input_data = request.json
    message = input_data.get("message", "")
    response = chat_with_gpt(message)

    return jsonify({"response": response})


def chat_with_gpt(user_input):
    try:
        stream = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": user_input}],
            stream=True,
        )
        response = ""

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                response += chunk.choices[0].delta.content
        return response
    except Exception as e:  
        print("An error occurred:", e)
        return ""


if __name__ == "__main__":
    app.run(debug=True)
