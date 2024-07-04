# productos/models.py
from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class Subcategoria(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='subcategorias')
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.categoria.nombre} - {self.nombre}"

class Producto(models.Model):
    ESTADOS_POSIBLES = [
        ('disponible', 'Disponible'),
        ('no_disponible', 'No Disponible'),
    ]

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='productos')
    subcategoria = models.ForeignKey(Subcategoria, on_delete=models.SET_NULL, null=True, related_name='productos_subcategoria')
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    proveedor = models.CharField(max_length=100, blank=True, null=True)
    requiere_prescripcion = models.BooleanField(default=False)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    codigo_barras = models.CharField(max_length=100, unique=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_POSIBLES, default='disponible')
    cantidad = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
    ruta_imagen = models.ImageField(upload_to='productos/imagenes/')

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
