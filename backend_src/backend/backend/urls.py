from django.contrib import admin
from django.urls import path, include
from pages.views import MainEntryView  # TopPageViewをインポート

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pages.urls')),
    
    path('', MainEntryView.as_view(), name='main-entry'),  # ルートのルーティングを追加
]
