from django.urls import path
from . import views

urlpatterns = [
    path('reward-images/', views.reward_images, name='reward-images'),  # 正しく定義
]
