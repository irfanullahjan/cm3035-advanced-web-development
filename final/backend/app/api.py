from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import generics
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate, login

from .serializers import *
from .models import *


class CreateUserView(generics.CreateAPIView):

    model = User
    permission_classes = [
        permissions.AllowAny  # Or anon users can't register
    ]
    serializer_class = UserSerializer
    fields = '__all__'

# authenticate a user
class AuthenticateUser(generics.CreateAPIView):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return JsonResponse({'error': 'Please provide both username and password'}, status=400)
        user = authenticate(username=username, password=password)
        if not user:
            return JsonResponse({'error': 'Invalid Credentials'}, status=404)
        login(request, user)
        return JsonResponse({'success': 'Successfully authenticated'})

class CurrentUserView(generics.RetrieveAPIView):

    model = User
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserById(generics.RetrieveAPIView):
    model = User
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]

    def get_object(self):
        return get_user_model().objects.get(id=self.kwargs['id'])

    def get_serializer_class(self):
        if self.request.user.id == self.kwargs['id']:
            # if the user is requesting their own profile, return the full serializer
            return UserSerializer
        
        # otherwise, return a restricted serializer
        return UserSerializerRestricted


class FindUsersByUsername(generics.ListAPIView):
    model = get_user_model()
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_queryset(self):
        search_text = self.kwargs['search_text']
        print('search_text', search_text)
        return get_user_model().objects.filter(username__icontains=search_text)


class UserPosts(generics.ListAPIView):
    model = Post
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = PostSerializer

    def get_queryset(self):
        userposts = Post.objects.filter(user=self.kwargs['id'])

        # if the current user is the owner
        if self.request.user.id == self.kwargs['id']:
            return userposts
        
        # if users profile is friends with owners profile
        if self.request.user.profile.friends.filter(id=self.kwargs['id']).exists():
            return userposts
        
        # else return nothing
        self.permission_denied(self.request)

class CreatePost(generics.CreateAPIView):
    model = Post
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = PostSerializer

    # add user_id to post
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CreateFriendRequest(generics.CreateAPIView):
    model = FriendRequest
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = FriendRequestSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
