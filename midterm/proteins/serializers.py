from rest_framework import serializers
from .models import *

class DomainPfamSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomainPfam
        fields = ('domain_id', 'domain_description', 'domain_description2')