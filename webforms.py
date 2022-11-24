from datetime import datetime, timedelta
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.fields.html5 import EmailField, DateField, IntegerField
from wtforms.validators import DataRequired, Email, EqualTo, NumberRange, Optional
from flask_ckeditor import CKEditorField


CATEGORY_CHOICES = ["Perishable", "Non Perishable", "Condiments"]
LOCATION_CHOICES = ["Freezer", "Fridge", "Kitchen", "Cabinet"]


# Add User Form
class UserForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired()])
	email = EmailField("Email", validators=[DataRequired(), Email()])
	password = PasswordField(
		'Password',
		validators=[DataRequired(), EqualTo('password2', message='Passwords Must Match!')])
	password2 = PasswordField('Confirm Password', validators=[DataRequired()])
	submit = SubmitField("Sign Up")


# Login Form
class LoginForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired()])
	password = PasswordField("Password", validators=[DataRequired()])
	submit = SubmitField("Login")


# item form
class ItemForm(FlaskForm):
	name = StringField("Item Name", validators=[DataRequired()])
	category = SelectField("Category", validators=[DataRequired()], choices=CATEGORY_CHOICES)
	quantity = IntegerField(
		"Quantity",
		validators=[
			DataRequired(),
			NumberRange(min=1, message="Invalid Quantity")])
	date_expire = DateField(
		"Expiration Date",
		validators=[DataRequired()],
		format="%Y-%m-%d",
		default=datetime.now().date() + timedelta(days=14))
	location = SelectField(
		"Stored In",
		validators=[DataRequired()],
		choices=LOCATION_CHOICES)
	note = CKEditorField("Note", validators=[Optional(strip_whitespace=True)])
	submit = SubmitField("Submit")

	def validate_on_submit(self):
		result = super(ItemForm, self).validate()
		if (self.date_expire.data < datetime.now().date()):
			return False
		else:
			return result
