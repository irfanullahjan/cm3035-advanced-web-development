from django.urls import path
from . import api

urlpatterns = [
    path('api/protein/', api.ProteinCreate.as_view(), name='protein-create'),
    path('api/protein/<pk>', api.ProteinRetreive.as_view(), name='protein-detail'),
    path('api/pfam/<pk>', api.DomainPfamRetreive.as_view(), name='domain-pfam-detail'),
]