from rest_framework import serializers
from .models import *

class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ('pfam_id', 'description', 'start', 'stop')
        depth = 1

class ProteinRetreiveSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()
    domains = DomainSerializer(many=True, read_only=True)
    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')
        depth = 1

    def get_length(self, obj):
        return len(obj.sequence)

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