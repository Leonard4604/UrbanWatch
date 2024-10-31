from flask import Flask
from flask_cors import CORS
import os
from config import ApplicationConfig

from models.report import db
from routes.report_bp import report_bp

import psycopg2

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['basedir'] = os.path.abspath(os.path.dirname(__file__))

app.config.from_object(ApplicationConfig)

db.init_app(app)
app.register_blueprint(report_bp, url_prefix='/reports')

@app.route("/", methods=['GET'])
def home():
    return "Report Server is up"

def create_database():
    db_name = "report"

    # Connect to the default database to check if your target DB exists
    default_conn = psycopg2.connect(
        dbname=os.environ["POSTGRES_DB"], user=os.environ["POSTGRES_USER"], 
        password=os.environ["POSTGRES_PASSWORD"], host=os.environ["DB_HOST"], port=os.environ["DB_PORT"]
    )
    default_conn.autocommit = True
    cursor = default_conn.cursor()

    # Check if the database exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}';")
    exists = cursor.fetchone()
    
    if not exists:
        # Create the database if it doesn't exist
        cursor.execute(f'CREATE DATABASE {db_name};')
        print("Database created!")
    else:
        print("Database already exists.")

    cursor.close()
    default_conn.close()

if __name__ == "__main__":
    with app.app_context():
        create_database()
        db.create_all()
    
    app.debug = True
    app.run(host='0.0.0.0', port=5176)