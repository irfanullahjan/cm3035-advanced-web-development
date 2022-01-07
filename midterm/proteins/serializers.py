from rest_framework import serializers
from .models import *

class OrganismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organism
        fields = '__all__'

class ProteinDomainMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProteinDomainMapping
        fields = '__all__'

class ProteinSerializer(serializers.ModelSerializer):
    taxonomy = OrganismSerializer(read_only=True)
    length = serializers.SerializerMethodField()

    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')

    def get_length(self, obj):
        return len(obj.sequence)