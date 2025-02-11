from django.contrib import admin
from django.urls import path, include
from pages.views import MainEntryView, reward_images
from collected_rewards.views import CollectRewardView, user_collected_rewards
from django.conf import settings
from django.conf.urls.static import static
from .views import get_csrf_token, login_view, logout_view, current_user_view, register_view
from auth.views import auth_status
from auth_guest.views import guest_login_view, guest_logout_view, is_guest_user

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
    path("api/guest-login/", guest_login_view, name="guest_login"),
    path("api/guest-logout/", guest_logout_view, name="guest_logout"),
    path("api/is-guest-user/", is_guest_user, name="is_guest_user"),
]

# 開発環境でのみ静的ファイルを提供
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

