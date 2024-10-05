from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Notification(db.Model):
    __tablename__ = 'notification'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(1000))
    firstName = db.Column(db.String(1000))
    lastName = db.Column(db.String(1000))
    title = db.Column(db.String(1000))
    category = db.Column(db.String(1000))

    def __repr__(self):
        return f"Notification: {self.id, self.email, self.firstName, self.lastName, self.title, self.category}"

    def __init__(self, email, firstName, lastName, title, category):
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.title = title
        self.category = category

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "title": self.title,
            "category": self.category
        }
