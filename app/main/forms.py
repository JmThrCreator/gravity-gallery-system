from flask_wtf import FlaskForm
from wtforms import SubmitField
from flask_wtf.file import FileField

class ImageForm(FlaskForm):
    file = FileField('File')
    submit = SubmitField('Upload')