from rest_framework import serializers
from .models import Prescription, Medication

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'medication_name', 'dosage', 'frequency', 'duration', 'instructions']

class PrescriptionSerializer(serializers.ModelSerializer):
    medications = MedicationSerializer(many=True)

    class Meta:
        model = Prescription
        fields = ['id', 'date', 'patient', 'doctor', 'medications']

    def create(self, validated_data):
        medications_data = validated_data.pop('medications')
        prescription = Prescription.objects.create(**validated_data)
        for medication_data in medications_data:
            Medication.objects.create(prescription=prescription, **medication_data)
        return prescription
