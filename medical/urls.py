from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpecialtyViewSet, ServiceViewSet, LabTestViewSet, LabRequestViewSet

router = DefaultRouter()
router.register(r'specialties', SpecialtyViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'lab-tests', LabTestViewSet)
router.register(r'lab-requests', LabRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
