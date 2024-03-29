from flask import render_template
from settings import app
from routes import admin, household, item, profile, user_management


@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
	return render_template("404.html"), 404


@app.errorhandler(500)
def internal_server_error(e):
	return render_template("500.html"), 500


if __name__ == "__main__":
	app.run(debug=True)
