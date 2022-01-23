from django.db import models


class Organism(models.Model):
    taxa_id = models.IntegerField(primary_key=True)
    clade = models.CharField(max_length=1, blank=False, null=False)
    genus = models.CharField(max_length=256, blank=False, null=False)
    species = models.CharField(max_length=256, blank=False, null=False)

    def __str__(self):
        return self.genus + " " + self.species


class Pfam(models.Model):
    domain_id = models.CharField(primary_key=True, max_length=256)
    domain_description = models.CharField(
        max_length=256, blank=False, null=False)

    def __str__(self):
        return self.domain_id


class Domain(models.Model):
    pfam_id = models.ForeignKey(Pfam, on_delete=models.DO_NOTHING)
    description = models.CharField(
        max_length=256, blank=False, null=False)
    start = models.IntegerField(blank=False, null=False)
    stop = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return str(self.pfam_id)

    def __len__(self):
        return self.stop - self.start


class Protein(models.Model):
    protein_id = models.CharField(primary_key=True, max_length=256)
    sequence = models.TextField(blank=True, null=True)
    taxonomy = models.ForeignKey(
        Organism, blank=False, null=False, on_delete=models.DO_NOTHING)
    domains = models.ManyToManyField(
        Domain, through='ProteinDomainMapping')

    def __str__(self):
        return self.protein_id

    def __len__(self):
        if self.sequence is not None:
            return len(self.sequence)
        else:
            return 0


class ProteinDomainMapping(models.Model):
    protein = models.ForeignKey(Protein, on_delete=models.DO_NOTHING)
    domain = models.ForeignKey(
        Domain, to_field='id', on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.protein.protein_id + "," + str(self.domain.id)
