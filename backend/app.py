from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route("/")
def home():
    return "Hospital Dashboard Running 🚀"

if __name__ == "__main__":
    app.run(port=os.getenv("PORT"))