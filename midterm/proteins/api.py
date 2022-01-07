from rest_framework import generics
from .models import *
from .serializers import *

class PfamList(generics.ListAPIView):
    queryset = DomainPfam.objects.all()
    serializer_class = DomainPfamSerializer