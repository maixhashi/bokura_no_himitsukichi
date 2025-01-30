from django.contrib import admin
from django.urls import path, include
from pages.views import MainEntryView, reward_images
from collected_rewards.views import CollectRewardView, user_collected_rewards
from django.conf import settings
from django.conf.urls.static import static
from .views import get_csrf_token, login_view, logout_view, current_user_view, register_view
from auth.views import auth_status

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pages.urls')),    
    path('', MainEntryView.as_view(), name='main-entry'),
    path('reward-images/', reward_images, name='reward-images'),
    path("api/csrf/", get_csrf_token, name="csrf_token"),
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),
    path("api/current-user/", current_user_view, name="current_user"),
    path("api/register/", register_view, name="register"),
    path('api/rewards/collect', CollectRewardView.as_view(), name='collect-reward'),
    path("api/collected-rewards/", user_collected_rewards, name="user_collected_rewards"),
    path("api/auth/status/", auth_status, name="auth_status"),
]

# 開発環境でのみ静的ファイルを提供
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
