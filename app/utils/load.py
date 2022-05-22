import os
from PIL import Image
from config import basedir, staticdir

def load_images(path):

    upload_path = os.path.join(basedir, staticdir, "upload", path)
    raw_path = os.path.join(basedir, staticdir, "upload", path, "raw")

    # Clear small folder
    small_folder_path = os.path.join(staticdir, "upload", path, "small")
    for filename in os.listdir(small_folder_path):
        file_path = os.path.join(small_folder_path, filename)
        os.remove(file_path)
    
    # Clear large folder
    large_folder_path = os.path.join(staticdir, "upload", path, "large")
    for filename in os.listdir(large_folder_path):
        file_path = os.path.join(large_folder_path, filename)
        os.remove(file_path)

    # Load images
    for filename in os.listdir(raw_path):
        if filename.endswith((".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG")):
            image_path = os.path.join(raw_path, filename)
            resize(image_path, upload_path, filename, "small")
            resize(image_path, upload_path, filename, "large")


def resize(image_path, upload_path, filename, size="small"):

    # Get size
    width, height = get_new_size(image_path, size)

    # Create new filename
    path = os.path.join(upload_path, size, filename)

    # Resize image
    image = Image.open(image_path)
    image = image.resize((width, height))
    image.save(path)

def get_new_size(image_path="", size="small"):

    # Get size value
    size_map = {"small": 1, "large": 3}
    size_value = size_map[size]

    # Get image
    path = os.path.join(image_path)
    image = Image.open(path)

    # Resize image
    width, height = image.size
    perimiter = 1120*size_value

    # Landscape
    if width > height:
        ratio = width/height
        height = perimiter/(ratio+1)
        width = perimiter-height
        height = height/2
        width = width/2
    # Portrait
    elif width < height:
        ratio = height/width
        width = perimiter/(ratio+1)
        height = perimiter-width
        height = height/2
        width = width/2
    # Square
    else:
        width = perimiter/2
        height = perimiter/2

    width, height = round(width), round(height)
    return(width, height)

def get_size(path):
    image = Image.open(path)
    width, height = image.size
    return(width, height)

def get_image(image, path, size="small", static=False):
    full_path = os.path.join(basedir, staticdir, "upload", path, size, image)
    width, height = get_size(full_path)
    
    if static == True:
        static_path = os.path.join("static", "upload", path, size, image)
    else:
        static_path = os.path.join("upload", path, size, image)
    return {"path":static_path, "width":width, "height":height}

def get_images(path, size="small", static=False):
    images = []
    for file in os.listdir(os.path.join(basedir, staticdir, "upload", path, size)):
        if file.endswith((".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG")):
            images.append(get_image(file, path, size, static))
    return images

def get_image_count(path):
    count = 0
    for file in os.listdir(os.path.join(basedir, staticdir, "upload", path, "raw")):
        if file.endswith((".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG")):
            count += 1
    return count