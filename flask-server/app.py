from flask import Flask, request, render_template, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
	UserMixin, login_user, LoginManager, login_required, logout_user, current_user)
from flask_migrate import Migrate

from werkzeug.security import generate_password_hash, check_password_hash

from database.credentials import USERNAME, PASSWORD, SECRET_KEY, DBNAME
from webforms import LoginForm, UserForm, ItemForm

from datetime import datetime


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


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), nullable=False, unique=True)
	email = db.Column(db.String(64), nullable=False, unique=True)
	password_hash = db.Column(db.String(255), nullable=False)
	date_added = db.Column(db.DateTime, default=datetime.utcnow)
	admin = db.Column(db.Boolean, default=False)
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
		return self.username + " " + self.email + " " + self.admin


class Item(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	name = db.Column(db.String(64), nullable=False)
	category = db.Column(db.String(64), nullable=False)
	quantity = db.Column(db.Integer, nullable=False)
	date_expire = db.Column(db.DateTime, nullable=False)
	location = db.Column(db.String(64), nullable=False)
	note = db.Column(db.String(255))

	def __repr__(self):
		return '<Item %r>' % self.id

	def __str__(self) -> str:
		return self.name + " " + self.category + " " + \
			self.quantity + " " + self.date_expire + " " + self.location


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		user = User.query.filter_by(username=form.username.data).first()

		if user:

			if user.verify_password(form.password.data):
				login_user(user)
				return redirect('/items')

			else:
				print("Wrong Password - Try Again!")

		else:
			print("That User Doesn't Exist! Try Again...")

	return render_template('login.html', form=form)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
	logout_user()
	return redirect('/')


# @app.route('/register', methods=['GET', 'POST'])
# def add_user():
# 	user = None
# 	form = UserForm()
# 	if form.validate_on_submit():
# 		valid_info = User.query.filter(
# 			(User.email == form.email.data) | (User.username == form.username.data)).first()

# 		if valid_info is None:
# 			user = User(
# 				username=form.username.data,
# 				email=form.email.data,
# 				password=form.password.data)

# 			try:
# 				db.session.add(user)
# 				db.session.commit()

# 				print("User Added Successfully!")
# 				return redirect('/login')

# 			except Exception as e:
# 				# return str(e)
# 				return "There was an issue adding your info. Please try again."

# 		else:
# 			print("User Already Exists")

# 		form.username.data = ''
# 		form.email.data = ''
# 		form.password.data = ''
# 		form.password2.data = ''

# 	return render_template(
# 		"register.html",
# 		form=form)


@app.route('/register', methods=['GET', 'POST'])
def add_user():
	user = None
	content = request.json
	print("got content")
	print(content['username'])
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
			return {"Issue": "Failed to add new user"}

	else:
		print("User Already Exists")
		return {"Issue": "User already exists"}


@app.route('/profile/delete/<int:id>')
def delete_user(id):
	user_to_delete = User.query.get_or_404(id)

	if current_user.id == user_to_delete.id:
		try:
			db.session.delete(user_to_delete)
			db.session.commit()
			return redirect('/items')

		except Exception as e:
			return "There was an issue with delete the user."

	else:
		return "You're not allowed to delete other users"


@app.route('/profile/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update_user(id):
	user = User.query.get_or_404(id)
	form = UserForm()

	if form.validate_on_submit():
		user.username = form.username.data
		user.email = form.email.data
		user.password = form.password.data

		try:
			db.session.commit()

		except Exception as e:
			return "There was an issue with updating your profile."

	else:
		form.username.data = user.username
		form.email.data = user.email
		form.password.data = ''
		form.password2.data = ''

	return render_template('profile_update.html', form=form, id=id)


@app.route('/items', methods=['GET', 'POST'])
@login_required
def add_item():
	form = ItemForm()

	if form.validate_on_submit():
		owner_id = current_user.id
		valid_info = Item.query.filter(Item.name == form.name.data).first()

		if valid_info is None:
			item = Item(
				name=form.name.data,
				category=form.category.data,
				quantity=form.quantity.data,
				date_expire=form.date_expire.data,
				location=form.location.data,
				note=form.note.data,
				owner_id=owner_id)
			try:
				db.session.add(item)
				db.session.commit()

				print("Item Added Successfully!")
				return redirect('/items')

			except Exception as e:
				# return str(e)
				return "There was an issue with adding your item."

		else:
			print("Item Already Exists. Consider updating exiting item")

		form.name.data = ''
		form.category.data = ''
		form.quantity.data = ''
		form.location.data = ''
		form.note.data = ''

	items = Item.query.filter_by(owner_id=current_user.id).order_by(Item.date_expire).all()

	return render_template(
		"item_list.html",
		form=form,
		items=items)


@app.route('/items/delete/<int:id>')
@login_required
def delete_item(id):
	item = Item.query.get_or_404(id)
	if item.owner_id == current_user.id:

		try:
			db.session.delete(item)
			db.session.commit()
			return redirect('/items')

		except Exception as e:
			return "There was an issue with delete the item."
	
	else:
		print("You do not have delete access")
		return "You do not have delete access"


@app.route('/items/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update_item(id):
	item = Item.query.get_or_404(id)
	if item.owner_id == current_user.id:
		form = ItemForm()

		if form.validate_on_submit():
			item.name = form.name.data
			item.category = form.category.data
			item.quantity = form.quantity.data
			item.date_expire = form.date_expire.data
			item.location = form.location.data
			item.note = form.note.data

			try:
				db.session.commit()
				return redirect('/items')

			except Exception as e:
				return "There was an issue with updating this item."

		else:
			form.name.data = item.name
			form.category.data = item.category
			form.quantity.data = item.quantity
			form.date_expire.data = item.date_expire
			form.location.data = item.location
			form.note.data = item.note

			return render_template('item_update.html', form=form)

	else:
		print("You do not have edit access")
		return "You do not have edit access"


@app.errorhandler(404)
def page_not_found(e):
	return render_template("404.html"), 404


@app.errorhandler(500)
def internal_server_error(e):
	return render_template("500.html"), 500


if __name__ == "__main__":
	app.run(debug=True)
