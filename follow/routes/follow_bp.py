from flask import Blueprint
from controllers.FollowController import submit_follow, delete_follow, get_follows_by_email

follow_bp = Blueprint('follow', __name__)

follow_bp.route('/submit', methods=['POST'])(submit_follow)
follow_bp.route('/<int:follow_id>', methods=['DELETE'])(delete_follow)
follow_bp.route('/get_by_email/<string:email>',
              methods=['GET'])(get_follows_by_email)