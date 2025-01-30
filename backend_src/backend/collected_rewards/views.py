from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.models import User
from movie_posters.models import MoviePoster
from collected_rewards.models import CollectedReward

import json
import logging  # ログ出力用モジュールをインポート
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import MoviePosterSerializer

# loggerを設定
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class CollectRewardView(View):
    def post(self, request):
        logger.info("CollectRewardView received a request")  # 確認用ログ
        logger.info(f"Request data: {request.body}")  # リクエスト内容を出力

        try:
            data = json.loads(request.body)
            movie_poster_id = data.get('movie_poster_id')
            user_id = data.get('user_id')  # フロントエンドから送信されるユーザーID

            if not movie_poster_id or not user_id:
                return JsonResponse({'error': 'Invalid data'}, status=400)

            # データベースから MoviePoster と User を取得
            movie_poster = MoviePoster.objects.get(id=movie_poster_id)
            user = User.objects.get(id=user_id)

            # CollectedReward モデルにレコードを作成（多対多なら `add()` を考慮）
            CollectedReward.objects.create(user=user, movie_poster=movie_poster)

            logger.info(f"Reward collected successfully for user {user_id}")
            return JsonResponse({'message': 'Reward collected successfully'})

        except MoviePoster.DoesNotExist:
            logger.error(f"MoviePoster not found: ID {movie_poster_id}")
            return JsonResponse({'error': 'MoviePoster not found'}, status=404)
        except User.DoesNotExist:
            logger.error(f"User not found: ID {user_id}")
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            logger.error("Invalid JSON data received")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import CollectedReward

@login_required
def user_collected_rewards(request):
    user = request.user
    rewards = CollectedReward.objects.filter(user=user).select_related('movie_poster')
    data = [{"id": reward.movie_poster.id, "title": reward.movie_poster.title, "image_url": reward.movie_poster.pixel_art_image_path} for reward in rewards]
    return JsonResponse(data, safe=False)
