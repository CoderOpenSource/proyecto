# transacciones/serializers.py
from rest_framework import serializers
from .models import TipoPago, Carrito, CarritoProductoDetalle, Transaccion, Factura

class TipoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPago
        fields = '__all__'

class CarritoProductoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoProductoDetalle
        fields = '__all__'

class CarritoSerializer(serializers.ModelSerializer):
    productos_detalle = CarritoProductoDetalleSerializer(source='carritoproductodetalle_set', many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = '__all__'

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'
