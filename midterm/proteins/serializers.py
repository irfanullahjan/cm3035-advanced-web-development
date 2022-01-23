from rest_framework import serializers
from .models import *

class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ('pfam_id', 'description', 'start', 'stop')
        depth = 1 # depth=1 means that the serializer will inline pfam_id

class ProteinRetreiveSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()
    domains = DomainSerializer(many=True, read_only=True)
    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')
        depth = 1 # depth=1 means that the serializer will inline taxonomy.

    # return the length of the protein sequence
    def get_length(self, obj):
        return len(obj)

class ProteinCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = '__all__'

class PfamRetreiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pfam
        fields = '__all__'

class ProteinListByOrganismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = ['protein_id']

class ProteinDomainCoverageSerializer(serializers.ModelSerializer):
    coverage = serializers.SerializerMethodField()
    class Meta:
        model = Protein
        fields = ['coverage']

    # return the domain coverage of the protein
    def get_coverage(self, obj):
        domains = Domain.objects.filter(protein=obj)
        # len has been overloaded on Domain model to return the length of the domain
        lengths = map(lambda x: len(x), domains)
        return sum(lengths) / len(obj)
