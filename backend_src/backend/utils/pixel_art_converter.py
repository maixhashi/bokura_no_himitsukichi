from PIL import Image

def convert_to_pixel_art(input_path, output_path, pixel_size=5):
    with Image.open(input_path) as img:
        img = img.resize(
            (img.width // pixel_size, img.height // pixel_size),
            Image.NEAREST
        )
        img = img.resize(
            (img.width * pixel_size, img.height * pixel_size),
            Image.NEAREST
        )
        img.save(output_path)
