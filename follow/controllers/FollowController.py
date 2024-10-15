from flask import request, jsonify, session
from models.follow import Follow
from models.follow import db


def submit_follow():
    email = request.json['email']
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    report_id = request.json['report_id']

    # if this returns a follow, then the follow already exists in database
    follow = Follow.query.filter_by(email=email, firstName=firstName, lastName=lastName, report_id=report_id).first()

    if follow:  # if a follow is found, we want to notify it
        return jsonify({"message": "Follow already exist!"}), 400

    # create a new follow with the form data.
    new_follow = Follow(email=email, firstName=firstName, lastName=lastName, report_id=report_id)

    # add the new follow to the database
    db.session.add(new_follow)
    db.session.commit()

    session["follow_id"] = new_follow.id

    return jsonify({"message": "Follow submitted successfully!"}), 200


def delete_follow(follow_id):
    try:
        follow = Follow.query.filter_by(id=follow_id).one()

        db.session.delete(follow)
        db.session.commit()
        return jsonify({"message": "Follow deleted successfully"})
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "Something went wrong"}), 500

def get_follows_by_email(email):
    try:
        follows = Follow.query.filter_by(email=email).order_by(Follow.id.asc()).all()
        follow_list = []
        for follow in follows:
            follow_list.append(follow.serialize)
        
        return {'follows': follow_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No follow found"}), 404
    
def get_follows_notifications():
    try:
        insert_query = """
        INSERT INTO notification (email, "firstName", "lastName", title, category, report_id)
        SELECT f.email, r."firstName", r."lastName", r.title, r.category, f.report_id 
        FROM follow f 
        JOIN report r ON r.id = f.report_id
        WHERE NOT EXISTS (
            SELECT 1 FROM notification n
            WHERE n.email = f.email 
            AND n."firstName" = r."firstName" 
            AND n."lastName" = r."lastName" 
            AND n.title = r.title 
            AND n.category = r.category 
            AND n.report_id = f.report_id
        );
        """
        
        result = db.session.execute(insert_query)
        db.session.commit() 

        return jsonify('Notifications inserted'), 200
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No follow found"}), 404