import factory
from django.test import TestCase
from django.conf import settings
from django.core.files import File

from .models import *


class OrganismFactory(factory.django.DjangoModelFactory):
    clade = 'E'
    genus = factory.Faker('word')
    species = factory.Faker('word')

    class Meta:
        model = Organism


class PfamFactory(factory.django.DjangoModelFactory):
    domain_id = factory.Faker('uuid4')
    domain_description = factory.Faker('sentence')

    class Meta:
        model = Pfam


class DomainFactory(factory.django.DjangoModelFactory):
    pfam_id = factory.SubFactory(PfamFactory)
    description = factory.Faker('sentence')
    start = factory.Faker('pyint')
    stop = factory.Faker('pyint')

    class Meta:
        model = Domain


class ProteinFactory(factory.django.DjangoModelFactory):
    protein_id = factory.Faker('uuid4')
    sequence = factory.Faker('text')
    taxonomy = factory.SubFactory(OrganismFactory)
    domains = factory.RelatedFactory(DomainFactory, 'protein')

    class Meta:
        model = Protein
