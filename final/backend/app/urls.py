from django.urls import path
from . import api

urlpatterns = [
    path('api/user/signup', api.CreateUserView.as_view(), name='user-signup'),
]
