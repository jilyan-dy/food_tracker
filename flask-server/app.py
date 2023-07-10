import json
from flask import Flask, request, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
	UserMixin, login_user, LoginManager, login_required, logout_user, current_user)
from flask_migrate import Migrate

from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from database.credentials import USERNAME, PASSWORD, SECRET_KEY, DBNAME


app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + \
	USERNAME + ':' + PASSWORD + '@localhost/' + DBNAME
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))


class Household(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(20), nullable=False, unique=True)
	members = db.relationship('User', backref='house')

	def __repr__(self):
		return '<Household %r>' % self.id

	def __str__(self) -> str:
		return self.name


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), nullable=False, unique=True)
	email = db.Column(db.String(64), nullable=False, unique=True)
	password_hash = db.Column(db.String(255), nullable=False)
	date_added = db.Column(db.DateTime, default=datetime.utcnow)
	admin = db.Column(db.Boolean, default=False, nullable=False)
	verified = db.Column(db.Boolean, default=False, nullable=False)
	active = db.Column(db.Boolean, default=True)
	houseId = db.Column(db.Integer, db.ForeignKey('household.id'))
	items = db.relationship('Item', backref='owner')

	@property
	def password(self):
		raise AttributeError('Password is not a readable attribute!')

	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password)

	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)

	def __repr__(self):
		return '<User %r>' % self.id

	def __str__(self) -> str:
		return self.username + " " + self.email

	def to_json(self):
		return {
			"id": self.id,
			"username": self.username,
			"admin": self.admin,
			"verified": self.verified,
		}


class Item(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userId = db.Column(db.Integer, db.ForeignKey('user.id'))
	name = db.Column(db.String(64), nullable=False)
	category = db.Column(db.String(64), nullable=False)
	quantity = db.Column(db.Integer, nullable=False)
	date_expire = db.Column(db.DateTime, nullable=False)
	location = db.Column(db.String(64), nullable=False)
	shared = db.Column(db.Boolean, default=False)
	note = db.Column(db.String(255))

	def __repr__(self):
		return '<Item %r>' % self.id

	def __str__(self) -> str:
		return self.name + " " + self.category + " " + \
			self.quantity + " " + self.date_expire + " " + self.location

	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"category": self.category,
			"quantity": self.quantity,
			"date_expire": self.date_expire.strftime("%Y-%m-%d"),
			"location": self.location,
			"note": self.note,
		}


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
	content = request.json
	user = User.query.filter_by(username=content['username']).first()

	if user:

		if user.verify_password(content['password']):
			login_user(user)
			return redirect('/items')

		else:
			print("Wrong Password - Try Again!")
			return {"issue": "Wrong Password - Try Again!"}

	else:
		print("That User Doesn't Exist! Try Again...")
		return {"issue": "That User Doesn't Exist! Try Again..."}


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
	logout_user()
	return redirect('/')


@app.route('/house')
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
	dumps = {"house_name": house.name, "admin":current_user.admin, "members": members_json}
	json_items = json.dumps(dumps)
	return json_items


@app.route('/house/add', methods=['GET', 'POST'])
@login_required
def add_house():
	if request.method != 'GET':
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

			except Exception as e:
				return {"issue": "There was an issue creating this house"}

		else:
			join_house(valid_info.id)
			return {"issue": "House already exists."}


@app.route('/house/join', methods=['GET', 'POST'])
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

	except Exception as e:
		return {"issue": "There was an issue with updating your profile."}


@app.route('/house/verify', methods=['GET', 'POST'])
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

			except Exception as e:
				return {"issue": "There was an issue with verifying this member."}

	else:
		return {"issue": "You do not have access to verify other members."}


@app.route('/house/leave', methods=['GET', 'POST'])
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

		except Exception as e:
			return {"issue": "There was an issue with leaving the house."}

	else:
		return {"issue": "You do not belong to a house. Please join a house first."}


@app.route('/house/delete')
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

			except Exception as e:
				return {"issue": "There was an issue with deleting the house."}

		else:
			return {"issue": "The house still has other members."}

	else:
		return {"issue": "You do not have delete access for this house."}


@app.route('/admin/add', methods=['GET', 'POST'])
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

			except Exception as e:
				return {"issue": "There was an issue with adding this member as admin."}

	else:
		return {"issue": "You do not have admin access."}


@app.route('/admin/remove', methods=['GET', 'POST'])
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

			except Exception as e:
				return {"issue": "There was an issue with removing this member as admin."}

	else:
		return {"issue": "You do not have admin access."}


@app.route('/admin/change', methods=['GET', 'POST'])
@login_required
def change_admin():
	if current_user.admin:
		add_admin(request.json)
		remove_admin(request.json)


