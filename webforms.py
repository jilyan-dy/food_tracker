from datetime import datetime, timedelta
from flask_wtf import FlaskForm
from wtforms import (
	StringField, IntegerField, DateField,
	PasswordField, SubmitField, SelectField)
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, EqualTo
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


# Add item form
class ItemForm(FlaskForm):
	name = StringField("Item Name", validators=[DataRequired()])
	category = SelectField("Category", validators=[DataRequired()], choices=CATEGORY_CHOICES)
	quantity = IntegerField("Qty", validators=[DataRequired()])
	date_expire = DateField(
		"Expiration Date",
		validators=[DataRequired()],
		default=datetime.now().date() + timedelta(days=14))
	location = SelectField(
		"Stored In",
		validators=[DataRequired()],
		choices=LOCATION_CHOICES)
	note = CKEditorField("Note")
	submit = SubmitField("Add")
