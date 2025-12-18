"""
URLs de la API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'libros', views.LibroViewSet)
router.register(r'prestamos', views.PrestamoViewSet)
router.register(r'multas', views.MultaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]