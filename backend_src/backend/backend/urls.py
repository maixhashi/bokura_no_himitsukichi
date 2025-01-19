from django.contrib import admin
from django.urls import path, include
from pages.views import MainEntryView, reward_images  # 修正: reward_imagesをインポート
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pages.urls')),    
    path('', MainEntryView.as_view(), name='main-entry'),  # ルートのルーティングを追加
    path('reward-images/', reward_images, name='reward-images'),  # 修正: 正しく動作するはず
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
]

# 開発環境でのみ静的ファイルを提供
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)