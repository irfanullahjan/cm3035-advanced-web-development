from rest_framework import serializers
from .models import *

class ProteinSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()
    class Meta:
        model = Protein
        fields = ('protein_id', 'sequence', 'taxonomy', 'length', 'domains')
        depth = 2

    def get_length(self, obj):
        return len(obj.sequence)