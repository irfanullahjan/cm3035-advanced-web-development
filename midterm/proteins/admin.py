from django.contrib import admin
from .models import *

class ProteinDomainMappingInline(admin.TabularInline):
    model = ProteinDomainMapping


class ProteinAdmin(admin.ModelAdmin):
    inlines = [ProteinDomainMappingInline]


admin.site.register(DomainInstance)
admin.site.register(Organism)
admin.site.register(Protein, ProteinAdmin)
admin.site.register(ProteinDomainMapping)
