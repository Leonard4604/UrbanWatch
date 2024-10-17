from flask import Blueprint
from controllers.NotificationController import submit_notification, get_notifications, delete_notification, get_notifications_by_email, get_notifications_by_report_id, submit_notifications_by_follows

notification_bp = Blueprint('notification', __name__)

notification_bp.route('/', methods=['GET'])(get_notifications)
notification_bp.route('/submit', methods=['POST'])(submit_notification)
notification_bp.route('/<int:notification_id>', methods=['DELETE'])(delete_notification)
notification_bp.route('/get_by_email/<string:email>',
              methods=['GET'])(get_notifications_by_email)
notification_bp.route('/get_by_report_id/<int:report_id>',
              methods=['GET'])(get_notifications_by_report_id)
notification_bp.route('/submit_notifications_by_follows/<int:report_id>',
              methods=['GET'])(submit_notifications_by_follows)