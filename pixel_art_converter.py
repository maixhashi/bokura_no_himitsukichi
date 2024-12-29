from PIL import Image

def image_to_pixel_art(image_path, output_path, target_size=(32, 32)):
    # 画像を開く
    img = Image.open(image_path)

    # 画像を指定したサイズにリサイズ
    img_pixel_art = img.resize(target_size, Image.NEAREST)

    # 変換した画像を保存
    img_pixel_art.save(output_path)

# 使用例
image_to_pixel_art('input_image.png', 'output_pixel_art_128x128.png', target_size=(128, 128))
