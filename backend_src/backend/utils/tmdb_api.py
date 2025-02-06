import os
import requests
import random
from dotenv import load_dotenv

# 環境変数を取得（Render環境では `.env` を読み込まない）
if os.getenv("TMDB_API_KEY") is None:
    load_dotenv()  # ローカル環境でのみ実行
    print("Loaded .env file.")  # デバッグ用（本番では削除）

# 環境変数の取得
TMDB_API_KEY = os.environ.get("TMDB_API_KEY")  # `os.getenv()` でもOK
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# APIキーの確認（デバッグ用）
if not TMDB_API_KEY:
    raise ValueError("TMDB_API_KEY is not set. Check your environment variables.")

def fetch_popular_movie_posters():
    """人気映画のポスターを取得する関数"""
    random_page = random.randint(1, 500)  # ランダムなページ番号
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=ja&page={random_page}"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")
    
    data = response.json()
    posters = [
        {
            "title": movie["title"],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
        }
        for movie in data['results'] if movie.get("poster_path")
    ]
    
    return random.choice(posters) if posters else None

def fetch_random_movie_posters():
    """ランダムな人気映画のポスターを100件取得する関数"""
    random_page = random.randint(1, 500)
    url = f"{TMDB_BASE_URL}/discover/movie?api_key={TMDB_API_KEY}&language=ja&sort_by=popularity.desc&page={random_page}"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")
    
    data = response.json()
    posters = [
        {
            "title": movie["title"],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
        }
        for movie in data['results'] if movie.get("poster_path")
    ]
    
    random.shuffle(posters)
    return posters[:100]

if __name__ == "__main__":
    try:
        movie_posters = fetch_random_movie_posters()
        for poster in movie_posters[:5]:  # デバッグ用に最初の5件だけ表示
            print(f"タイトル: {poster['title']}")
            print(f"ポスターURL: {poster['poster_url']}")
            print()
    except Exception as e:
        print(f"エラー: {e}")
