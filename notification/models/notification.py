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
    body = db.Column(db.String(1000))
    category = db.Column(db.String(1000))
    report_id = db.Column(db.Integer)
    closed = db.Column(db.Boolean, default=False)
    resolved = db.Column(db.Boolean, default=False)
    motivation = db.Column(db.String(1000))

    def __repr__(self):
        return f"Notification: {self.id, self.email, self.firstName, self.lastName, self.title, self.body, self.category, self.report_id, self.closed, self.resolved, self.motivation}"

    def __init__(self, email, firstName, lastName, title, body, category, report_id, closed, resolved, motivation):
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.title = title
        self.category = category
        self.body = body
        self.report_id = report_id
        self.closed = closed
        self.resolved = resolved
        self.motivation = motivation

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "report_id": self.report_id,
            "closed": self.closed,
            "resolved": self.resolved,
            "motivation": self.motivation
        }
