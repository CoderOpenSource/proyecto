# Generated by Django 5.0.4 on 2024-06-11 10:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescription', '0001_initial'),
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescription',
            name='dosage',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='duration',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='medication',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='notes',
        ),
        migrations.AlterField(
            model_name='prescription',
            name='doctor',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='usuarios.doctor'),
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medication_name', models.CharField(max_length=100)),
                ('dosage', models.CharField(max_length=100)),
                ('frequency', models.CharField(max_length=100)),
                ('duration', models.CharField(max_length=100)),
                ('instructions', models.TextField()),
                ('prescription', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medications', to='prescription.prescription')),
            ],
        ),
    ]
