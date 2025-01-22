from django.contrib import admin
from django.urls import path, include
from pages.views import MainEntryView, reward_images  # 修正: reward_imagesをインポート
from django.conf import settings
from django.conf.urls.static import static
from .views import get_csrf_token, login_view, logout_view, current_user_view, register_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pages.urls')),    
    path('', MainEntryView.as_view(), name='main-entry'),  # ルートのルーティングを追加
    path('reward-images/', reward_images, name='reward-images'),  # 修正: 正しく動作するはず
    path("api/csrf/", get_csrf_token, name="csrf_token"),
    path("api/login/", login_view, name="login"),
    path("api/logout/", logout_view, name="logout"),
    path("api/current-user/", current_user_view, name="current_user"),
    path("api/register/", register_view, name="register"),
]

# 開発環境でのみ静的ファイルを提供
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


