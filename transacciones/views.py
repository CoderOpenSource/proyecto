# transacciones/views.py

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from productos.models import Producto
from .models import TipoPago, Carrito, CarritoProductoDetalle, Transaccion, Factura
from .serializers import TipoPagoSerializer, CarritoSerializer, CarritoProductoDetalleSerializer, TransaccionSerializer, \
    FacturaSerializer


class TipoPagoViewSet(viewsets.ModelViewSet):
    queryset = TipoPago.objects.all()
    serializer_class = TipoPagoSerializer


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer

    @action(detail=True, methods=['post'])
    def agregar_producto(self, request, pk=None):
        carrito = self.get_object()
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad')

        if producto_id and cantidad:
            producto = Producto.objects.get(id=producto_id)
            try:
                carrito.agregar_producto(producto, cantidad)
                return Response({'status': 'producto añadido'}, status=200)
            except ValidationError as e:
                return Response({'error': str(e)}, status=400)
        return Response({'error': 'Faltan datos'}, status=400)


class CarritoProductoDetalleViewSet(viewsets.ModelViewSet):
    queryset = CarritoProductoDetalle.objects.all()
    serializer_class = CarritoProductoDetalleSerializer


class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.all()
    serializer_class = TransaccionSerializer

    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        transaccion = self.get_object()
        try:
            transaccion.completar_transaccion()
            factura = Factura.objects.create(transaccion=transaccion)
            return Response({'status': 'transacción completada'}, status=200)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)


class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
