from flask import jsonify, request, session
import psycopg2
import requests
from api.auth_middleware import token_required
import api.config as config
from api import category, expense
from api import wallet

@token_required
def insert_user_expense_and_defaultCategory():
    try:
        user_email  = session["user"].get("email")
        user_name   = session["user"].get("name")
        user_avatar = session["user"].get("picture")

        with config.connect_to_database() as conn:
            cur = conn.cursor()

            insert_user_expense_sql = """
                INSERT INTO User_Expense (user_email, user_name, user_avatar)
                VALUES (%s, %s, %s);
            """
            
            cur.execute(insert_user_expense_sql, (user_email, user_name, user_avatar))
            conn.commit()

            category.insert_default_category_data(session["user"].get("email"))

            result = {"result": "success"} 
            return jsonify(result), 200

    except psycopg2.errors.UniqueViolation as error:
        # Handle duplicate key error more informatively
         result = {"result": "inserted user"}
         return jsonify(result), 200 

    except Exception as error:
        print("Error: %s" % error)
        return "Bad Request", 400
    

def get_user_expense():
    try:
          if session["user"] != None :
                with config.connect_to_database() as conn:
                    cur = conn.cursor()

                get_user_sql = """
                    SELECT * FROM User_Expense WHERE user_email = %s;
                """
                cur.execute(get_user_sql, (session["user"].get("email"),))

                rows = cur.fetchone()
                
                if rows:
                    formatted_userInfo = {
                        "email": rows[0],
                        "name": rows[1],
                        "picture": rows[2],
                        "isVN_language":rows[3], 
                        "default_wallet_id":rows[5], 
                        "jwt_token":session["token"],                      
                    }
                    return jsonify(formatted_userInfo), 200
                else:
                    #For the first time
                    formatted_userInfo={
                    "name":session["user"].get("name"),
                    "email":session["user"].get("email"),
                    "picture":session["user"].get("picture"),
                    "isVN_language":'true',
                    "jwt_token":session["token"]}

                    return jsonify(formatted_userInfo), 200
                
                

    except Exception as error:
        print("Error: %s" % error)
        formatted_userInfo= None
        return jsonify(formatted_userInfo), 200

@token_required
def update_language_user_expense():
    user_data = request.get_json()
    user_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            user_sql = """
                    UPDATE User_Expense
                    SET isVN_language = %s
                    WHERE user_email = %s ;
                    """
            
            cur.execute(user_sql,
                (user_data["isVN_language"],session["user"].get("email")))
           
            conn.commit()

            response = requests.get('https://v6.exchangerate-api.com/v6/f8b59d0920fa8e42c7a6bad3/latest/JPY')
            if response.status_code == 200:
              data = response.json()
              
              conversion_rates = data.get("conversion_rates").get("VND")
              
              wallet.update_wallet_balance_all(conversion_rates,user_data["isVN_language"])
              expense.update_expense_amount_all(conversion_rates,user_data["isVN_language"])
            else:
              print(jsonify({'error': 'API request failed'}), response.status_code)
  
            return jsonify({"result": "success"}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400

@token_required
def update_default_wallet_user_expense():
    user_data = request.get_json()
    user_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            user_sql = """
                    UPDATE User_Expense
                    SET default_wallet_id = %s
                    WHERE user_email = %s ;
                    """
            
            cur.execute(user_sql,
                (user_data["default_wallet_id"],session["user"].get("email")))
           
            conn.commit()           
  
            return jsonify({"result": "success"}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400