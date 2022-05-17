from app.auth import bp
from flask import render_template, redirect, request, url_for
from app.auth.forms import LoginForm, SignupForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from app import db
import os
from config import basedir, staticdir

@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()

        if user is None or not user.check_password(form.password.data):
            return redirect(url_for("auth.login"))
        
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for("main.gallery"))
    
    return render_template("auth/login.html", form=form)

@bp.route("/signup", methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = SignupForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        user.set_path_id()
        db.session.add(user)
        db.session.commit()

        os.makedirs(os.path.join(basedir, staticdir, "upload", user.path_id))
        os.makedirs(os.path.join(basedir, staticdir, "upload", user.path_id, "raw"))
        os.makedirs(os.path.join(basedir, staticdir, "upload", user.path_id, "small"))
        os.makedirs(os.path.join(basedir, staticdir, "upload", user.path_id, "large"))

        return redirect(url_for('auth.login'))
    return render_template("auth/signup.html", form=form)

@bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('main.index'))
