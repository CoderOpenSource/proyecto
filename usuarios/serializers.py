from rest_framework import serializers
from django.contrib.auth import get_user_model
from medical.models import Specialty
from .models import Patient, Doctor, Admin

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'photo', 'user_type', 'password')
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            if attr != 'username':  # Excluir username de la actualización
                setattr(instance, attr, value)
        instance.save()
        return instance

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    specialty = serializers.SlugRelatedField(slug_field='name', queryset=Specialty.objects.all())

    class Meta:
        model = Doctor
        fields = ('user', 'specialty')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(validated_data=user_data)  # Crea un usuario primero
        doctor = Doctor.objects.create(user=user, **validated_data)  # Crea el doctor con el usuario ya creado
        return doctor

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
        return super().update(instance, validated_data)

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ('user',)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(validated_data=user_data)  # Crea un usuario primero
        patient = Patient.objects.create(user=user)  # Crea el paciente con el usuario ya creado
        return patient

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
        return super().update(instance, validated_data)

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ('user',)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(validated_data=user_data)  # Crea un usuario primero
        admin = Admin.objects.create(user=user)  # Crea el administrador con el usuario ya creado
        return admin

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            UserSerializer().update(instance.user, user_data)  # Actualiza el usuario asociado
        return instance

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
