from django.db import models
from usuarios.models import Doctor

class Shift(models.Model):
    name = models.CharField(max_length=100)

class Schedule(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
