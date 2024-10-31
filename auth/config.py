import os

class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    JWT_SECRET = os.environ["JWT_SECRET"]
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True	
    
    #connect to local db
    SQLALCHEMY_DATABASE_URI = os.environ["AUTH_DB_URL"]