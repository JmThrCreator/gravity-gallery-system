import os

# gets base directory

basedir = os.path.abspath(os.path.dirname(__file__))
staticdir = os.path.join("app", "static")

# create config class

class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "secret"
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False