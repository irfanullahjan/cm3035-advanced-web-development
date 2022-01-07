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
DomainPfam.objects.all().delete()
Organism.objects.all().delete()

file_pfam_descriptions = dirname + '/scripts/data/pfam_descriptions.csv'
file_assignment_data_set = dirname + '/scripts/data/assignment_data_set.csv'
file_assignment_data_sequences = dirname + '/scripts/data/assignment_data_sequences.csv'

pfam = defaultdict(list)
organism = set()
organism_proteins = defaultdict(list)
protein = defaultdict(list)

organism_proteins_rows = {}

with open(file_pfam_descriptions) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        pfam[row[0]] = row

with open(file_assignment_data_set) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        if len(pfam[row[5]]) == 2:
            pfam[row[5]].append(row[4])
        organism.add(tuple(row[1:4]))
        organism_proteins[','.join(row[1:4])].append(row[0])

with open(file_assignment_data_sequences) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        protein[row[0]] = row

for key in pfam:
    row = DomainPfam.objects.create(
        domain_id=pfam[key][0], domain_description=pfam[key][1], domain_description2=pfam[key][2])
    row.save()

for val in organism:
    val_list = list(val)
    genus_species = val_list[2].split(' ', 1)
    row = Organism.objects.create(
        taxa_id=val_list[0], clade=val_list[1], genus=genus_species[0], species=genus_species[1])
    row.save()
    key = ','.join(val_list)
    for protein_id in organism_proteins[key]:
      organism_proteins_rows[protein_id] = row

for key in protein:
    row = Protein.objects.create(
        protein_id=key, sequence=protein[key][1], organism=organism_proteins_rows[key])
    row.save()
