from django.contrib import admin
from .models import *

admin.site.register(DomainPfam)
admin.site.register(Organism)
admin.site.register(Protein)
admin.site.register(ProteinDomainMapping)