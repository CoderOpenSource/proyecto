# transacciones/models.py
from usuarios.models import Patient
from django.db import models
from django.core.exceptions import ValidationError
from productos.models import Producto

class TipoPago(models.Model):
    TIPOS_PAGO_CHOICES = [
        ('paypal', 'PayPal'),
        ('transferencia', 'Transferencia'),
        ('efectivo', 'Efectivo'),
        ('online', 'Pagos en Línea Visa'),
    ]

    nombre = models.CharField(max_length=20, choices=TIPOS_PAGO_CHOICES, unique=True)
    imagen_qr = models.ImageField(upload_to='pagos/codigos_qr/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Carrito(models.Model):
    usuario = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='carritos')
    productos = models.ManyToManyField(Producto, through='CarritoProductoDetalle', blank=True)
    disponible = models.BooleanField(default=True)

    def calcular_total(self):
        total = 0
        for carrito_producto_detalle in self.carritoproductodetalle_set.all():
            precio_producto = carrito_producto_detalle.producto.precio
            cantidad = carrito_producto_detalle.cantidad
            total += precio_producto * cantidad
        return total

    def __str__(self):
        return f"{self.usuario.user.username} - Carrito"

    def agregar_producto(self, producto, cantidad):
        if producto.requiere_prescripcion:
            if not self.usuario.user.tiene_prescripcion_valida(producto.nombre):
                raise ValidationError("Este producto requiere una prescripción médica válida.")
        carrito_producto_detalle, creado = CarritoProductoDetalle.objects.get_or_create(
            carrito=self, producto=producto, defaults={'cantidad': cantidad})
        if not creado:
            carrito_producto_detalle.cantidad += cantidad
            carrito_producto_detalle.save()

class CarritoProductoDetalle(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    def subtotal(self):
        return self.producto.precio * self.cantidad

    def __str__(self):
        return f"{self.carrito.usuario.user.username} - {self.producto.nombre} - Detalle en Carrito"

class Transaccion(models.Model):
    usuario = models.ForeignKey(Patient, on_delete=models.CASCADE)
    carrito = models.OneToOneField(Carrito, on_delete=models.CASCADE)
    tipo_pago = models.ForeignKey(TipoPago, on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.user.username} - Transacción"

    def completar_transaccion(self):
        for detalle in self.carrito.carritoproductodetalle_set.all():
            producto = detalle.producto
            if producto.cantidad < detalle.cantidad:
                raise ValidationError(f"No hay suficiente cantidad de {producto.nombre} en stock.")
            producto.cantidad -= detalle.cantidad
            producto.save()

class Factura(models.Model):
    transaccion = models.OneToOneField(Transaccion, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    pdf = models.FileField(upload_to='facturas/pdf/', blank=True, null=True)

    def calcular_total(self):
        return self.transaccion.carrito.calcular_total()

    def __str__(self):
        return f"{self.transaccion.usuario.user.username} - Factura"
