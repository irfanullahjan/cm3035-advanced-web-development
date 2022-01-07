from django.urls import path
from . import api

urlpatterns = [
    path('api/pfam', api.PfamList.as_view(), name='pfam-list'),
]