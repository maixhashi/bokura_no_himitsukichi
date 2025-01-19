import os
import re
from django.db import models
from django.utils.text import slugify

from django.db import models
import os

def upload_to(instance, filename):
    # ファイル名の生成 (例: pixelized_<tmdb_id>.png)
    return f"pixel_art/{filename}"

    pixel_art_image = models.ImageField(upload_to=upload_to)

class RewardImage(models.Model):
    title = models.CharField(max_length=255)  # 映画タイトル
    original_poster_url = models.URLField()  # 元のポスターURL
    pixel_art_image = models.ImageField(upload_to=upload_to, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時

    def __str__(self):
        return self.title
