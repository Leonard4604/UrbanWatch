from flask import Blueprint
from controllers.ReportController import submit_report, get_reports, delete_report, close_report, resolve_report, get_closed_or_resolved_reports

report_bp = Blueprint('report', __name__)

report_bp.route('/', methods=['GET'])(get_reports)
report_bp.route('/closed-or-resolved', methods=['GET'])(get_closed_or_resolved_reports)
report_bp.route('/submit', methods=['POST'])(submit_report)
report_bp.route('/<int:report_id>', methods=['DELETE'])(delete_report)

report_bp.route('/<int:report_id>/close', methods=['PUT'])(close_report)
report_bp.route('/<int:report_id>/resolve', methods=['PUT'])(resolve_report)
