from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField
from wtforms.validators import DataRequired, URL
from flask_wtf.file import FileField, FileAllowed, FileRequired

class ImageForm(FlaskForm):
    file = FileField("File", validators=[FileRequired(), FileAllowed(["jpg", "png", "jpeg", "JPG", "PNG", "JPEG"], "Images only!")])
    submit = SubmitField("Upload")

class LinkForm(FlaskForm):
    link = StringField("Link", validators=[DataRequired(), URL()])
    submit = SubmitField("Submit")