from flask import request, jsonify, session
from models.report import Report
from models.report import db


def submit_report():
    email = request.json['email']
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    role = request.json['role']
    title = request.json['title']
    body = request.json['body']
    category = request.json['category']
    longitude = request.json['longitude']
    latitude = request.json['latitude']

    # if this returns a report, then the report already exists in database
    report = Report.query.filter_by(email=email, title=title, body=body, category=category, longitude=longitude, latitude=latitude).first()

    if report:  # if a report is found, we want to notify it
        return jsonify({"message": "Report already exist!"}), 400

    # create a new report with the form data.
    new_report = Report(email=email, firstName=firstName, lastName=lastName, role=role, title=title, body=body, category=category, longitude=longitude, latitude=latitude)

    # add the new report to the database
    db.session.add(new_report)
    db.session.commit()

    session["report_id"] = new_report.id

    return jsonify({"message": "Report submitted successfully!"}), 200


def get_reports():
    try:
        reports = Report.query.order_by(Report.id.asc()).all()
        report_list = []
        for report in reports:
            report_list.append(report.serialize)

        # if report_list:
        return {'reports': report_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No report found"}), 404


def delete_report(report_id):
    try:
        report = Report.query.filter_by(id=report_id).one()

        db.session.delete(report)
        db.session.commit()
        return jsonify({"message": "Report deleted successfully"})
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "Something went wrong"}), 500
