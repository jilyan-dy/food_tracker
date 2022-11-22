from database_credentials import USERNAME, PASSWORD
from datetime import datetime
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + \
	USERNAME + ':' + PASSWORD + '@localhost/food_tracker_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Users(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), nullable=False)
	email = db.Column(db.String(64), nullable=False)
	password = db.Column(db.String(128), nullable=False)

	@property
	def password(self):
		raise AttributeError('Password is not a readable attribute!')

	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password)

	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)

	def __repr__(self):
		return '<Item %r>' % self.id

	def __str__(self) -> str:
		return self.username + " " + self.email


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


@app.route('/', methods=['POST', 'GET'])
def index():
	if request.method == 'POST':
		item_name = request.form['name']
		item_category = request.form['category']
		item_quantity = request.form['quantity']
		item_date_expire = request.form['date_expire']
		if item_date_expire == "":
			item_date_expire = datetime.now().date()
		item_location = request.form['location']
		new_item = Item(name=item_name,
						category=item_category,
						quantity=item_quantity,
						date_expire=item_date_expire,
						location=item_location)

		try:
			db.session.add(new_item)
			db.session.commit()
			return redirect('/')
		except Exception as e:
			# return str(e)
			# return new_item.__str__()
			return "There was an issue with adding your item."

	else:
		items = Item.query.order_by(Item.date_expire).all()
		return render_template('index.html', items=items)


@app.route('/delete/<int:id>')
def delete(id):
	item_to_delete = Item.query.get_or_404(id)

	try:
		db.session.delete(item_to_delete)
		db.session.commit()
		return redirect('/')
	except Exception as e:
		return "There was an issue with delete the item."


@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
	item = Item.query.get_or_404(id)

	if request.method == 'POST':
		item.name = request.form['name']
		item.category = request.form['category']
		item.quantity = request.form['quantity']
		item.date_expire = datetime.strptime(request.form['date_expire'], '%Y-%m-%d')
		item.location = request.form['location']

		try:
			db.session.commit()
			return redirect('/')
		except Exception as e:
			return "There was an issue with updating this item."	

	else:
		return render_template('update.html', item=item)


if __name__ == "__main__":
	app.run(debug=True)
