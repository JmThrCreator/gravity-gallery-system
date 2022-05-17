from flask_wtf import FlaskForm
from wtforms import SubmitField
from flask_wtf.file import FileField, FileAllowed, FileRequired

class ImageForm(FlaskForm):
    file = FileField("File", validators=[FileRequired(), FileAllowed(["jpg", "png", "jpeg", "JPG", "PNG", "JPEG"], "Images only!")])
    submit = SubmitField("Upload")