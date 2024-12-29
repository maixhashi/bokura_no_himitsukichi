from PIL import Image

def flip_image_horizontally(input_path, output_path):
    try:
        # 画像を開く
        image = Image.open(input_path)
        
        # 左右反転する
        flipped_image = image.transpose(Image.FLIP_LEFT_RIGHT)
        
        # 反転した画像を保存
        flipped_image.save(output_path)
        print(f"反転した画像を保存しました: {output_path}")
    except Exception as e:
        print(f"エラーが発生しました: {e}")

# 使用例
input_image_path = "input_image.png"  # 入力画像のパス
output_image_path = "output_image.png"  # 出力画像のパス

flip_image_horizontally(input_image_path, output_image_path)
