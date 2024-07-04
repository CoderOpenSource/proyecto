from rest_framework import serializers
from .models import Schedule, Shift, Doctor
from usuarios.serializers import DoctorSerializer  # Asegúrate de tener un serializador para Doctor

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'name']

class ScheduleSerializer(serializers.ModelSerializer):
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )
    shift_id = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.all(), source='shift', write_only=True
    )
    doctor = DoctorSerializer(read_only=True)
    shift = ShiftSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'start_time', 'end_time', 'doctor_id', 'shift_id', 'doctor', 'shift']

    def create(self, validated_data):
        # El método create debería manejar la creación de una instancia Schedule adecuadamente
        return Schedule.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        if 'doctor' in validated_data:
            instance.doctor = validated_data['doctor']
        if 'shift' in validated_data:
            instance.shift = validated_data['shift']
        instance.save()
        return instance
