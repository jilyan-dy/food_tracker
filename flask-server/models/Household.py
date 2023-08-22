from settings import db


class Household(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(20), nullable=False, unique=True)
	members = db.relationship('User', backref='house')

	def __repr__(self):
		return '<Household %r>' % self.id

	def __str__(self) -> str:
		return self.name
