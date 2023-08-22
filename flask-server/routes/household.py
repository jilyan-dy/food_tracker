import json
from flask import request, redirect
from flask_login import current_user, login_required

from settings import app, db
from models.User import User
from models.Household import Household


@app.route('/api/house', methods=['GET'])
@login_required
def view_house():
	if current_user.houseId is None:
		houses = Household.query.all()
		# json_items = json.dumps([house.to_json() for house in houses])
		json_items = {}
		for house in houses:
			json_items[house.id] = house.name
		return json_items, 209

	house_id = current_user.houseId
	house = Household.query.filter(Household.id == house_id).first()
	members = User.query.filter(User.houseId == house_id).all()
	members_json = [member.to_json() for member in members]
	dumps = {"house_name": house.name, "admin": current_user.admin, "members": members_json}
	json_items = json.dumps(dumps)
	return json_items


@app.route('/api/house', methods=['POST'])
@login_required
def add_house():
	content = request.json
	valid_info = Household.query.filter(Household.name == content['name']).first()

	if valid_info is None:
		house = Household(
			name=content['name']
		)

		try:
			db.session.add(house)
			db.session.commit()

			print("Successfully Created House")

			house = Household.query.filter(Household.name == content['name']).first()
			join_house(house.id)

			return redirect('/house')

		except Exception:
			return {"issue": "There was an issue creating this house"}

	else:
		join_house(valid_info.id)
		return {"issue": "House already exists."}


@app.route('/api/house', methods=['DELETE'])
@login_required
def delete_house():
	house = Household.query.get_or_404(current_user.houseId)

	if current_user.admin:
		users = User.query.filter(User.houseId == current_user.houseId).all()
		if len(users) == 1:
			try:
				db.session.delete(house)
				db.session.commit()
				print("Delete Successful")
				return redirect('/house')

			except Exception:
				return {"issue": "There was an issue with deleting the house."}

		else:
			return {"issue": "The house still has other members."}

	else:
		return {"issue": "You do not have delete access for this house."}


# comeback
@app.route('/api/house/member', methods=['POST'])
@login_required
def join_house(houseId=-1):
	if houseId == -1:
		content = request.json
		houseId = content['house']

	house = Household.query.filter(Household.id == houseId).first()

	if house is None:
		return {"issue": "House doesn't exist"}

	user = User.query.get_or_404(current_user.id)
	first = User.query.filter(User.houseId == houseId).first()

	if user.houseId == houseId:
		return {"issue": "Current house"}

	if user.houseId is not None:
		user.verified = False

	if first is None:
		user.admin = True
		user.verified = True

	user.houseId = houseId

	try:
		db.session.commit()
		print("Added you to " + house.name)
		return redirect('/house')

	except Exception:
		return {"issue": "There was an issue with updating your profile."}


# comeback
@app.route('/api/house/member', methods=['PUT'])
@login_required
def verify_members():
	if current_user.admin:
		content = request.json
		member = User.query.get_or_404(content['memberId'])

		if member.houseId == current_user.houseId and not member.verified:
			member.verified = True

			try:
				db.session.commit()
				print("Verification Successful")
				return redirect('/house')

			except Exception:
				return {"issue": "There was an issue with verifying this member."}

	else:
		return {"issue": "You do not have access to verify other members."}


@app.route('/api/house/member', methods=['DELETE'])
@login_required
def leave_house():
	if current_user.houseId is not None:
		user = User.query.get_or_404(current_user.id)
		user.houseId = None
		user.verified = False
		user.admin = False

		try:
			db.session.commit()
			print("You have left your previous house.")
			return redirect('/house')

		except Exception:
			return {"issue": "There was an issue with leaving the house."}

	else:
		return {"issue": "You do not belong to a house. Please join a house first."}
