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
    #address = request.json['address']
    #dateTime = request.json['dateTime']

    # if this returns a report, then the report already exists in database
    report = Report.query.filter_by(email=email, firstName=firstName, lastName=lastName, role=role, title=title, body=body, category=category).first()

    if report:  # if a report is found, we want to notify it
        return jsonify({"message": "Report already exist!"}), 400

    # create a new report with the form data.
    new_report = Report(email=email, firstName=firstName, lastName=lastName, role=role, title=title, body=body, category=category, longitude=longitude, latitude=latitude)#,address=address, dateTime=dateTime)

    # add the new report to the database
    db.session.add(new_report)
    db.session.commit()

    session["report_id"] = new_report.id

    return jsonify({"message": "Report submitted successfully!"}), 200


# def get_reports():
#     try:
#         reports = Report.query.order_by(Report.id.asc()).all()
#         report_list = []
#         for report in reports:
#             report_list.append(report.serialize)

#         # if report_list:
#         return {'reports': report_list}
#     except Exception as e:
#         print("Exception:", e)  # Print the specific exception for debugging
#         return jsonify({"message": "No report found"}), 404

def get_reports():
    try:
        # Filtra i report che non sono né chiusi né risolti
        reports = Report.query.filter(Report.closed == False, Report.resolved == False).order_by(Report.id.asc()).all()

        report_list = []
        for report in reports:
            report_list.append(report.serialize)

        # Se ci sono report, restituirli
        return {'reports': report_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No report found"}), 404

def get_closed_or_resolved_reports():
    try:
        # Filtra i report che sono chiusi o risolti
        reports = Report.query.filter(
            (Report.closed == True) | (Report.resolved == True)
        ).order_by(Report.id.asc()).all()

        report_list = []
        for report in reports:
            report_list.append(report.serialize)

        # Se ci sono report, restituirli
        return {'reports': report_list}
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "No closed or resolved report found"}), 404


def delete_report(report_id):
    try:
        report = Report.query.filter_by(id=report_id).one()

        db.session.delete(report)
        db.session.commit()
        return jsonify({"message": "Report deleted successfully"})
    except Exception as e:
        print("Exception:", e)  # Print the specific exception for debugging
        return jsonify({"message": "Something went wrong"}), 500

def close_report(report_id):
    try:
        report = Report.query.filter_by(id=report_id).one()
        
        # Ottieni la motivazione dal corpo della richiesta
        data = request.get_json()
        motivation = data.get('motivation', '')

        report.closed = True  # Imposta closed a True
        report.motivation = motivation  # Salva la motivazione
        db.session.commit()

        return jsonify({"message": "Report closed successfully"}), 200
    except Exception as e:
        print("Exception:", e)  # Stampa l'eccezione per il debug
        return jsonify({"message": "Something went wrong"}), 500

def resolve_report(report_id):
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"message": "Report not found"}), 404

        data = request.get_json()
        report.resolved = data.get('resolved', False)
        report.motivation = data.get('motivation', '')

        db.session.commit()  # Salva le modifiche nel database

        return jsonify({"message": "Report resolved successfully"}), 200
    except Exception as e:
        print("Exception:", e)
        return jsonify({"message": "Error resolving report"}), 500