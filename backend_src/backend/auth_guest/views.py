import json
import uuid
from django.http import JsonResponse
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import GuestUser

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def guest_login_view(request):
    """ゲストユーザーとしてログイン"""
    guest_uuid = str(uuid.uuid4())[:8]  # 一意の短縮IDを生成
    username = f"guest_{guest_uuid}"

    guest_user = GuestUser.objects.create(username=username)
    user, created = User.objects.get_or_create(username=username)
    
    login(request, user)
    return JsonResponse({"message": "ゲストログイン成功", "username": username}, status=200)

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def guest_logout_view(request):
    """ゲストユーザーの場合、ログアウトと同時に削除"""
    user = request.user
    guest_user = GuestUser.objects.filter(username=user.username).first()

    if guest_user:
        guest_user.delete()
        user.delete()
    
    logout(request)
    return JsonResponse({"message": "ログアウトしました"}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_guest_user(request):
    """ゲストユーザー判定API"""
    user = request.user
    is_guest = GuestUser.objects.filter(username=user.username).exists()
    return JsonResponse({"is_guest": is_guest}, status=200)
