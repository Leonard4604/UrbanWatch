import os

class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True	
    
    #connect to local db
    SQLALCHEMY_DATABASE_URI = os.environ["REPORT_DB_URL"]