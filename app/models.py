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
    page_link = db.Column(db.String(64), index=True, unique=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)

    # password
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # path id
    
    def set_path_id(self):
        self.path_id = str(uuid.uuid4())


    def get_path_id(self):
        return self.path_id

    # page link

    def set_page_link(self, page_link):
        self.page_link = page_link

    def get_page_link(self):
        return self.page_link

@login.user_loader
def load_user(id):
    return User.query.get(int(id))