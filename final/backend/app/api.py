from rest_framework import permissions
from rest_framework import generics
from django.contrib.auth import get_user_model # If used custom user model

from .serializers import UserSerializer


class CreateUserView(generics.CreateAPIView):

    model = get_user_model()
    permission_classes = [
        permissions.AllowAny # Or anon users can't register
    ]
    serializer_class = UserSerializer

class CurrentUserView(generics.RetrieveAPIView):

    model = get_user_model()
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user