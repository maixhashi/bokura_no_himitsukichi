from django.db import models
import os

class RewardImage(models.Model):
    tmdb_id = models.CharField(max_length=255, unique=True)  # TMDB IDを一意に管理
    title = models.CharField(max_length=255)
    poster_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時
    movie_poster_id = models.IntegerField(blank=True, null=True)  # MoviePosterのIDを保存

    def __str__(self):
        return f"RewardImage {self.id}: {self.title}"
