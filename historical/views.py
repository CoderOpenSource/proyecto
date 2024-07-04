# historical/views.py
from rest_framework import viewsets
from .models import MedicalHistory
from .serializers import MedicalHistorySerializer

class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
