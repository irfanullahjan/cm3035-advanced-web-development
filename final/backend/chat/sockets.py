from django.urls import path
from . import consumers

urlpatterns = [
    path('ws/lobby', consumers.ChatConsumer.as_asgi()),
]