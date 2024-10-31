import psycopg2
import os

def create_database():
    db_name = "follow"

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