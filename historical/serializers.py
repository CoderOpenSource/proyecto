# historical/serializers.py
from rest_framework import serializers
from .models import MedicalHistory

class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = '__all__'
