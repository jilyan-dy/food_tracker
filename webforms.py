from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, EqualTo


# Add User Form
class UserForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired()])
	email = EmailField("Email", validators=[DataRequired(), Email()])
	password = PasswordField(
		'Password',
		validators=[DataRequired(), EqualTo('password2', message='Passwords Must Match!')])
	password2 = PasswordField('Confirm Password', validators=[DataRequired()])
	submit = SubmitField("Sign Up")


# Create Login Form
class LoginForm(FlaskForm):
	username = StringField("Username", validators=[DataRequired()])
	password = PasswordField("Password", validators=[DataRequired()])
	submit = SubmitField("Login")
