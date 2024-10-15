from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Follow(db.Model):
    __tablename__ = 'follow'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(1000))
    firstName = db.Column(db.String(1000))
    lastName = db.Column(db.String(1000))
    report_id = db.Column(db.Integer)

    def __repr__(self):
        return f"Follow: {self.id, self.email, self.firstName, self.lastName, self.report_id}"

    def __init__(self, email, firstName, lastName, report_id):
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.report_id = report_id

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "report_id": self.report_id
        }
