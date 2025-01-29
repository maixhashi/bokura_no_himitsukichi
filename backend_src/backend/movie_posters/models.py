import os
import requests
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from utils.pixel_art_converter import convert_to_pixel_art

def upload_to(instance, filename):
    # ファイル名を生成 (例: pixelized_<tmdb_id>.png)
    return f"pixel_art/{filename}"


class MoviePoster(models.Model):
    tmdb_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    poster_url = models.URLField(max_length=200)
    pixel_art_image_path = models.CharField(max_length=100, null=True, blank=True)

    def save(self, *args, **kwargs):
        # フロントエンドの保存ディレクトリを設定
        frontend_base_dir = os.path.abspath(os.path.join(settings.BASE_DIR, "../../frontend_src/node/frontend/public/assets/movie_posters"))
        original_path = os.path.join(frontend_base_dir, f"{self.tmdb_id}.jpg")
        pixel_art_path = os.path.join(frontend_base_dir, f"pixelized_{self.tmdb_id}.png")

        try:
            # 保存ディレクトリ作成
            os.makedirs(frontend_base_dir, exist_ok=True)

            # ポスター画像のダウンロード
            if not os.path.exists(original_path):  # ダウンロード済みでない場合のみ実行
                with open(original_path, "wb") as f:
                    response = requests.get(self.poster_url)
                    response.raise_for_status()
                    f.write(response.content)
                print(f"Downloaded poster to: {original_path}")

            # ピクセルアートの生成
            if not os.path.exists(pixel_art_path):  # ピクセル化済みでない場合のみ実行
                convert_to_pixel_art(original_path, pixel_art_path)
                print(f"Pixel art generated at: {pixel_art_path}")

            # ピクセルアートのパスを保存
            self.pixel_art_image_path = f"movie_posters/pixelized_{self.tmdb_id}.png"

        except Exception as e:
            print(f"Error processing poster {self.tmdb_id}: {e}")
            raise

        super().save(*args, **kwargs)
