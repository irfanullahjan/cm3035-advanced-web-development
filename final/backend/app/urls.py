from django.urls import path
from . import api

urlpatterns = [
    path('api/user', api.CreateUser.as_view(), name='user-create'),
    path('api/user/login', api.UserLogin.as_view(), name='user-login'),
    path('api/user/logout', api.UserLogout.as_view(), name='user-logout'),
    path('api/user/current', api.CurrentUser.as_view(), name='user-get-current'),
    path('api/user/<int:id>', api.UserById.as_view(), name='user-by-id'),
    path('api/user/<int:id>/posts', api.UserPosts.as_view(), name='user-posts'),
    path('api/user/<str:search_text>', api.FindUsersByUsername.as_view(), name='find-users-by-search-text'),
    path('api/request', api.CreateFriendRequest.as_view(), name='friend-request'),
    path('api/request/<int:id>/accept', api.AcceptFriendRequest.as_view(), name='friend-request-accept'),
    path('api/post', api.CreateAndListPosts.as_view(), name='create-post-and-list-posts'),
]
