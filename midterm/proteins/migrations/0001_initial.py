# Generated by Django 3.0.3 on 2022-01-07 03:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DomainPfam',
            fields=[
                ('domain_id', models.CharField(max_length=256, primary_key=True, serialize=False)),
                ('domain_description', models.CharField(max_length=256)),
                ('domain_description2', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Organism',
            fields=[
                ('taxa_id', models.IntegerField(primary_key=True, serialize=False)),
                ('clade', models.CharField(max_length=1)),
                ('genus', models.CharField(max_length=256)),
                ('species', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Protein',
            fields=[
                ('protein_id', models.CharField(max_length=256, primary_key=True, serialize=False)),
                ('sequence', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProteinDomainMapping',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='proteins.DomainPfam')),
                ('protein', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='proteins.Protein')),
            ],
        ),
        migrations.AddField(
            model_name='protein',
            name='domains',
            field=models.ManyToManyField(through='proteins.ProteinDomainMapping', to='proteins.DomainPfam'),
        ),
        migrations.AddField(
            model_name='protein',
            name='organism',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='proteins.Organism'),
        ),
    ]
