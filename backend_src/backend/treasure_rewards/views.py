from django.http import JsonResponse
from .models import RewardImage

def reward_images(request):
    try:
        rewards = RewardImage.objects.all()
        data = [
            {
                "id": reward.id,
                "title": reward.title,
                "pixel_art_image_path": reward.pixel_art_image_path.url if reward.pixel_art_image_path else None,
            }
            for reward in rewards
        ]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
