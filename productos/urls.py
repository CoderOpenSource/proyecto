# productos/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, SubcategoriaViewSet, ProductoViewSet, ImagenProductoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'subcategorias', SubcategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'imagenes', ImagenProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
