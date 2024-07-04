# transacciones/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoPagoViewSet, CarritoViewSet, CarritoProductoDetalleViewSet, TransaccionViewSet, FacturaViewSet

router = DefaultRouter()
router.register(r'tipos_pago', TipoPagoViewSet)
router.register(r'carritos', CarritoViewSet)
router.register(r'carritos_productos_detalle', CarritoProductoDetalleViewSet)
router.register(r'transacciones', TransaccionViewSet)
router.register(r'facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
