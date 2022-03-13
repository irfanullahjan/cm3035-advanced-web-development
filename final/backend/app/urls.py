from django.urls import path
from . import api
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('api/user/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/user/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path('api/user/current', api.CurrentUserView.as_view(), name='current_user'),
    path('api/user/<int:id>', api.UserById.as_view(), name='user_by_id'),
    path('api/user/signup', api.CreateUserView.as_view(), name='user-signup'),
    path('api/user/login', api.AuthenticateUser.as_view(), name='user-login'),
    path('api/user/<int:id>/posts', api.UserPosts.as_view(), name='user-posts'),
    path('api/users/<str:search_text>', api.FindUsersByUsername.as_view(), name='find-users-by-search-text'),
    path('api/post', api.CreatePost.as_view(), name='create-post'),
]
