from django.views.generic import TemplateView
from django.http import JsonResponse
from treasure_rewards.models import RewardImage

class MainEntryView(TemplateView):
    template_name = "pages/main.html"  # templates/pages/top_page.html を指定

import os
from django.http import JsonResponse
from treasure_rewards.models import RewardImage

# 環境変数 `DJANGO_ENV` を取得
DJANGO_ENV = os.environ.get("DJANGO_ENV")

def reward_images(request):
    try:
        rewards = RewardImage.objects.all()

        data = [
            {
                "id": reward.id,
                "pixel_art_image_path": (
                    f"/dist/movie_posters/{os.path.basename(reward.pixel_art_image_path.name)}"
                    if DJANGO_ENV == "production"
                    else f"/public/assets/movie_posters/{os.path.basename(reward.pixel_art_image_path.name)}"
                ) if reward.pixel_art_image_path else None,
                "title": reward.title,
                "movie_poster_id": reward.movie_poster_id,
            }
            for reward in rewards
        ]

        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
