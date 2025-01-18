import sys
import os
import requests
from urllib.parse import urlparse
from django.core.files import File
from django.core.management.base import BaseCommand
from treasure_rewards.models import RewardImage
from utils.tmdb_api import fetch_random_movie_posters
from utils.pixel_art_converter import convert_to_pixel_art

# TMDB IDを抽出する関数
def extract_tmdb_id(url):
    parsed_url = urlparse(url)
    filename = os.path.basename(parsed_url.path)
    tmdb_id = os.path.splitext(filename)[0]
    return tmdb_id

# プロジェクトルートから新しい保存先ディレクトリを設定
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
NEW_SAVE_DIR = os.path.join(BASE_DIR, "frontend_src/node/frontend/public/assets/rewards")

# デバッグ出力で確認
print(f"NEW_SAVE_DIR: {NEW_SAVE_DIR}")

class Command(BaseCommand):
    help = "Fetch and process movie posters as rewards"

    def handle(self, *args, **kwargs):
        posters = fetch_random_movie_posters()

        for poster in posters:
            title = poster['title']
            original_url = poster['poster_url']

            # デバッグ用にURLと抽出されるTMDB IDを出力
            self.stdout.write(f"Original URL: {original_url}")
            
            try:
                # TMDB IDを抽出
                tmdb_id = extract_tmdb_id(original_url)
                self.stdout.write(f"Extracted TMDB ID: {tmdb_id}")
            except Exception as e:
                self.stderr.write(f"Error extracting TMDB ID: {e}")
                continue

            # 新しい保存先パスを生成
            local_original_path = os.path.join(NEW_SAVE_DIR, f"original/{tmdb_id}.jpg")
            local_pixel_path = os.path.join(NEW_SAVE_DIR, f"pixelized_{tmdb_id}.png")  # 修正

            # オリジナルポスターをダウンロード
            try:
                os.makedirs(os.path.dirname(local_original_path), exist_ok=True)
                with open(local_original_path, 'wb') as f:
                    f.write(requests.get(original_url).content)
            except Exception as e:
                self.stderr.write(f"Error downloading poster: {e}")
                continue

            # ピクセルアートに変換
            try:
                os.makedirs(NEW_SAVE_DIR, exist_ok=True)  # 修正: ピクセルアートは rewards/ 直下
                convert_to_pixel_art(local_original_path, local_pixel_path)
            except Exception as e:
                self.stderr.write(f"Error converting to pixel art: {e}")
                continue

            # データベースに保存
            try:
                with open(local_pixel_path, 'rb') as pixel_file:
                    reward = RewardImage.objects.create(
                        title=title,
                        original_poster_url=original_url,
                    )
                    
                    # 保存されるファイル名を確認
                    saved_filename = f"pixelized_{tmdb_id}.png"
                    self.stdout.write(f"Saving file with name: {saved_filename}")
                    
                    reward.pixel_art_image.name = f"rewards/{saved_filename}"  # 修正: 直接パスを指定
                    reward.save()
                    
                    # 保存後の実際のファイルパスを出力
                    self.stdout.write(f"Saved file: {reward.pixel_art_image.name}")
            except Exception as e:
                self.stderr.write(f"Error saving to database: {e}")
