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

# 整合性チェックと補完処理
def check_and_sync_rewards():
    db_tmdb_ids = set(RewardImage.objects.values_list("tmdb_id", flat=True))
    file_tmdb_ids = set()

    # ファイルシステム内のtmdb_idを収集
    for file_name in os.listdir(NEW_SAVE_DIR):
        if file_name.startswith("pixelized_") and file_name.endswith(".png"):
            tmdb_id = file_name.replace("pixelized_", "").replace(".png", "")
            file_tmdb_ids.add(tmdb_id)

    # データベースに存在しないIDをファイルから補完
    missing_in_db = file_tmdb_ids - db_tmdb_ids
    for tmdb_id in missing_in_db:
        RewardImage.objects.create(
            tmdb_id=tmdb_id,
            title=f"Title for {tmdb_id}",  # 必要ならデフォルトのタイトルを設定
            original_poster_url="",  # URLが不明な場合は空にする
            pixel_art_image=f"rewards/pixelized_{tmdb_id}.png"
        )

    # ファイルに存在しないIDをデータベースから補完
    missing_in_files = db_tmdb_ids - file_tmdb_ids
    for tmdb_id in missing_in_files:
        local_pixel_path = os.path.join(NEW_SAVE_DIR, f"pixelized_{tmdb_id}.png")
        create_pixelized_image_from_db(tmdb_id, local_pixel_path)

def create_pixelized_image_from_db(tmdb_id, save_path):
    try:
        # データベースから元画像のURLを取得してダウンロード
        reward = RewardImage.objects.get(tmdb_id=tmdb_id)
        if not reward.original_poster_url:
            print(f"Original poster URL not available for tmdb_id {tmdb_id}")
            return

        response = requests.get(reward.original_poster_url)
        response.raise_for_status()

        # 一時的に元画像を保存
        original_path = os.path.join(NEW_SAVE_DIR, f"original_{tmdb_id}.jpg")
        with open(original_path, 'wb') as f:
            f.write(response.content)

        # ピクセルアートを生成
        convert_to_pixel_art(original_path, save_path)
        print(f"Pixelized image created for tmdb_id: {tmdb_id}")

    except Exception as e:
        print(f"Error creating pixelized image for {tmdb_id}: {e}")

class Command(BaseCommand):
    help = "Fetch and process movie posters as rewards"

    def handle(self, *args, **kwargs):
        # 整合性チェックと補完処理を実行
        check_and_sync_rewards()

        posters = fetch_random_movie_posters()

        for poster in posters:
            title = poster['title']
            original_url = poster['poster_url']

            self.stdout.write(f"Original URL: {original_url}")
            
            try:
                tmdb_id = extract_tmdb_id(original_url)
                self.stdout.write(f"Extracted TMDB ID: {tmdb_id}")
            except Exception as e:
                self.stderr.write(f"Error extracting TMDB ID: {e}")
                continue

            local_original_path = os.path.join(NEW_SAVE_DIR, f"original/{tmdb_id}.jpg")
            local_pixel_path = os.path.join(NEW_SAVE_DIR, f"pixelized_{tmdb_id}.png")

            # ポスターをダウンロード
            try:
                os.makedirs(os.path.dirname(local_original_path), exist_ok=True)
                with open(local_original_path, 'wb') as f:
                    f.write(requests.get(original_url).content)
            except Exception as e:
                self.stderr.write(f"Error downloading poster: {e}")
                continue

            # ピクセルアートに変換
            try:
                os.makedirs(NEW_SAVE_DIR, exist_ok=True)
                convert_to_pixel_art(local_original_path, local_pixel_path)
            except Exception as e:
                self.stderr.write(f"Error converting to pixel art: {e}")
                continue

            # データベースに保存
            try:
                with open(local_pixel_path, 'rb') as pixel_file:
                    reward = RewardImage.objects.create(
                        tmdb_id=tmdb_id,
                        title=title,
                        original_poster_url=original_url
                    )
                    reward.pixel_art_image.name = f"rewards/pixelized_{tmdb_id}.png"
                    reward.save()
                    self.stdout.write(f"Saved file: {reward.pixel_art_image.name}")
            except Exception as e:
                self.stderr.write(f"Error saving to database: {e}")
