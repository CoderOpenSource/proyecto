from rest_framework import serializers
from .models import Specialty, Service, LabTest, LabRequest
from usuarios.models import Doctor
from usuarios.serializers import DoctorSerializer

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class ServiceSerializer(serializers.ModelSerializer):
    doctors = DoctorSerializer(many=True, read_only=True)  # Mantiene el campo de sólo lectura para la lista de doctores
    doctor_ids = serializers.PrimaryKeyRelatedField(many=True, write_only=True, queryset=Doctor.objects.all(), source='doctors')  # Permitir asignar doctores mediante ID
    image = serializers.ImageField(allow_null=True, required=False)  # Agregar el campo de imagen al serializer

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'doctors', 'doctor_ids', 'price', 'image', 'discount']  # Añadir discount aquí

    def create(self, validated_data):
        doctors = validated_data.pop('doctors', [])  # Extraer la lista de doctores usando la clave 'source' definida en doctor_ids
        service = Service.objects.create(**validated_data)
        service.doctors.set(doctors)  # Asignar doctores al servicio creado
        return service

    def update(self, instance, validated_data):
        if 'doctors' in validated_data:
            doctors = validated_data.pop('doctors')
            instance.doctors.set(doctors)  # Actualizar los doctores del servicio
        return super().update(instance, validated_data)

class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = ['id', 'name', 'description']

class LabRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabRequest
        fields = ['id', 'patient', 'test', 'date_requested', 'status']
        read_only_fields = ['date_requested', 'status']