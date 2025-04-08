# Generated by Django 5.1.7 on 2025-03-25 04:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StoreInformation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('audit_schedule', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='StoreEvaluation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cleanliness', models.IntegerField()),
                ('customer_service', models.IntegerField()),
                ('efficiency', models.IntegerField()),
                ('standard_spiel', models.IntegerField()),
                ('evaluation_date', models.DateField(auto_now_add=True)),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evaluations.storeinformation')),
            ],
        ),
    ]
