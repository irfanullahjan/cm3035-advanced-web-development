from rest_framework import generics
from .models import *
from .serializers import *

class ProteinDetail(generics.RetrieveAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer
