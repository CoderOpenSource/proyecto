from rest_framework import viewsets
from .serializers import MedicalConsultationSerializer, ConsultingRoomSerializer
from .models import MedicalConsultation, ConsultingRoom


class ConsultingRoomViewSet(viewsets.ModelViewSet):
    queryset = ConsultingRoom.objects.all()
    serializer_class = ConsultingRoomSerializer
class MedicalConsultationViewSet(viewsets.ModelViewSet):
    queryset = MedicalConsultation.objects.all()
    serializer_class = MedicalConsultationSerializer
