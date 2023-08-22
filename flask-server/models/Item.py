from settings import db


class Item(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userId = db.Column(db.Integer, db.ForeignKey('user.id'))
	name = db.Column(db.String(64), nullable=False)
	category = db.Column(db.String(64), nullable=False)
	quantity = db.Column(db.Integer, nullable=False)
	date_expire = db.Column(db.DateTime, nullable=False)
	location = db.Column(db.String(64), nullable=False)
	shared = db.Column(db.Integer, default=0)
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
			"shared": True if self.shared != 0 else False,
			"note": self.note,
		}
