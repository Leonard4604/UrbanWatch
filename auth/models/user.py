from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    firstName = db.Column(db.String(1000))
    lastName = db.Column(db.String(1000))
    role = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"User: {self.id, self.email, self.firstName, self.lastName, self.password, self.role}"

    def __init__(self, email, password, firstName, lastName):
        self.email = email
        self.password = password
        self.firstName = firstName
        self.lastName = lastName

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "role": self.role
        }
