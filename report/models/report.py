from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Report(db.Model):
    __tablename__ = 'report'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    firstName = db.Column(db.String(1000))
    lastName = db.Column(db.String(1000))
    role = db.Column(db.Integer, default=0)
    title = db.Column(db.String(1000))
    body = db.Column(db.String(1000))
    category = db.Column(db.String(1000))
    longitude = db.Column(db.Float(precision=14))
    latitude = db.Column(db.Float(precision=14))

    def __repr__(self):
        return f"Report: {self.id, self.email, self.firstName, self.lastName, self.role, self.title, self.body, self.category, self.longitude, self.latitude}"

    def __init__(self, email, firstName, lastName, role, title, body, category, longitude, latitude):
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.role = role
        self.title = title
        self.body = body
        self.category = category
        self.longitude = longitude
        self.latitude = latitude

    @property
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "role": self.role,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "longitude": self.longitude,
            "latitude": self.latitude
        }
