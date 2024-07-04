from django.db import models

from scheduling.models import Schedule
from usuarios.models import Patient, Doctor
from medical.models import Service

class ConsultingRoom(models.Model):
    name = models.CharField(max_length=100)

class MedicalConsultation(models.Model):
    date = models.DateField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    consulting_room = models.ForeignKey(ConsultingRoom, on_delete=models.CASCADE)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, null=True)  # Nuevo campo para almacenar el turno específico
