from django.urls import path
from . import api

urlpatterns = [
    path('api/user', api.CreateRetrieveUser.as_view(), name='user-create-and-get-logged-in-user'),
    path('api/user/login', api.UserLogin.as_view(), name='user-login'),
    path('api/user/logout', api.UserLogout.as_view(), name='user-logout'),
    path('api/user/<int:id>', api.UserById.as_view(), name='user-by-id'),
    path('api/user/<int:id>/posts', api.UserPosts.as_view(), name='user-posts'),
    path('api/request', api.CreateFriendRequest.as_view(), name='friend-request'),
    path('api/users/<str:search_text>', api.FindUsersByUsername.as_view(), name='find-users-by-search-text'),
    path('api/post', api.CreatePost.as_view(), name='create-post'),
]
