from PIL import Image

def image_to_pixel_art(image_path, output_path, target_size=(32, 32)):
    # 画像を開く
    img = Image.open(image_path)

    # 画像を指定したサイズにリサイズ
    img_pixel_art = img.resize(target_size, Image.NEAREST)

    # 変換した画像を保存
    img_pixel_art.save(output_path)

# 使用例
image_to_pixel_art('input_image.jpg', 'output_pixel_art_16x16.png', target_size=(16, 16))
image_to_pixel_art('input_image.jpg', 'output_pixel_art_20x20.png', target_size=(20, 20))
image_to_pixel_art('input_image.jpg', 'output_pixel_art_24x24.png', target_size=(24, 24))
image_to_pixel_art('input_image.jpg', 'output_pixel_art_32x32.png', target_size=(32, 32))
image_to_pixel_art('input_image.jpg', 'output_pixel_art_64x64.png', target_size=(64, 64))
image_to_pixel_art('input_image.jpg', 'output_pixel_art_128x128.png', target_size=(128, 128))
