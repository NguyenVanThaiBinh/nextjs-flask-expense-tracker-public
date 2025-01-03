import psycopg2 
from psycopg2.extras import  execute_batch
from flask import jsonify, session, request
import api.config as config
from api.auth_middleware import token_required


@token_required
def get_expense_by_email():
    args  = request.args
    monthPara = args.get('Month') 
    yearPara = args.get('Year')
    try:
        with config.connect_to_database() as conn:
            cur = conn.cursor()

            get_expense_sql = """
                SELECT E.expense_id, E.user_email, E.category_id, E.wallet_id, E.expense_amount, E.expense_created_at, E.expense_description, E.del_flag, C.category_name, C.icon, W.wallet_name, C.type_category
                FROM Expense as E,  Category as C, Wallet as W
                WHERE E.user_email = %s
                AND extract(year from E.expense_created_at) = %s
                AND extract(month from E.expense_created_at) = %s
                AND C.category_id = E.category_id
                AND W.wallet_id = E.wallet_id
                AND E.del_flag = FALSE
                AND W.del_flag = FALSE
                AND C.del_flag = FALSE;
            """
           
            cur.execute(get_expense_sql, (session["user"].get("email"), yearPara, monthPara,))

            rows = cur.fetchall()
            
            if rows:
                formatted_category = [
                    {
                        "expense_id": row[0],
                        "user_email": row[1],
                        "category_id": row[2],
                        "wallet_id": row[3],
                        "expense_amount": row[4],
                        "expense_created_at": row[5],
                        "expense_description": row[6],
                        "del_flag": row[7],
                        "category_name":row[8],
                        "icon":row[9],
                        "wallet_name":row[10],
                        "type_category":row[11],
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
def insert_update_expense():
    expense_data = request.get_json()
    expense_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            if expense_data["expense_id"] is None or expense_data["expense_id"] == "":

                expense_sql = """
                INSERT INTO Expense (user_email, category_id, wallet_id, expense_amount, expense_created_at, expense_description ) 
                VALUES ( %s, %s, %s, %s, %s, %s)
                RETURNING del_flag, expense_id, user_email, category_id, wallet_id, expense_amount, expense_created_at, expense_description;
                """
                
                cur.execute(expense_sql,
                (
                    session["user"].get("email"),
                    expense_data["category_id"],
                    expense_data["wallet_id"],
                    expense_data["expense_amount"],
                    expense_data["expense_created_at"],
                    expense_data["expense_description"],
                ),)
                                              
            elif expense_data["del_flag"] == True:
                expense_sql = """
                    UPDATE Expense
                    SET del_flag = True
                    WHERE expense_id = %s AND user_email = %s
                    RETURNING del_flag, expense_id, user_email, category_id, wallet_id, expense_amount, expense_created_at, expense_description;
                    """
                cur.execute(expense_sql,
                (  
                    expense_data["expense_id"],session["user"].get("email")
                ),)
                
            else:
                expense_sql = """
                    UPDATE Expense
                    SET category_id = %s, wallet_id = %s, expense_amount = %s, expense_created_at = %s, expense_description = %s
                    WHERE expense_id = %s AND user_email = %s
                   RETURNING del_flag, expense_id, user_email, category_id, wallet_id, expense_amount, expense_created_at, expense_description;
                    """
            
                cur.execute(expense_sql,
                (
                    expense_data["category_id"],
                    expense_data["wallet_id"],
                    expense_data["expense_amount"],
                    expense_data["expense_created_at"],
                    expense_data["expense_description"],
                    expense_data["expense_id"],
                    session["user"].get("email")
                ),)
           

            conn.commit()

            row = cur.fetchone()
            
            formatted_expense = {
                     "expense_id": row[1],
                        "user_email": row[2],
                        "category_id": row[3],
                        "wallet_id": row[4],
                        "expense_amount": row[5],
                        "expense_created_at": row[6],
                        "expense_description": row[7],
                        "del_flag": row[0],
                        }
                   
            return jsonify({"result": "success", "new_expense": formatted_expense}), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400

@token_required
def update_expense_amount_all(conversion_rates,isVN_language):
    expense_sql = ""
    try:
        
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
           
            if isVN_language == True:
              expense_sql = """
                    UPDATE Expense
                    SET  expense_amount = ROUND(expense_amount * %s / 1000) * 1000
                    WHERE user_email = %s ;
                    """
            else:
              expense_sql = """
                    UPDATE Expense
                    SET  expense_amount = ROUND(expense_amount / %s)
                    WHERE user_email = %s ;
                    """  
            print(expense_sql)
            cur.execute(expense_sql,
                (
                   conversion_rates,
                   session["user"].get("email"), 
                ),)
            conn.commit()       
            return jsonify({"result": "success" }), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400

@token_required
def get_data_one_year():
    one_year_sql = ""
    
    try:
        args  = request.args
        yearPara = args.get('Year')
        with config.connect_to_database() as conn:

            cur = conn.cursor()
            
            one_year_sql = """
                select sum(expense_amount) from Expense, Category, Wallet
                where Expense.category_id = Category.category_id
                and Expense.wallet_id = Wallet.wallet_id
                and Wallet.del_flag = FALSE
                and Expense.del_flag = FALSE
                and Category.del_flag = FALSE
                and Category.type_category = %s
                and extract(year from Expense.expense_created_at) = %s
                and extract(month from Expense.expense_created_at) = %s
                and Expense.user_email = %s;
                    """  
        one_year_data = []    
        for i in range(1, 13):
            
            cur.execute(one_year_sql,
                (
                  'expense',
                   yearPara,
                   i,
                   session["user"].get("email"), 
                ),)
            conn.commit()   
            row_expense = cur.fetchone()  
            cur.execute(one_year_sql,
                (
                  'earnings',
                   yearPara,
                   i,
                   session["user"].get("email"), 
                ),)
            conn.commit()   
            row_earnings = cur.fetchone() 

            one_month_data ={  "month": i,
                        "expense": row_expense[0],
                        "earnings":row_earnings[0]}
            
            one_year_data.append(one_month_data)

          
        return jsonify(one_year_data), 200

    except Exception as error:
      print("Error: %s" % error)
      return "Bad Request", 400
