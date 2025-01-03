import psycopg2 
from psycopg2.extras import  execute_batch
from flask import jsonify, session, request
import api.config as config
from api.auth_middleware import token_required


@token_required
def get_category_by_email():
    try:
        with config.connect_to_database() as conn:
            cur = conn.cursor()

            get_category_sql = """
                SELECT * FROM Category WHERE user_email = %s AND del_flag = FALSE;
            """
            cur.execute(get_category_sql, (session["user"].get("email"),))

            rows = cur.fetchall()

            if rows:
                formatted_category = [
                    {
                        "category_id": row[0],
                        "user_email": row[1],
                        "icon": row[2],
                        "category_name": row[3],
                        "type_category": row[4],
                        "del_flag": row[5],
                    }
                    for row in rows
                ]
                return jsonify(formatted_category), 200
            else:
                return jsonify({"result":"Nothing data"}), 200

    except Exception as error:
        print("Error: %s" % error)
        return "Bad Request", 400



@token_required
def insert_default_category_data(user_email):
   
    category_sql = ""

    try:
        with config.connect_to_database() as conn:

            cur = conn.cursor()

            # Prepare the INSERT statement
            category_sql = """INSERT INTO Category (user_email, icon ,category_name, type_category ) VALUES (%s, %s, %s,%s)
            """

            # Create a list of tuples containing the values to insert
            data = [
            (user_email, "GiMealIcon", "Eating", "expense"),
            (user_email, "FaTrainTramIcon", "Train", "expense"),
            (user_email, "FaShoppingCartIcon", "Shopping", "expense"),
            (user_email, "GiBeerSteinIcon", "Beer", "expense"),
            (user_email, "IoIosCafeIcon", "Cafe", "expense"),
            (user_email, "GiSellCardIcon", "Balance", "expense"),
            (user_email, "MdOutlineElectricBoltIcon", "Gas, Electric, Internet", "expense"),
            (user_email, "IoDiceSharpIcon", "Entertainment", "expense"),
            (user_email, "BsHouseDoorFillIcon", "Home Pay", "expense"),
            (user_email, "GiCampingTentIcon ", "Traveling", "expense"),
            (user_email, "MdHealthAndSafetyIcon", "Health", "expense"),
            (user_email, "BiRunIcon", "Sport", "expense"),
            (user_email, "GiLoveLetterIcon", "Event", "expense"),
            (user_email, "TfiCutIcon", "Spa", "expense"),
            (user_email, "GiPayMoneyIcon", "Invest", "expense"),
            (user_email, "GiTakeMyMoneyIcon", "Others", "expense"),

            (user_email, "GiTakeMyMoneyIcon", "Salary", "earnings"),
            (user_email, "FaHandHoldingUsdIcon", "Reward", "earnings"),
            (user_email, "GiSellCardIcon", "Selling", "earnings"),
            ]
                
            execute_batch(cur, category_sql, data)
                                                       
            conn.commit()
            
            return jsonify({"result": "success"}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400
    
@token_required
def insert_update_category():
    category_data = request.get_json()
    category_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            if category_data["category_id"] is None or category_data["category_id"] == "":

                category_sql = """
                INSERT INTO Category (user_email, icon ,category_name, type_category ) 
                VALUES (%s, %s, %s,%s)
                RETURNING del_flag, user_email, icon, category_name, type_category, category_id;
                """
                
                cur.execute(category_sql,
                (
                    session["user"].get("email"),
                    category_data["icon"],
                    category_data["category_name"],
                    category_data["type_category"],
                ),)
                                              
            elif category_data["del_flag"] == True:
                category_sql = """
                    UPDATE Category
                    SET del_flag = True
                    WHERE category_id = %s AND user_email = %s
                    RETURNING del_flag, user_email, icon, category_name, type_category, category_id;
                    """
                cur.execute(category_sql,
                (  
                    category_data["category_id"],session["user"].get("email")
                ),)
                
            else:
                category_sql = """
                    UPDATE Category
                    SET icon = %s, category_name = %s, type_category = %s
                    WHERE category_id = %s AND user_email = %s
                    RETURNING del_flag, user_email, icon, category_name, type_category, category_id;
                    """
            
                cur.execute(category_sql,
                (
                    category_data["icon"],
                    category_data["category_name"],
                    category_data["type_category"],
                    category_data["category_id"],
                    session["user"].get("email")
                ),)
           

            conn.commit()

            new_category = cur.fetchone()
            
            formatted_category = {
                        "category_id": new_category[5],
                        "category_name": new_category[3],                     
                        "type_category": new_category[4],                       
                        "del_flag": new_category[0],
                        "user_email": new_category[1],
                        "icon": new_category[2],
                        }
                   
            return jsonify({"result": "success", "new_category": formatted_category}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400



