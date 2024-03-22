from sqlalchemy import create_engine
from sqlalchemy import text
from faker import Faker
import logging, time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
LOGGER = logging.getLogger(__name__)

#create_engine => username, password, hostname:port, database
def get_db_engine():
    return create_engine('postgresql://{}:{}@{}/{}'.format('postgres', 'postgres', 'postgres:5432', 'db'))


#retry mechanism for connect to database
while True:
    try:
        db_engine = get_db_engine().connect()
        if db_engine:
            break
    except Exception as e:
        LOGGER.warning(f"++++ Retrying connection to the database because of the issue {str(e)}++++")

i = 0
fake = Faker('en_US')
while True:
    LOGGER.info(f"Inserting record number {i+1}")
    user_id = fake.random_int(min=1, max=200)
    amount = fake.random_int(min=1000, max=10000)
    insert_query = f"INSERT INTO db.user_transactions (user_id, amount) VALUES ({user_id}, {amount})"
    db_engine.execute(text(insert_query).execution_options(autocommit=True))
    LOGGER.info(f"Completed inserting record number {i+1}")
    i = i + 1
    if i % 10 == 0:
        time.sleep(10)

db_engine.close()

