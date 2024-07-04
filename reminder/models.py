# reminder/models.py
from django.db import models
from usuarios.models import Patient
from prescription.models import Prescription

class Reminder(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    reminder_date = models.DateTimeField()
    message = models.TextField()

    def __str__(self):
        return f"Reminder for {self.patient.user.username} on {self.reminder_date}"
