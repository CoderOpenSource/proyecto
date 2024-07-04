from django.db import models

from usuarios.models import Patient


class Specialty(models.Model):
    name = models.CharField(max_length=100)

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    doctors = models.ManyToManyField('usuarios.Doctor', related_name='services')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='service_images/', blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  # Añadir atributo de descuento

class LabTest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class LabRequest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    test = models.ForeignKey(LabTest, on_delete=models.CASCADE)
    date_requested = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending')

    def __str__(self):
        return f"{self.patient} - {self.test.name} - {self.date_requested}"