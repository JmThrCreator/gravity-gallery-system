from werkzeug.security import generate_password_hash, check_password_hash
from app import db, login
from flask_login import UserMixin
import uuid

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    path_id = db.Column(db.String(36), unique=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def set_path_id(self):
        self.path_id = str(uuid.uuid4())

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_path_id(self):
        return self.path_id

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Path {}>'.format(self.image_id)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))