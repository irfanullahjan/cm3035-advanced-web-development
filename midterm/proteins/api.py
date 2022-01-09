from rest_framework import generics
from .models import *
from .serializers import *

class ProteinRetreive(generics.RetrieveAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinRetreiveSerializer

class ProteinCreate(generics.CreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinCreateSerializer

class PfamRetreive(generics.RetrieveAPIView):
    queryset = Pfam.objects.all()
    serializer_class = PfamRetreiveSerializer
