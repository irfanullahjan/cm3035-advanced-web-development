from django.urls import path
from . import api

urlpatterns = [
    path('api/protein/<pk>', api.ProteinDetail.as_view(), name='pfam-list'),
]