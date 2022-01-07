from django.db import models


class Organism(models.Model):
    taxa_id = models.IntegerField(primary_key=True)
    clade = models.CharField(max_length=1, blank=False, null=False)
    genus = models.CharField(max_length=256, blank=False, null=False)
    species = models.CharField(max_length=256, blank=False, null=False)

    def __str__(self):
        return self.genus + " " + self.species


class DomainPfam(models.Model):
    domain_id = models.CharField(primary_key=True, max_length=256)
    domain_description = models.CharField(
        max_length=256, blank=False, null=False)
    domain_description2 = models.CharField(
        max_length=256, blank=False, null=False)

    def __str__(self):
        return self.domain_id


class Protein(models.Model):
    protein_id = models.CharField(primary_key=True, max_length=256)
    sequence = models.TextField(blank=True, null=True)
    organism = models.ForeignKey(Organism, on_delete=models.DO_NOTHING)
    domains = models.ManyToManyField(DomainPfam, through='ProteinDomainMapping')

    def __str__(self):
        return self.protein_id


class ProteinDomainMapping(models.Model):
    protein = models.ForeignKey(Protein, on_delete=models.DO_NOTHING)
    domain = models.ForeignKey(DomainPfam, on_delete=models.DO_NOTHING)
    start = models.IntegerField(blank=False, null=False)
    end = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return self.protein.protein_id + "," + self.domain.domain_id
