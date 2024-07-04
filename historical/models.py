# historical/models.py
from django.db import models

from prescription.models import Prescription
from usuarios.models import Patient, Doctor

class MedicalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    symptoms = models.TextField()
    diagnosis = models.TextField()
    treatment = models.TextField()
    follow_up_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return f"{self.patient.user.username} - {self.date}"
