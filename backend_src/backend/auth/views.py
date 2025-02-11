from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def auth_status(request):
    return JsonResponse({"isAuthenticated": True})
