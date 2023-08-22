from flask import request, redirect
from flask_login import (
	login_user, login_required, logout_user)

from settings import app, db, login_manager
from models.User import User


@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))


@app.route('/api/register', methods=['POST'])
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

		except Exception:
			# return str(e)
			print("There was an issue adding your info. Please try again.")
			return {"issue": "Failed to add new user"}

	else:
		print("User Already Exists")
		return {"issue": "User already exists"}


@app.route('/api/login', methods=['POST'])
def login():
	content = request.json
	user = User.query.filter_by(username=content['username']).first()

	if user:

		if user.verify_password(content['password']):
			login_user(user)
			print("Login Successful")
			return redirect('/items')

		else:
			print("Wrong Password - Try Again!")
			return {"issue": "Wrong Password - Try Again!"}

	else:
		print("That User Doesn't Exist! Try Again...")
		return {"issue": "That User Doesn't Exist! Try Again..."}


@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
	logout_user()
	return redirect('/')
