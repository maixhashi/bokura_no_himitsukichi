from rest_framework import serializers
from movie_posters.models import MoviePoster

class MoviePosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoviePoster
        fields = ['id', 'title', 'image_url', 'description']
