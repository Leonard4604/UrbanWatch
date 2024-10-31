from flask import Flask
from flask_cors import CORS
import os
from config import ApplicationConfig

from models.notification import db
from routes.notification_bp import notification_bp

import psycopg2

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['basedir'] = os.path.abspath(os.path.dirname(__file__))

app.config.from_object(ApplicationConfig)

db.init_app(app)
app.register_blueprint(notification_bp, url_prefix='/notifications')

@app.route("/", methods=['GET'])
def home():
    return "Notification Server is up"

def create_database():
    db_name = "notification"

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

def setup_postgres_fdw():
    try:
        conn = psycopg2.connect(
            dbname="notification", user="postgres", 
            password="postgres", host="postgres", port="5432"
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Enable the extension
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgres_fdw;")

        # Create a foreign server
        cursor.execute("""
            CREATE SERVER IF NOT EXISTS follow_server
            FOREIGN DATA WRAPPER postgres_fdw
            OPTIONS (host 'postgres', dbname 'follow', port '5432');
        """)

        # Create a foreign server
        cursor.execute("""
            CREATE SERVER IF NOT EXISTS report_server
            FOREIGN DATA WRAPPER postgres_fdw
            OPTIONS (host 'postgres', dbname 'report', port '5432');
        """)

        # Create a user mapping for the foreign server
        cursor.execute("""
            CREATE USER MAPPING IF NOT EXISTS FOR postgres
            SERVER follow_server
            OPTIONS (user 'postgres', password 'postgres');
        """)

        # Create a user mapping for the foreign server
        cursor.execute("""
            CREATE USER MAPPING IF NOT EXISTS FOR postgres
            SERVER report_server
            OPTIONS (user 'postgres', password 'postgres');
        """)

        # Import the schema of the tables from the foreign server
        cursor.execute("""
            IMPORT FOREIGN SCHEMA public
            FROM SERVER follow_server
            INTO public;
        """)

        # Import the schema of the tables from the foreign server
        cursor.execute("""
            IMPORT FOREIGN SCHEMA public
            FROM SERVER report_server
            INTO public;
        """)

        cursor.close()
        conn.close()
        print("Postgres FDW setup completed!")
    except Exception as e:
        print(f"Error setting up Postgres FDW: {e}")

if __name__ == "__main__":
    with app.app_context():
        create_database()
        db.create_all()
        setup_postgres_fdw()
    
    app.debug = True
    app.run(host='0.0.0.0', port=5177)