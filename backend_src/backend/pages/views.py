from django.views.generic import TemplateView
from django.http import JsonResponse
from treasure_rewards.models import RewardImage

class MainEntryView(TemplateView):
    template_name = "pages/main.html"  # templates/pages/top_page.html を指定

# backend/pages/views.py
from django.http import JsonResponse
# from .models import RewardImage 

def reward_images(request):
    try:
        rewards = RewardImage.objects.all()
        data = [
            {
                "id": reward.id,
                # 余計なディレクトリを除去してパスを加工
                "pixel_art_image_path": f"/public/assets/movie_posters/{reward.pixel_art_image_path.name.split('/')[-1]}"
                if reward.pixel_art_image_path
                else None,
                "title": reward.title,
                "movie_poster_id": reward.movie_poster_id,
            }
            for reward in rewards
        ]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
