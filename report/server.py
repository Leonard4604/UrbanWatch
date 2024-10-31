from flask import Flask
from flask_cors import CORS
import os
from config import ApplicationConfig

from models.report import db
from routes.report_bp import report_bp
from models.database import create_database

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['basedir'] = os.path.abspath(os.path.dirname(__file__))

app.config.from_object(ApplicationConfig)

db.init_app(app)
app.register_blueprint(report_bp, url_prefix='/reports')

@app.route("/", methods=['GET'])
def home():
    return "Report Server is up"

if __name__ == "__main__":
    with app.app_context():
        create_database()
        db.create_all()
    
    app.debug = True
    app.run(host='0.0.0.0', port=5176)