from flask import request, redirect
from flask_login import (
	current_user, login_required, logout_user)

from settings import app, db
from models.User import User
from models.Household import Household


@app.route('/api/profile', methods=['GET'])
@login_required
def view_user():
	house = Household.query.filter(Household.id == current_user.houseId).first()

	return {
		"username": current_user.username,
		"email": current_user.email,
		"date_added": current_user.date_added.strftime("%Y-%m-%d"),
		"admin": current_user.admin,
		"verified": current_user.verified,
		"house": house.name if house is not None else "No House Yet"
	}


@app.route('/api/profile', methods=['PUT'])
@login_required
def update_user():
	content = request.json
	user = User.query.get_or_404(current_user.id)

	if user.verify_password(content['password']):
		if content['update'] == "email":
			user.email = content['email']

		elif content['update'] == "password":
			user.password = content['newPassword']

		else:
			return {"issue": "Invalid Request"}

		try:
			db.session.commit()
			print("Update Successful")
			return redirect('/profile')

		except Exception:
			return {"issue": "There was an issue with updating your profile."}

	else:
		return {"issue": "Incorrect Password"}


@app.route('/api/profile', methods=['DELETE'])
@login_required
def delete_user():
	user = User.query.get_or_404(current_user.id)
	try:
		logout_user()
		db.session.delete(user)
		db.session.commit()
		print("Delete Successful")
		return redirect('/')

	except Exception:
		return {"issue": "There was an issue with deleting the user."}
