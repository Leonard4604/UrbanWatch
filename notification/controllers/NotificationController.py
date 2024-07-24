from flask import request, jsonify, session
from models.notification import Notification
from models.notification import db


def submit_notification():
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    title = request.json['title']
    category = request.json['category']

    # if this returns a notification, then the notification already exists in database
    notification = Notification.query.filter_by(firstName=firstName, lastName=lastName, title=title, category=category).first()

    if notification:  # if a notification is found, we want to notify it
        return jsonify({"message": "Notification already exist!"}), 400

    # create a new notification with the form data.
    new_notification = Notification(firstName=firstName, lastName=lastName, title=title, category=category)

    # add the new notification to the database
    db.session.add(new_notification)
    db.session.commit()

    session["notification_id"] = new_notification.id

    return jsonify({"message": "Notification submitted successfully!"}), 200


def get_notifications():
    try:
        notifications = Notification.query.order_by(Notification.id.asc()).all()
        notification_list = []
        for notification in notifications:
            notification_list.append(notification.serialize)

        # if notification_list:
        return {'notifications': notification_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No notification found"}), 404


def delete_notification(notification_id):
    try:
        notification = Notification.query.filter_by(id=notification_id).one()

        db.session.delete(notification)
        db.session.commit()
        return jsonify({"message": "Notification deleted successfully"})
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "Something went wrong"}), 500
