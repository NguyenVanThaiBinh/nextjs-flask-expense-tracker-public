from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, session, url_for, jsonify, request
import jwt
import api.config as config
import datetime
from api import wallet
from api import userExpense
from api import category
from api import expense
from api import exportCSV
from api import generativeai


app = Flask(__name__)
app.secret_key = config.GOOGLE_CONFIG.get("FLASK_SECRET")


 

#----------------------------------------------------------------
#TODO: GOOGLE LOGIN
#----------------------------------------------------------------
oauth = OAuth(app)
oauth.register(
    "BinhHuApp",
    client_id=config.GOOGLE_CONFIG.get("OAUTH2_CLIENT_ID"),
    client_secret=config.GOOGLE_CONFIG.get("OAUTH2_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read",
    },
    server_metadata_url=f'{config.GOOGLE_CONFIG.get("OAUTH2_META_URL")}',
)

@app.route("/api/signin-google")
def googleCallback():
    try:
        # fetch access token and id token using authorization code
        token = oauth.BinhHuApp.authorize_access_token()

        session["user"] = token['userinfo']

        # Set expiration time in seconds (7 days)
        expire_delta = datetime.timedelta(days=7)

        session["token"] = jwt.encode({"user_email": session["user"].get("email"),
                                    "exp": datetime.datetime.now(datetime.timezone.utc) + expire_delta},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                    )

        return redirect(config.GOOGLE_CONFIG.get("URL_CONFIG"))
    except Exception:
      return redirect(config.GOOGLE_CONFIG.get("URL_CONFIG"))

@app.route("/api/google-login")
def googleLogin():
    if "user" in session:
     return  redirect("/api/signin-google")
    return oauth.BinhHuApp.authorize_redirect(redirect_uri=url_for("googleCallback", _external=True))


@app.route("/api/logout")
def logout():
    session.pop("user", None)
    session.pop("token", None)
    return redirect(config.GOOGLE_CONFIG.get("URL_CONFIG"))

#----------------------------------------------------------------
#TODO: WALLET
#----------------------------------------------------------------
@app.route("/api/wallet/insertUpdateWallet", methods=['POST'])
def insert_wallet_server():
    return wallet.insert_update_wallet()

@app.route("/api/wallet/getWalletByEmail", methods=['GET'])
def get_wallet_by_email_server():
    return wallet.get_wallet_by_email()
#----------------------------------------------------------------
#TODO: USER_EXPENSE
#----------------------------------------------------------------
@app.route("/api/getUserInfo")
def getUserInfo():
 return userExpense.get_user_expense()

@app.route("/api/userExpense/updateLanguageUserExpense", methods=['POST'])
def update_language_user_expense():
    return userExpense.update_language_user_expense()

@app.route("/api/userExpense/updateDefaultWalletUserExpense", methods=['POST'])
def update_default_wallet_user_expense():
    return userExpense.update_default_wallet_user_expense()

@app.route("/api/userExpense/insertUserExpense", methods=['POST'])
def insert_user_expense_and_defaultCategory():
   return userExpense.insert_user_expense_and_defaultCategory()

#----------------------------------------------------------------
#TODO: CATEGORY 
#----------------------------------------------------------------
@app.route("/api/category/getCategoryByEmail", methods=['GET'])
def get_category_by_email_server():
   return category.get_category_by_email()

@app.route("/api/category/insertUpdateCategory", methods=['POST'])
def insert_update_category():
    return category.insert_update_category()

#----------------------------------------------------------------
#TODO: EXPENSE
#----------------------------------------------------------------
@app.route("/api/expense/getExpenseByEmail", methods=['GET'])
def get_expense_by_email_server():
   return expense.get_expense_by_email()

@app.route("/api/expense/getDataExpenseOneYear", methods=['GET'])
def get_data_expense_one_year():
   return  expense.get_data_one_year()

@app.route("/api/expense/insertUpdateExpense", methods=['POST'])
def insert_update_expense():
   return expense.insert_update_expense()

#----------------------------------------------------------------
#TODO: EXPORT CSV
#----------------------------------------------------------------
@app.route("/api/export/exportCSV", methods=['GET'])
def export_CSV():
   return exportCSV.export_CSV()

#----------------------------------------------------------------
#TODO: Gemini AI
#----------------------------------------------------------------
@app.route("/api/gemini/generate", methods=['GET'])
def generate():
   return generativeai.generate()