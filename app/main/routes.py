from app.main import bp
from flask import render_template, redirect, request, url_for
from app.utils.load import get_images, load_images
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from app import db
from app.main.forms import ImageForm
from werkzeug.utils import secure_filename
from config import basedir, staticdir
import os

@bp.route("/", methods=["GET", "POST"])
@bp.route("/index", methods=["GET", "POST"])
def index():
	if request.method == "POST":
		if "login" in request.form:
			return redirect(url_for("auth.login"))
		elif "signup" in request.form:
			return redirect(url_for("auth.signup"))
		elif "logout" in request.form:
			return redirect(url_for("auth.logout"))
	return render_template("index.html", authenticated=current_user.is_authenticated)

@bp.route("/gallery", methods=["GET", "POST"])
def gallery():
	
	name = "jmay"
	user = User.query.filter_by(username=name).first()
	if user is None:
		return redirect(url_for("main.index"))
	else:
		path = user.path_id
		load_images(path)
		images = get_images(path, "small")
		return render_template("gallery.html", images = images)
	
@bp.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
	
	form = ImageForm()
	print(form.file.data)
	print(form.file)

	if form.validate_on_submit():
		filename = secure_filename(form.file.data)
		form.image.save(os.path.join(basedir, staticdir, "upload", current_user.path_id, "raw", filename))
		return redirect(url_for("main.profile"))

	user = User.query.filter_by(username=current_user.username).first()
	path = user.path_id
	load_images(path)
	images = get_images(path, "small")

	return render_template("profile.html", images = images, form = form)