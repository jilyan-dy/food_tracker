from flask import request, redirect
from flask_login import current_user, login_required

from settings import app, db
from models.User import User


@app.route('/api/admin', methods=['POST'])
@login_required
def add_admin(content=None):
	if current_user.admin:
		if content is None:
			content = request.json
		member = User.query.get_or_404(content['memberId'])

		if member.houseId == current_user.houseId and member.verified:
			member.admin = True

			try:
				db.session.commit()
				print("Admin Added Successfully")
				return redirect('/house')

			except Exception:
				return {"issue": "There was an issue with adding this member as admin."}

	else:
		return {"issue": "You do not have admin access."}


@app.route('/api/admin', methods=['PUT'])
@login_required
def change_admin():
	if current_user.admin:
		add_admin(request.json)
		remove_admin(request.json)


@app.route('/api/admin', methods=['DELETE'])
@login_required
def remove_admin(content=None):
	if current_user.admin:
		if content is None:
			content = request.json
		member = User.query.get_or_404(content['memberId'])

		if member.houseId == current_user.houseId and member.admin:
			member.admin = False

			try:
				db.session.commit()
				print("Admin Removed Successfully")
				return redirect('/house')

			except Exception:
				return {"issue": "There was an issue with removing this member as admin."}

	else:
		return {"issue": "You do not have admin access."}
