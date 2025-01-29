from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.models import User
from movie_posters.models import MoviePoster
from collected_rewards.models import CollectedReward

import json

import logging  # ログ出力用モジュールをインポート
# loggerを設定
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class CollectRewardView(View):
    def post(self, request):
        logger.info("CollectRewardView received a request")  # 確認用ログ
        logger.info(f"Request data: {request.body}")  # リクエスト内容を出力

        data = json.loads(request.body)
        movie_poster_id = data.get('movie_poster_id')
        user_id = data.get('user_id')  # フロントエンドから送信されるユーザーID

        if not movie_poster_id or not user_id:
            return JsonResponse({'error': 'Invalid data'}, status=400)

        try:
            # データベースから MoviePoster と User を取得
            movie_poster = MoviePoster.objects.get(id=movie_poster_id)
            user = User.objects.get(id=user_id)

            # CollectedReward モデルにレコードを作成
            CollectedReward.objects.create(user=user, movie_poster=movie_poster)

            return JsonResponse({'message': 'Reward collected successfully'})
        except MoviePoster.DoesNotExist:
            return JsonResponse({'error': 'MoviePoster not found'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
