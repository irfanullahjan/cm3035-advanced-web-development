from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .serializers import *
from .models import *


class CreateUser(generics.CreateAPIView):
    model = User
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
    fields = '__all__'


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


class CurrentUser(generics.RetrieveAPIView):

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
    serializer_class = UserSerializerRestricted # we need to restrict because search results to only include basic user info

    def get_queryset(self):
        search_text = self.kwargs['search_text']
        print('search_text', search_text)

        # return all users whose username contains the search text excluding the current user and superusers
        return User.objects.filter(username__icontains=search_text).exclude(id=self.request.user.id).exclude(is_superuser=True)


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

# friends by user id


class UserFriends(generics.ListAPIView):
    model = User
    permission_classes = [
        # only authenticated users can see user posts
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializerRestricted

    def get_queryset(self):
        return self.request.user.profile.friends.all()


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

# accept friend request


class AcceptFriendRequest(generics.DestroyAPIView):
    model = FriendRequest
    permission_classes = [
        # only authenticated users can accept friend requests
        permissions.IsAuthenticated
    ]
    serializer_class = FriendRequestSerializer
    lookup_field = 'id'

    def perform_destroy(self, instance):
        # add the sender to the receiver's friends
        self.request.user.profile.friends.add(instance.sender.profile)

        # add the receiver to the sender's friends
        instance.sender.profile.friends.add(self.request.user.profile)

        # delete the friend request
        instance.delete()

        return JsonResponse({'success': 'Friend request accepted'})

    def get_queryset(self):
        return FriendRequest.objects.filter(receiver=self.request.user)
