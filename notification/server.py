from flask import Flask
from flask_cors import CORS
import os
from config import ApplicationConfig

from models.notification import db
from routes.notification_bp import notification_bp
from models.database import create_database, setup_postgres_fdw

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['basedir'] = os.path.abspath(os.path.dirname(__file__))

app.config.from_object(ApplicationConfig)

db.init_app(app)
app.register_blueprint(notification_bp, url_prefix='/notifications')

@app.route("/", methods=['GET'])
def home():
    return "Notification Server is up"

if __name__ == "__main__":
    with app.app_context():
        create_database()
        db.create_all()
        setup_postgres_fdw()
    
    app.debug = True
    app.run(host='0.0.0.0', port=5177)