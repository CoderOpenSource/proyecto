# historical/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalHistoryViewSet

router = DefaultRouter()
router.register(r'medical_histories', MedicalHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
