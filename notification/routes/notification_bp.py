from flask import Blueprint
from controllers.NotificationController import submit_notification, get_notifications, delete_notification

notification_bp = Blueprint('notification', __name__)

notification_bp.route('/', methods=['GET'])(get_notifications)
notification_bp.route('/submit', methods=['POST'])(submit_notification)
notification_bp.route('/<int:notification_id>', methods=['DELETE'])(delete_notification)
