from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({"message": "Logged in successfully"}, status=200)
        return JsonResponse({"error": "Invalid credentials"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({"message": "User registered successfully"}, status=201)
    return JsonResponse({"error": "Invalid request method"}, status=405)


from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)


@login_required
def current_user_view(request):
    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        # "email": user.email,
        # 必要に応じて他のフィールドを追加
    }, status=200)