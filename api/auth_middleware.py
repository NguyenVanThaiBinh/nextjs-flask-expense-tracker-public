from functools import wraps
import jwt
from flask import current_app ,session, request
import api.config as config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"]         
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "error": "Unauthorized"
            }, 401
        
        try:
            EmailGoogleAccount = session["user"].get("email")
            user_email =jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            
        #Get data user email
            if user_email is None or user_email.get("user_email") != EmailGoogleAccount:
                return {
                "message": "Invalid Authentication token!",
                "error": "Unauthorized"
            }, 401

        except Exception as e:

            session.pop("user", None)
            session.pop("token", None)

            if str(e) == "Signature has expired" or str(e) == "'user'":        
               return {
                "message": "Signature has expired!",
                "error": "Unauthorized"
            }, 401

            return {
                "message": "Something went wrong",
                "error": str(e)
            }, 500

        return f( *args, **kwargs)

    return decorated