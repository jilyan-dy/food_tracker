from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from settings import db


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
