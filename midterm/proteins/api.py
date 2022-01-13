from rest_framework import generics
from .models import *
from .serializers import *


class ProteinDetail(generics.RetrieveAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinRetreiveSerializer
    lookup_field = 'protein_id'


class ProteinCreate(generics.CreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinCreateSerializer


class ProteinListByOrganism(generics.ListAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinListByOrganismSerializer

    def get_queryset(self):
        taxonomy = self.kwargs['taxonomy']
        return Protein.objects.filter(taxonomy=taxonomy)


class PfamDetail(generics.RetrieveAPIView):
    queryset = Pfam.objects.all()
    serializer_class = PfamRetreiveSerializer
    lookup_field = 'domain_id'

class PfamListByOrganism(generics.ListAPIView):
    serializer_class = PfamRetreiveSerializer

    def get_queryset(self):
        taxonomy = self.kwargs['taxonomy']
        return Pfam.objects.filter(domain__protein__taxonomy=taxonomy);

class ProteinDomainCoverage(generics.RetrieveAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinDomainCoverageSerializer
    lookup_field = 'protein_id'