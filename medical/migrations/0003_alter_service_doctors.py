# Generated by Django 5.0.4 on 2024-05-15 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medical', '0002_initial'),
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='doctors',
            field=models.ManyToManyField(related_name='services', to='usuarios.doctor'),
        ),
    ]
