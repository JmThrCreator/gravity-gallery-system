from app.main import bp
from flask import render_template, redirect, request, url_for
from app.utils.load import get_images, load_images, get_image_count
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from app import db
from app.main.forms import ImageForm, LinkForm
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
		username = user.username
		path = user.path_id
		images = get_images(path, "small")

		link = user.page_link
		return render_template("gallery.html", images = images, user=username, link=link)

@bp.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
	
	imageForm = ImageForm()
	linkForm = LinkForm()

	if "remove" in request.form:
		filepath = request.form["remove"]
		filename = os.path.basename(filepath)

		user = User.query.filter_by(username=current_user.username).first()
		path = user.path_id

		if os.path.exists(os.path.join(basedir, staticdir, "upload", path, "small", filename)):
			os.remove(os.path.join(basedir, staticdir, "upload", path, "small", filename))
			os.remove(os.path.join(basedir, staticdir, "upload", path, "large", filename))
			os.remove(os.path.join(basedir, staticdir, "upload", path, "raw", filename))
		
		load_images(path)
		return redirect(url_for("main.profile"))

	elif imageForm.validate_on_submit():
		user = current_user
		path = user.path_id
		count = get_image_count(path)

		if count >= 9:
			return redirect(url_for("main.profile"))

		filename = secure_filename(imageForm.file.data.filename)
		if filename.endswith((".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG")):
			imageForm.file.data.save(os.path.join(basedir, staticdir, "upload", current_user.path_id, "raw", filename))
		else:
			error = "Invalid file type. Please upload a .png, .jpg, or .jpeg file."
			images = get_images(path, "small", static=True)
			link = user.page_link
			return render_template("profile.html", images = images, imageForm=imageForm, linkForm=linkForm, link=link, error=error)

		load_images(path)
		return redirect(url_for("main.profile"))
	
	elif linkForm.validate_on_submit():
		user = current_user
		link = linkForm.link.data
		user.page_link = link
		db.session.commit()

	user = current_user
	path = user.path_id
	images = get_images(path, "small", static=True)
	link = user.page_link

	return render_template("profile.html", images = images, imageForm=imageForm, linkForm=linkForm, link=link)