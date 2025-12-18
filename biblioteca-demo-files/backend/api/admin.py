"""
Configuración del panel de administración
"""
from django.contrib import admin
from .models import Usuario, Libro, Prestamo, Multa

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['rut', 'nombre', 'tipo_usuario', 'bloqueado']
    list_filter = ['tipo_usuario', 'bloqueado']
    search_fields = ['rut', 'nombre']

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ['isbn', 'titulo', 'autor', 'categoria', 'stock_disponible']
    list_filter = ['categoria']
    search_fields = ['titulo', 'autor']

@admin.register(Prestamo)
class PrestamoAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'libro', 'fecha_prestamo', 'estado', 'renovado']
    list_filter = ['estado', 'renovado']

@admin.register(Multa)
class MultaAdmin(admin.ModelAdmin):
    list_display = ['id', 'prestamo', 'monto_total', 'pagada']
    list_filter = ['pagada']