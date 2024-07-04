from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalConsultationViewSet, ConsultingRoomViewSet

router = DefaultRouter()
router.register(r'consultations', MedicalConsultationViewSet)
router.register(r'consultingrooms', ConsultingRoomViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
