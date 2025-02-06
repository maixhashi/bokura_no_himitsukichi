from django.db import models
import os

def upload_to(instance, filename):
    # ファイル名を生成 (例: pixelized_<tmdb_id>.png)
    return f"pixel_art/{filename}"

class RewardImage(models.Model):
    tmdb_id = models.CharField(max_length=255, unique=True)  # TMDB IDを一意に管理
    title = models.CharField(max_length=255)
    original_poster_url = models.URLField()
    pixel_art_image_path = models.ImageField(upload_to=upload_to, null=True, blank=True)  # ピクセルアート画像
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時
    movie_poster_id = models.IntegerField(blank=True, null=True)  # MoviePosterのIDを保存

    def __str__(self):
        return f"RewardImage {self.id}: {self.title}"
