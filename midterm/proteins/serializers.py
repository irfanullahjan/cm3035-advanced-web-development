from rest_framework import serializers
from .models import *

class DomainInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomainInstance
        fields = ('pfam_id', 'description', 'start', 'stop')
        depth = 1

class ProteinSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()
    domains = DomainInstanceSerializer(many=True, read_only=True)
    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')
        depth = 1

    def get_length(self, obj):
        return len(obj.sequence)

class CreateProteinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = '__all__'