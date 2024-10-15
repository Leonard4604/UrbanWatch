from flask import request, jsonify, session
from models.notification import Notification
from models.notification import db


def submit_notification():
    email = request.json['email']
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    title = request.json['title']
    category = request.json['category']
    report_id = request.json['report_id']

    # if this returns a notification, then the notification already exists in database
    notification = Notification.query.filter_by(email=email, firstName=firstName, lastName=lastName, title=title, category=category, report_id=report_id).first()

    if notification:  # if a notification is found, we want to notify it
        return jsonify({"message": "Notification already exist!"}), 400

    # create a new notification with the form data.
    new_notification = Notification(email=email, firstName=firstName, lastName=lastName, title=title, category=category, report_id=report_id)

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

def get_notifications_by_email(email):
    try:
        notifications = Notification.query.filter_by(email=email).order_by(Notification.id.asc()).all()
        notification_list = []
        for notification in notifications:
            notification_list.append(notification.serialize)
        
        return {'notifications': notification_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No notification found"}), 404
    
def get_notifications_by_report_id(report_id):
    try:
        notifications = Notification.query.filter_by(report_id=report_id).all()
        notification_list = []
        for notification in notifications:
            notification_list.append(notification.serialize)
        
        return {'notifications': notification_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No notification found"}), 404