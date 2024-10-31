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
    
def submit_notifications_by_follows(report_id):
    try:
        insert_query = f"""
            INSERT INTO notification (email, "firstName", "lastName", title, category, report_id)
            SELECT f.email, r."firstName", r."lastName", r.title, r.category, f.report_id 
            FROM public.follow f 
            JOIN public.report r ON r.id = f.report_id and r.id = {report_id}
            WHERE NOT EXISTS (
                SELECT 1 FROM notification n
                WHERE n.email = f.email 
                AND n."firstName" = r."firstName" 
                AND n."lastName" = r."lastName" 
                AND n.title = r.title 
                AND n.category = r.category 
                AND n.report_id = f.report_id AND n.report_id = {report_id}
            );

            INSERT INTO notification (email, "firstName", "lastName", title, category, report_id)
            SELECT r.email, r."firstName", r."lastName", r.title, r.category, r.id
            FROM public.report r
            where r.id = {report_id} and not exists (
                SELECT 1 FROM notification n
                WHERE n.email = r.email 
                AND n."firstName" = r."firstName" 
                AND n."lastName" = r."lastName" 
                AND n.title = r.title 
                AND n.category = r.category 
                AND n.report_id = r.id AND n.report_id = {report_id}
            );
        """
        
        result = db.session.execute(insert_query)
        db.session.commit() 

        return jsonify('Notifications inserted'), 200
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No follow found"}), 404