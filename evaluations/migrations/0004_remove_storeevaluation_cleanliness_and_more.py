# Generated by Django 5.1.7 on 2025-04-01 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evaluations', '0003_storeinformation_category_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storeevaluation',
            name='cleanliness',
        ),
        migrations.RemoveField(
            model_name='storeevaluation',
            name='customer_service',
        ),
        migrations.RemoveField(
            model_name='storeevaluation',
            name='efficiency',
        ),
        migrations.RemoveField(
            model_name='storeevaluation',
            name='standard_spiel',
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ac1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ac2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ac3',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce3',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce4',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce5',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ce6',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl3',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl4',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl5',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl6',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cl7',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn10',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn11',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn3',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn4',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn5',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn6',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn7',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn8',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='cn9',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='pg1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='pq1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='pq2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ss1',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ss2',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
        migrations.AddField(
            model_name='storeevaluation',
            name='ss3',
            field=models.IntegerField(blank=True, choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], null=True),
        ),
    ]
