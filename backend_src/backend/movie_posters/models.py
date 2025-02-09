from django.db import models

class MoviePoster(models.Model):
    tmdb_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    poster_url = models.URLField(max_length=200)  # TMDBのポスターURLを保存
