from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import generics
from django.contrib.auth import get_user_model, authenticate
from django.views.decorators.csrf import csrf_exempt

from .serializers import UserSerializer


class CreateUserView(generics.CreateAPIView):

    model = get_user_model()
    permission_classes = [
        permissions.AllowAny # Or anon users can't register
    ]
    serializer_class = UserSerializer

# authenticate a user
class AuthenticateUser(generics.CreateAPIView):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

    @csrf_exempt
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return JsonResponse({'error': 'Please provide both username and password'}, status=400)
        user = authenticate(username=username, password=password)
        if not user:
            return JsonResponse({'error': 'Invalid Credentials'}, status=404)
        return JsonResponse({'success': 'Successfully authenticated'})

class CurrentUserView(generics.RetrieveAPIView):

    model = get_user_model()
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