@app.route('/register', methods=['GET', 'POST'])
@login_required
def add_user():
	user = None
	content = request.json
	valid_info = User.query.filter(
		(User.email == content['email']) | (User.username == content['username'])).first()
	if valid_info is None:
		user = User(
			username=content['username'],
			email=content['email'],
			password=content['password'])

		try:
			db.session.add(user)
			db.session.commit()

			print("User Added Successfully!")
			return redirect('/login')

		except Exception as e:
			# return str(e)
			print("There was an issue adding your info. Please try again.")
			return {"issue": "Failed to add new user"}

	else:
		print("User Already Exists")
		return {"issue": "User already exists"}


@app.route('/profile')
@login_required
def view_user():
	return {
		"username": current_user.username,
		"email": current_user.email,
		"date_added": current_user.date_added.strftime("%Y-%m-%d"),
		"admin": current_user.admin
	}


@app.route('/profile/update', methods=['GET', 'POST'])
@login_required
def update_user():
	if request.method == 'GET':
		return {
			"email": current_user.email,
		}

	else:
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

			except Exception as e:
				return {"issue": "There was an issue with updating your profile."}

		else:
			return {"issue": "Incorrect Password"}


@app.route('/profile/delete')
@login_required
def delete_user():
	user = User.query.get_or_404(current_user.id)
	try:
		logout_user()
		db.session.delete(user)
		db.session.commit()
		print("Delete Successful")
		return redirect('/')

	except Exception as e:
		return {"issue": "There was an issue with deleting the user."}


@app.route('/items', methods=['GET', 'POST'])
@login_required
def add_item():
	if request.method == 'GET':
		items = Item.query.filter_by(userId=current_user.id).order_by(Item.date_expire).all()
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
				note=content['note'],
				userId=current_user.id
			)

			try:
				db.session.add(item)
				db.session.commit()

				print("Item Successfully Added")
				return redirect('/items')

			except Exception as e:
				return {"issue": "There was an issue adding your item"}

		else:
			valid_info.quantity += content['quantity']

			try:
				db.session.commit()
				return {"issue": "Item already exists. Updated quantity instead."}

			except Exception as e:
				return {"issue": "Item already exists. There was an issue updating item."}


@app.route('/items/delete/<int:id>', methods=["DELETE"])
@login_required
def delete_item(id):
	item = Item.query.get_or_404(id)
	if item.userId == current_user.id:

		try:
			db.session.delete(item)
			db.session.commit()
			return redirect('/items')

		except Exception as e:
			return {"issue": "There was an issue with delete the item."}

	else:
		print("You do not have delete access")
		return {"issue": "You do not have delete access"}


@app.route('/items/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update_item(id):
	item = Item.query.get_or_404(id)
	if item.userId == current_user.id:
		content = request.json

		valid_edit = Item.query.filter(
			(Item.name == content['name']) & (Item.id != id)).first()

		if valid_edit is None:
			item.name = content['name']
			item.category = content['category']
			item.quantity = content['quantity']
			item.date_expire = datetime.strptime(
				content['date_expire'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
			item.location = content['location']
			item.note = content['note']

			try:
				db.session.commit()
				print("everything went fine")
				return redirect('/items')

			except Exception as e:
				return {"issue": "There was an issue with updating this item."}

		else:
			print("Updated name already exists")
			return {"issue": "Item already exists"}

	print("You do not have edit access")
	return {"issue": "You do not have edit access"}


# @app.route('/items/update/<int:id>', methods=['GET', 'POST'])
# @login_required
# def update_item(id):
# 	item = Item.query.get_or_404(id)
# 	if item.userId == current_user.id:
# 		form = ItemForm()

# 		if form.validate_on_submit():
# 			item.name = form.name.data
# 			item.category = form.category.data
# 			item.quantity = form.quantity.data
# 			item.date_expire = form.date_expire.data
# 			item.location = form.location.data
# 			item.note = form.note.data

# 			try:
# 				db.session.commit()
# 				return redirect('/items')

# 			except Exception as e:
# 				return "There was an issue with updating this item."

# 		else:
# 			form.name.data = item.name
# 			form.category.data = item.category
# 			form.quantity.data = item.quantity
# 			form.date_expire.data = item.date_expire
# 			form.location.data = item.location
# 			form.note.data = item.note

# 			return render_template('item_update.html', form=form)

# 	else:
# 		print("You do not have edit access")
# 		return "You do not have edit access"


@app.errorhandler(404)
def page_not_found(e):
	return render_template("404.html"), 404


@app.errorhandler(500)
def internal_server_error(e):
	return render_template("500.html"), 500


if __name__ == "__main__":
	app.run(debug=True)
