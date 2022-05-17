from flask import Flask
from config import Config as config_class
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

# create app
app = Flask(__name__)

# config
app.config.from_object(config_class)

# db
db = SQLAlchemy(app)
migrate = Migrate(app, db)

#login
login = LoginManager(app)

# blueprints
from app.main import bp as main_bp
app.register_blueprint(main_bp)

from app.auth import bp as auth_bp
app.register_blueprint(auth_bp)

from app import models