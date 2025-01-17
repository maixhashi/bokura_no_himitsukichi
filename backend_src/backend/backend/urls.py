from django.contrib import admin
from django.urls import path, include  # includeが必要

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pages.urls')),  # サブアプリのurlsをインクルード
]
