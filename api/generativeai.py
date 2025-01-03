from flask import jsonify
import google.generativeai as genai
import api.config as config
from api.auth_middleware import token_required
import random

GEMINI_KEY=config.GOOGLE_CONFIG.get("GEMINI_KEY")

@token_required
def generate():
    try:
         genai.configure(api_key=GEMINI_KEY)
         model = genai.GenerativeModel("gemini-1.5-flash")

         response = model.generate_content("30 câu châm ngôn ngẫu nhiên về tài chính, tình yêu, hành phúc, cuộc sống, gia đình.(hài hước, thú vị) theo format 1. 2. ..., không phân loại category")

         lines = [line.strip() for line in response.text.strip().split('\n') if line.strip()]

         quotes = [line.split(". ", 1)[1] for line in lines]

         random_number = random.randint(0, 29)
       
         return jsonify({"result":quotes[random_number]}), 200
    except Exception as error:
        print("Error: %s" % error)
        return "Bad Request", 400