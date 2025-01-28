import os
import requests
import random
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

def fetch_popular_movie_posters():
    # Popular APIは通常、最大500ページまで
    random_page = random.randint(1, 500)  # ランダムにページを選択
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=ja&page={random_page}"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")
    
    data = response.json()
    posters = []
    for movie in data['results']:
        posters.append({
            "title": movie["title"],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
        })
    
    # ランダムに1件選択
    random_movie = random.choice(posters) if posters else None
    return random_movie

# 実行例
if __name__ == "__main__":
    try:
        random_movie = fetch_random_movie_posters()
        if random_movie:
            print(f"タイトル: {random_movie['title']}")
            print(f"ポスターURL: {random_movie['poster_url']}")
        else:
            print("映画情報が見つかりませんでした。")
    except Exception as e:
        print(f"エラー: {e}")


def fetch_random_movie_posters():
    # ランダムなページ番号を選択 (1～500)
    random_page = random.randint(1, 500)
    url = f"{TMDB_BASE_URL}/discover/movie?api_key={TMDB_API_KEY}&language=ja&sort_by=popularity.desc&page={random_page}"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")
    
    data = response.json()
    posters = []
    for movie in data['results']:
        posters.append({
            "title": movie["title"],
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
        })
    
    # シャッフルして100件を返す
    random.shuffle(posters)
    return posters[:100]

# 実行例
if __name__ == "__main__":
    try:
        movie_posters = fetch_random_movie_posters()
        for poster in movie_posters:
            print(f"タイトル: {poster['title']}")
            print(f"ポスターURL: {poster['poster_url']}")
            print()
    except Exception as e:
        print(f"エラー: {e}")
