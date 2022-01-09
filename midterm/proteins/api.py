from rest_framework import generics
from .models import *
from .serializers import *

class ProteinDetail(generics.RetrieveAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer

class ProteinCreate(generics.CreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = CreateProteinSerializer
