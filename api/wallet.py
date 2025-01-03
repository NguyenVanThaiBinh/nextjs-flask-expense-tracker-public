import psycopg2
from flask import Response, jsonify, session, request
import api.config as config
from api.auth_middleware import token_required




@token_required
def insert_update_wallet():
    wallet_data = request.get_json()
    wallet_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            if wallet_data["wallet_id"] == 0:

                wallet_sql = """
                INSERT INTO Wallet (user_email, wallet_name, wallet_balance, wallet_description)
                VALUES (%s, %s, %s, %s)
                RETURNING del_flag, user_email, wallet_balance, wallet_description, wallet_id, wallet_name;
                             """
                
                cur.execute(wallet_sql,
                (
                    session["user"].get("email"),
                    wallet_data["wallet_name"],
                    wallet_data["wallet_balance"],
                    wallet_data["wallet_description"],
                ),)
                                                    
            elif wallet_data["del_flag"] == True:
                wallet_sql = """
                    UPDATE Wallet
                    SET del_flag = True
                    WHERE wallet_id = %s AND user_email = %s
                    RETURNING del_flag, user_email, wallet_balance, wallet_description, wallet_id, wallet_name;
                                   """
                cur.execute(wallet_sql,
                (  
                    wallet_data["wallet_id"],session["user"].get("email")
                ),)
                
            else:
                wallet_sql = """
                    UPDATE Wallet
                    SET wallet_name = %s, wallet_balance = %s, wallet_description = %s
                    WHERE wallet_id = %s AND user_email = %s
                    RETURNING del_flag, user_email, wallet_balance, wallet_description, wallet_id, wallet_name;
                             """
            
                cur.execute(wallet_sql,
                (
                    wallet_data["wallet_name"],
                    wallet_data["wallet_balance"],
                    wallet_data["wallet_description"],
                    wallet_data["wallet_id"],
                    session["user"].get("email")
                ),)
           

            conn.commit()

            new_wallet = cur.fetchone()
            formatted_wallets = {
                        "wallet_id": new_wallet[4],
                        "user_email": new_wallet[1],
                        "wallet_name": new_wallet[5],
                        "wallet_balance": int(new_wallet[2]),
                        "wallet_description": new_wallet[3],
                        "del_flag": new_wallet[0],
                        }
                   
            return jsonify({"result": "success", "new_wallet": formatted_wallets}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400


@token_required
def get_wallet_by_email():
    try:
        with config.connect_to_database() as conn:
            cur = conn.cursor()

            get_wallet_sql = """
                SELECT * FROM Wallet WHERE user_email = %s AND del_flag = FALSE;
            """
            cur.execute(get_wallet_sql, (session["user"].get("email"),))
            rows = cur.fetchall()

            if rows:
                formatted_wallets = [
                    {
                        "wallet_id": row[0],
                        "user_email": row[1],
                        "wallet_name": row[2],
                        "wallet_balance": int(row[3]),
                        "wallet_description": row[4],
                        "del_flag": row[5],
                    }
                    for row in rows
                ]
                return jsonify(formatted_wallets), 200
            else:
                return jsonify({"result":"Nothing data"}), 200

    except Exception as error:
        print("Error: %s" % error)
        return "Bad Request", 400

@token_required
def update_wallet_balance_all(conversion_rates,isVN_language):
    wallet_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            if isVN_language == True:
             wallet_sql = """
                    UPDATE Wallet
                    SET  wallet_balance = ROUND(wallet_balance * %s / 1000) * 1000
                    WHERE user_email = %s ;
                    """
            else:
             wallet_sql = """
                    UPDATE Wallet
                    SET  wallet_balance = ROUND(wallet_balance / %s)
                    WHERE user_email = %s ;
                    """  
            
            cur.execute(wallet_sql,
                (
                   conversion_rates,
                   session["user"].get("email"), 
                ),)
            conn.commit()
            return jsonify({"result": "success"}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400

