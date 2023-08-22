import json
from datetime import datetime
from flask import request, redirect
from flask_login import current_user, login_required

from settings import app, db
from models.Item import Item


@app.route('/api/items', methods=['GET', 'POST'])
@login_required
def add_item():
	if request.method == 'GET':
		items = Item.query.filter(
			((Item.userId == current_user.id) |
				(Item.shared == current_user.houseId) &
				(Item.quantity > 0))).order_by(Item.date_expire).all()
		json_items = json.dumps([item.to_json() for item in items])
		return json_items

	else:
		content = request.json
		valid_info = Item.query.filter(
			(Item.name == content['name']) & (Item.userId == current_user.id)).first()

		if valid_info is None:
			item = Item(
				name=content['name'],
				category=content['category'],
				quantity=content['quantity'],
				date_expire=datetime.strptime(content['date_expire'], '%Y-%m-%dT%H:%M:%S.%fZ').date(),
				location=content['location'],
				shared=current_user.houseId if content['shared'] else 0,
				note=content['note'],
				userId=current_user.id
			)

			try:
				db.session.add(item)
				db.session.commit()

				print("Item Successfully Added")
				return redirect('/items')

			except Exception:
				return {"issue": "There was an issue adding your item"}

		else:
			valid_info.quantity += content['quantity']

			try:
				db.session.commit()
				return {"issue": "Item already exists. Updated quantity instead."}

			except Exception:
				return {"issue": "Item already exists. There was an issue updating item."}


@app.route('/api/items/<int:id>', methods=["DELETE"])
@login_required
def delete_item(id):
	item = Item.query.get_or_404(id)
	if item.userId == current_user.id or (
		current_user.houseId == item.shared and
		current_user.admin):

		try:
			db.session.delete(item)
			db.session.commit()
			return redirect('/items')

		except Exception:
			return {"issue": "There was an issue with delete the item."}

	else:
		print("You do not have delete access")
		return {"issue": "You do not have delete access"}


@app.route('/api/items/<int:id>', methods=['PUT'])
@login_required
def update_item(id):
	item = Item.query.get_or_404(id)
	if item.userId == current_user.id or item.shared == current_user.houseId:
		content = request.json

		item.name = content['name']
		item.category = content['category']
		item.quantity = content['quantity']
		item.date_expire = datetime.strptime(
			content['date_expire'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
		item.location = content['location']
		item.shared = current_user.houseId if content['shared'] else 0
		item.note = content['note']

		try:
			db.session.commit()
			print("everything went fine")
			return redirect('/items')

		except Exception:
			return {"issue": "There was an issue with updating this item."}

	print("You do not have edit access")
	return {"issue": "You do not have edit access"}
