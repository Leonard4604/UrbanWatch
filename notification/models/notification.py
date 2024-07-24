from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Notification(db.Model):
    __tablename__ = 'notification'
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(1000))
    lastName = db.Column(db.String(1000))
    title = db.Column(db.String(1000))
    category = db.Column(db.String(1000))

    def __repr__(self):
        return f"Notification: {self.id, self.firstName, self.lastName, self.title, self.category}"

    def __init__(self, firstName, lastName, title, category):
        self.firstName = firstName
        self.lastName = lastName
        self.title = title
        self.category = category

    @property
    def serialize(self):
        return {
            "id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "title": self.title,
            "category": self.category
        }
