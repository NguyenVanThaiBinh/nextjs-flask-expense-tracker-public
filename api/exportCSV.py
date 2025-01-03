from flask import Response, jsonify, session
import api.config as config
from api.auth_middleware import token_required

@token_required
def export_CSV():
    try:
        with config.connect_to_database() as conn:
         cur = conn.cursor()

         get_expense_sql = """
                SELECT C.category_name, W.wallet_name, E.expense_amount,E.expense_description, E.expense_created_at, C.type_category, C.icon
                FROM Expense as E,  Category as C, Wallet as W
                WHERE E.user_email = %s
                AND C.category_id = E.category_id
                AND W.wallet_id = E.wallet_id
                AND E.del_flag = FALSE
                AND W.del_flag = FALSE
                AND C.del_flag = FALSE
                ORDER BY 
                E.expense_created_at DESC;
            """
         cur.execute(get_expense_sql, (session["user"].get("email"),)) 

         rows = cur.fetchall()

         csv_data = "STT,Category_name,Wallet_name,Expense_amount,Expense_description,Expense_created_at,Icon\n"

         if rows:
          index = 1
          for row in rows:
           csv_data += f"{index},'{row[0]}','{row[1]}',{row[2]},'{row[3]}',{row[4]},{row[5]},{row[6]}\n"
           index += 1 

          response = Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment;filename=exported_data.csv'}
         ),200
          return response
         else:
          return jsonify({"result":"Nothing data"}), 200


    except Exception as error:
        print("Error: %s" % error)
        return "Bad Request", 400
    
