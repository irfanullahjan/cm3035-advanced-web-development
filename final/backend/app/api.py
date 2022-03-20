from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .serializers import *
from .models import *


class CreateRetrieveUser(generics.CreateAPIView):
    model = User
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
    fields = '__all__'

    # get current user
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
        user = request.user
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

    def get_permissions(self):
        return super().get_permissions()

# authenticate a user


class UserLogin(APIView):
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


class UserLogout(APIView):
    def get(self, request):
        logout(request)
        return JsonResponse({'success': 'Successfully logged out'})


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
        return User.objects.get(id=self.kwargs['id'])

    def get_serializer_class(self):
        if self.request.user.id == self.kwargs['id']:
            # if the user is requesting their own profile, return the full serializer
            return UserSerializer

        # otherwise, return a restricted serializer
        return UserSerializerRestricted


class FindUsersByUsername(generics.ListAPIView):
    model = User
    permission_classes = [
        # only authenticated users have user details
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_queryset(self):
        search_text = self.kwargs['search_text']
        print('search_text', search_text)
        return User.objects.filter(username__icontains=search_text)


class UserPosts(generics.ListAPIView):
    model = Post
    permission_classes = [
        # only authenticated users can see user posts
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


class CreateAndListPosts(generics.CreateAPIView, generics.ListAPIView):
    model = Post
    permission_classes = [
        # only authenticated users can create and view posts
        permissions.IsAuthenticated
    ]
    serializer_class = PostSerializer

    # add user from request context to post
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        users_posts_query = Post.objects.filter(user=self.request.user)
        friends_posts_query = Post.objects.filter(
            user__profile__friends=self.request.user.profile)
        return (users_posts_query | friends_posts_query).order_by('-created_at')


class CreateFriendRequest(generics.CreateAPIView):
    model = FriendRequest
    permission_classes = [
        # only authenticated users can send friend requests
        permissions.IsAuthenticated
    ]
    serializer_class = FriendRequestSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
