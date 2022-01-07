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

file_pfam_descriptions = dirname + '/scripts/data/pfam_descriptions.csv'
file_assignment_data_set = dirname + '/scripts/data/assignment_data_set.csv'

pfam = defaultdict(list)

with open(file_pfam_descriptions) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        pfam[row[0]] = row

with open(file_assignment_data_set) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        if len(pfam[row[5]]) == 2:
            pfam[row[5]].append(row[4])

ProteinDomainMapping.objects.all().delete()
Protein.objects.all().delete()
DomainPfam.objects.all().delete()
Organism.objects.all().delete()

for key in pfam:
    row = DomainPfam.objects.create(
        domain_id=pfam[key][0], domain_description=pfam[key][1], domain_description2=pfam[key][2])
    row.save()
