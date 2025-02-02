import os
import requests
import random
import json
from django.core.management.base import BaseCommand
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"


def fetch_raw_tmdb_response(endpoint):
    """TMDB API から指定したエンドポイントのレスポンスを取得"""
    try:
        random_page = random.randint(1, 500)  # ランダムなページ番号を選択
        url = f"{TMDB_BASE_URL}/{endpoint}?api_key={TMDB_API_KEY}&language=ja&page={random_page}"
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch data: {response.status_code}")

        return response.json()  # JSONのまま返す

    except Exception as e:
        print(f"エラー: {e}")
        return None


class Command(BaseCommand):
    help = "Fetch raw TMDB response for a given endpoint"

    def add_arguments(self, parser):
        parser.add_argument(
            "endpoint",
            type=str,
            help="TMDB API のエンドポイントを指定 (例: movie/popular, discover/movie)",
        )

    def handle(self, *args, **options):
        endpoint = options["endpoint"]
        self.stdout.write(f"=== TMDB の生のレスポンスを取得: {endpoint} ===")

        raw_response = fetch_raw_tmdb_response(endpoint)

        if raw_response:
            print(json.dumps(raw_response, indent=4, ensure_ascii=False))  # 見やすくJSON整形
        else:
            self.stdout.write("データ取得に失敗しました。")
