import os
import random
import requests
from django.core.management.base import BaseCommand
from django.db import transaction
from urllib.parse import urlparse

from treasure_rewards.models import RewardImage
from movie_posters.models import MoviePoster
from utils.tmdb_api import fetch_random_movie_posters

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
                    poster_url=poster['poster_url']  # ピクセルアートなしで保存
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

    # 新しいRewardImageを作成（ピクセルアートを保存せず、poster_url を直接使用）
    for index, poster in enumerate(posters, start=1):
        try:
            reward = RewardImage.objects.create(
                tmdb_id=poster.tmdb_id,
                movie_poster_id=poster.id,
                title=poster.title,
                poster_url=poster.poster_url,
            )
            print(f"RewardImage created successfully: ID {reward.id}, MoviePoster ID {poster.id}, Title: {reward.title}, Poster URL: {poster.poster_url}")

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
