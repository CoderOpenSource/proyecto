from rest_framework import serializers
from .models import MedicalConsultation, ConsultingRoom
from usuarios.models import Patient, Doctor
from medical.models import Service
from scheduling.models import Schedule

class ConsultingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultingRoom
        fields = ['id', 'name']

class MedicalConsultationSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    consulting_room = serializers.PrimaryKeyRelatedField(queryset=ConsultingRoom.objects.all())
    schedule = serializers.PrimaryKeyRelatedField(queryset=Schedule.objects.all())  # Añade la referencia a Schedule

    class Meta:
        model = MedicalConsultation
        fields = ['id', 'date', 'patient', 'doctor', 'service', 'consulting_room', 'schedule']
