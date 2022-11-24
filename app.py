from credentials import USERNAME, PASSWORD, SECRET_KEY, DBNAME
from datetime import datetime
from flask import Flask, render_template, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from webforms import LoginForm, UserForm


app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + \
	USERNAME + ':' + PASSWORD + '@localhost/' + DBNAME
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
	return Users.query.get(int(user_id))


class Users(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), nullable=False, unique=True)
	email = db.Column(db.String(64), nullable=False, unique=True)
	password_hash = db.Column(db.String(255), nullable=False)
	date_added = db.Column(db.DateTime, default=datetime.utcnow)

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


class Item(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	# owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
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


@app.route('/signup', methods=['GET', 'POST'])
def add_user():
	user = None
	form = UserForm()
	if form.validate_on_submit():
		valid_info = Users.query.filter(
			(Users.email == form.email.data) | (Users.username == form.username.data)).first()
		if valid_info is None:
			user = Users(
				username=form.username.data,
				email=form.email.data,
				password=form.password.data)
			db.session.add(user)
			db.session.commit()

			a = Users.query.filter_by(username=form.username.data).first()
			print(a.password_hash)
			print("User Added Successfully!")

			return redirect('/login')

		else:
			print("User Already Exists")

		form.username.data = ''
		form.email.data = ''
		form.password.data = ''

	return render_template(
		"signup.html",
		form=form)


@app.route('/login', methods=['POST', 'GET'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		user = Users.query.filter_by(username=form.username.data).first()
		if user:
			if check_password_hash(user.password_hash, form.password.data):
				login_user(user)
				return redirect('/items')
			else:
				print("Wrong Password - Try Again!")
		else:
			print("That User Doesn't Exist! Try Again...")

	return render_template('login.html', form=form)


@app.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
	logout_user()
	return redirect('/')


@app.route('/items', methods=['POST', 'GET'])
@login_required
def add_item():
	if request.method == 'POST':
		item_name = request.form['name']
		item_category = request.form['category']
		item_quantity = request.form['quantity']
		item_date_expire = request.form['date_expire']
		if item_date_expire == "":
			item_date_expire = datetime.now().date()
		item_location = request.form['location']
		new_item = Item(
			name=item_name,
			category=item_category,
			quantity=item_quantity,
			date_expire=item_date_expire,
			location=item_location)

		try:
			db.session.add(new_item)
			db.session.commit()
			return redirect('/items')
		except Exception as e:
			# return str(e)
			# return new_item.__str__()
			return "There was an issue with adding your item."

	else:
		items = Item.query.order_by(Item.date_expire).all()
		return render_template('item_list.html', items=items)


@app.route('/delete/<int:id>')
@login_required
def item_delete(id):
	item_to_delete = Item.query.get_or_404(id)

	try:
		db.session.delete(item_to_delete)
		db.session.commit()
		return redirect('/items')
	except Exception as e:
		return "There was an issue with delete the item."


@app.route('/update/<int:id>', methods=['GET', 'POST'])
@login_required
def item_update(id):
	item = Item.query.get_or_404(id)

	if request.method == 'POST':
		item.name = request.form['name']
		item.category = request.form['category']
		item.quantity = request.form['quantity']
		item.date_expire = datetime.strptime(request.form['date_expire'], '%Y-%m-%d')
		item.location = request.form['location']

		try:
			db.session.commit()
			return redirect('/items')
		except Exception as e:
			return "There was an issue with updating this item."	

	else:
		return render_template('item_update.html', item=item)


if __name__ == "__main__":
	app.run(debug=True)
