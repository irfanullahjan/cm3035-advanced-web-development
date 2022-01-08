import os
import sys
import django
import csv
from collections import defaultdict

dirname = os.path.dirname(__file__).removesuffix('\scripts')
sys.path.append(dirname)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'midterm.settings')
django.setup()

from proteins.models import *

ProteinDomainMapping.objects.all().delete()
Protein.objects.all().delete()
DomainInstance.objects.all().delete()
DomainPfam.objects.all().delete()
Organism.objects.all().delete()

file_pfam_descriptions = dirname + '/scripts/data/pfam_descriptions.csv'
file_assignment_data_set = dirname + '/scripts/data/assignment_data_set.csv'
file_assignment_data_sequences = dirname + \
    '/scripts/data/assignment_data_sequences.csv'

pfam = defaultdict(list)
organism = set()
organism_proteins = defaultdict(list)
protein = defaultdict(list)

organism_proteins_rows = {}

print('Reading files...')

with open(file_pfam_descriptions) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        pfam[row[0]] = row

with open(file_assignment_data_set) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        organism.add(tuple(row[1:4]))
        organism_proteins[','.join(row[1:4])].append(row[0])
        protein[row[0]] = [row[0], None]

with open(file_assignment_data_sequences) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        protein[row[0]] = row

print('Importing DomainPfam')

for key in pfam:
    row = DomainPfam.objects.create(
        domain_id=pfam[key][0], domain_description=pfam[key][1])
    row.save()

print('Importing Organism')

for val in organism:
    val_list = list(val)
    genus_species = val_list[2].split(' ', 1)
    row = Organism.objects.create(
        taxa_id=val_list[0], clade=val_list[1], genus=genus_species[0], species=genus_species[1])
    row.save()
    key = ','.join(val_list)
    for protein_id in organism_proteins[key]:
        organism_proteins_rows[protein_id] = row

print('Importing Protein')

for key in protein:
    row = Protein.objects.create(
        protein_id=key, sequence=protein[key][1], taxonomy=organism_proteins_rows[key])
    row.save()

print('Importing ProteinDomainMapping')

with open(file_assignment_data_set) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        domain_instance = DomainInstance.objects.create(
            description=row[4],
            pfam_id=DomainPfam.objects.get(domain_id=row[5]),
            start=row[6],
            stop=row[7],
        )
        domain_instance.save()
        ProteinDomainMapping.objects.create(
            protein=Protein.objects.get(protein_id=row[0]),
            domain=domain_instance
        ).save()
