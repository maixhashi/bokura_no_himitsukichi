from django.urls import path
from .views import PageView

urlpatterns = [
    path('pages/', PageView.as_view(), name='page-list'),
]
