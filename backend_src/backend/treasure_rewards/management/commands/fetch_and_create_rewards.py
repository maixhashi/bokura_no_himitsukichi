import os
import random
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from treasure_rewards.models import RewardImage
from movie_posters.models import MoviePoster
from utils.tmdb_api import fetch_random_movie_posters
from utils.pixel_art_converter import convert_to_pixel_art
from django.db import transaction
from urllib.parse import urlparse

# 環境に応じた保存先を設定
if os.getenv("DJANGO_ENV") == "production":
    MOVIE_POSTER_SAVE_DIR = "https://moviedig-frontend.onrender.com/public/assets/movie_posters"
else:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
    MOVIE_POSTER_SAVE_DIR = os.path.join(BASE_DIR, "frontend_src/node/frontend/public/assets/movie_posters")

def fetch_and_save_movie_posters():
    """TMDBからポスターを取得し、MoviePosterテーブルに保存"""
    posters = fetch_random_movie_posters()
    for poster in posters:
        tmdb_id = extract_tmdb_id(poster['poster_url'])
        if not MoviePoster.objects.filter(tmdb_id=tmdb_id).exists():
            try:
                MoviePoster.objects.create(
                    tmdb_id=tmdb_id,
                    title=poster['title'],
                    poster_url=poster['poster_url']
                )
                print(f"Saved MoviePoster: {poster['title']} ({tmdb_id})")
            except Exception as e:
                print(f"Failed to save MoviePoster: {poster['title']} ({tmdb_id}). Error: {e}")

def create_reward_from_movie_poster():
    """MoviePosterからランダムに選択してRewardImageを作成"""
    posters = MoviePoster.objects.order_by('?')[:50]

    if not posters.exists():
        print("No MoviePoster records found.")
        return

    with transaction.atomic():
        try:
            # 既存のRewardImageを削除
            deleted_count, _ = RewardImage.objects.all().delete()
            print(f"Deleted {deleted_count} existing RewardImages.")
        except Exception as e:
            print(f"Error deleting RewardImages: {e}")
            return

    # 新しいRewardImageを作成
    for index, poster in enumerate(posters, start=1):
        try:
            pixel_art_path = os.path.join(MOVIE_POSTER_SAVE_DIR, f"pixelized_{poster.tmdb_id}.png")
            reward = RewardImage.objects.create(
                tmdb_id=poster.tmdb_id,
                movie_poster_id=poster.id,
                title=poster.title,
                original_poster_url=poster.poster_url,
                pixel_art_image_path=pixel_art_path  # 環境に応じたパスを設定
            )
            print(f"RewardImage created successfully: ID {reward.id}, MoviePoster ID {poster.id}, Title: {reward.title}, Path: {pixel_art_path}")

        except Exception as e:
            print(f"Error creating RewardImage: {e}. Poster info: TMDB ID {poster.tmdb_id}, Title: {poster.title}")
            continue  # エラーが発生した場合はスキップして次のポスターへ

def extract_tmdb_id(url):
    """TMDB IDをURLから抽出"""
    parsed_url = urlparse(url)
    filename = os.path.basename(parsed_url.path)
    return os.path.splitext(filename)[0]

class Command(BaseCommand):
    help = "Fetch movie posters, save to MoviePoster, and create RewardImages"

    def handle(self, *args, **kwargs):
        # MoviePosterを取得して保存
        fetch_and_save_movie_posters()
        # MoviePosterからランダムに選択してRewardImageを作成
        create_reward_from_movie_poster()
