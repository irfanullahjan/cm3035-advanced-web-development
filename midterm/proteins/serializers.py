from rest_framework import serializers
from .models import *

class DomainPfamSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomainPfam
        fields = '__all__'

class DomainInstanceSerializer(serializers.ModelSerializer):
    pfam_id = DomainPfamSerializer(many=False, read_only=True)
    class Meta:
        model = DomainInstance
        fields = ('pfam_id', 'description', 'start', 'stop')

class ProteinSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()
    domains = DomainInstanceSerializer(many=True, read_only=True)
    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')
        depth = 1

    def get_length(self, obj):
        return len(obj.sequence)