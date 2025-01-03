import psycopg2


def connect_to_database():
    try:
        conn = psycopg2.connect(
            database="",
            user="",
            host="",
            password="",
            port=5432,
        )
        return conn
    except Exception as error:
        raise Exception(f"Database connection error: {error}") from error


GOOGLE_CONFIG = {

        "GEMINI_KEY":"",
        "FLASK_SECRET": "",
        "OAUTH2_META_URL": "",
        

        "OAUTH2_CLIENT_ID": "",
        "OAUTH2_CLIENT_SECRET": "",
        "URL_CONFIG":"http://localhost:3000",
        "LOGOUT_URL":"http://localhost:3000/api/logout",


        
}


