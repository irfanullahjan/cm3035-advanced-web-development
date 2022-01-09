from django.urls import path
from . import api

urlpatterns = [
    path('api/protein/', api.ProteinCreate.as_view(), name='protein-create'),
    path('api/protein/<pk>', api.ProteinDetail.as_view(), name='protein-detail'),
]