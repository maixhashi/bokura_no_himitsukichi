from django.http import JsonResponse
from .models import MoviePoster

def reward_images(request):
    try:
        rewards = MoviePoster.objects.all()
        data = [
            {
                "id": reward.id,
                "title": reward.title,
                "poster_url": reward.poster_url,  # 正しいフィールド名を使用
            }
            for reward in rewards
        ]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
