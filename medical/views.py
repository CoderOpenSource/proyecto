from rest_framework import viewsets
from .models import Specialty, Service, LabTest, LabRequest
from .serializers import SpecialtySerializer, ServiceSerializer, LabTestSerializer, LabRequestSerializer


class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer

class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer