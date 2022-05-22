from app.main import bp
from flask import render_template, redirect, request, url_for
from app.utils.load import get_images, load_images, get_image_count
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
	
	# get all names in the database
	usernames = [user.username for user in User.query.all()]

	return render_template("index.html", authenticated=current_user.is_authenticated, usernames=usernames)

@bp.route("/gallery", methods=["GET", "POST"])
@bp.route("/gallery/<user>", methods=["GET", "POST"])
def gallery(user=None):
	name = user
	user = User.query.filter_by(username=name).first_or_404()
	if user is None:
		return redirect(url_for("main.index"))
	else:
		path = user.path_id
		images = get_images(path, "small")
		return render_template("gallery.html", images = images)

@bp.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
	
	form = ImageForm()

	if "remove" in request.form:
		filepath = request.form["remove"]
		filename = os.path.basename(filepath)

		user = User.query.filter_by(username=current_user.username).first()
		path = user.path_id

		if os.path.exists(os.path.join(basedir, staticdir, "upload", path, "small", filename)):
			os.remove(os.path.join(basedir, staticdir, "upload", path, "small", filename))
			os.remove(os.path.join(basedir, staticdir, "upload", path, "large", filename))
			os.remove(os.path.join(basedir, staticdir, "upload", path, "raw", filename))
		return redirect(url_for("main.profile"))
	elif form.validate_on_submit():
		user = current_user
		path = user.path_id

		count = get_image_count(path)

		if count >= 9:
			return redirect(url_for("main.profile"))

		filename = secure_filename(form.file.data.filename)
		form.file.data.save(os.path.join(basedir, staticdir, "upload", current_user.path_id, "raw", filename))


		load_images(path)
		return redirect(url_for("main.profile"))

	user = User.query.filter_by(username=current_user.username).first()
	path = user.path_id
	load_images(path)
	images = get_images(path, "small", static=True)

	return render_template("profile.html", images = images, form=form)