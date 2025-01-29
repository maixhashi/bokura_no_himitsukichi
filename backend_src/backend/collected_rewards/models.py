from django.db import models
from django.contrib.auth.models import User
from movie_posters.models import MoviePoster  # MoviePosterモデルをインポート

class CollectedReward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collected_rewards')
    movie_poster = models.ForeignKey(MoviePoster, on_delete=models.CASCADE, related_name='collected_by_users')
    collected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} collected {self.movie_poster.title}"
