from django.urls import path
from . import api
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Protein API')

urlpatterns = [
    path('', schema_view),
    path('api/protein/', api.ProteinCreate.as_view(), name='protein-create'),
    path('api/protein/<protein_id>', api.ProteinDetail.as_view(), name='protein-detail'),
    path('api/proteins/<taxonomy>', api.ProteinListByOrganism.as_view(), name='protein-list-by-organism'),
    path('api/pfam/<domain_id>', api.PfamDetail.as_view(), name='domain-pfam-detail'),
    path('api/pfams/<taxonomy>', api.PfamListByOrganism.as_view(), name='pfam-list-by-organism'),
    path('api/coverage/<protein_id>', api.ProteinDomainCoverage.as_view(), name='protein-domain-coverage'),
]