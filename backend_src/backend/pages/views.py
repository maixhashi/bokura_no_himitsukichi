from rest_framework.views import APIView
from rest_framework.response import Response

class PageView(APIView):
    def get(self, request):
        return Response({"message": "Hello, this is a page!"})
