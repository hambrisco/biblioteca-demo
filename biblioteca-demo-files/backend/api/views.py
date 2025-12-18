"""
Vistas de la API - Endpoints REST
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Usuario, Libro, Prestamo, Multa
from .serializers import (
    UsuarioSerializer, LibroSerializer, 
    PrestamoSerializer, PrestamoCreateSerializer, MultaSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Usuarios
    GET /api/usuarios/ - Listar todos
    POST /api/usuarios/ - Crear nuevo
    GET /api/usuarios/{id}/ - Obtener uno
    PUT /api/usuarios/{id}/ - Actualizar
    DELETE /api/usuarios/{id}/ - Eliminar
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class LibroViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Libros
    GET /api/libros/ - Listar todos
    GET /api/libros/?search=python - Buscar por título/autor
    POST /api/libros/ - Crear nuevo
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    
    def get_queryset(self):
        queryset = Libro.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(titulo__icontains=search) | queryset.filter(autor__icontains=search)
        return queryset


class PrestamoViewSet(viewsets.ModelViewSet):
    """
    CRUD para Préstamos con acciones especiales
    """
    queryset = Prestamo.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PrestamoCreateSerializer
        return PrestamoSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear préstamo y actualizar stock"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Obtener libro y reducir stock
        libro = serializer.validated_data['libro']
        libro.stock_disponible -= 1
        libro.save()
        
        # Crear préstamo
        self.perform_create(serializer)
        
        # Retornar con datos completos
        prestamo = Prestamo.objects.get(pk=serializer.instance.pk)
        return Response(PrestamoSerializer(prestamo).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def renovar(self, request, pk=None):
        """
        POST /api/prestamos/{id}/renovar/
        Renueva el préstamo extendiendo la fecha de devolución
        """
        prestamo = self.get_object()
        
        if prestamo.renovado:
            return Response(
                {'error': 'Este préstamo ya fue renovado una vez'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if prestamo.estado != 'ACTIVO':
            return Response(
                {'error': 'Solo se pueden renovar préstamos activos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extender fecha de devolución
        from datetime import timedelta
        prestamo.fecha_devolucion_esperada += timedelta(days=prestamo.usuario.dias_prestamo)
        prestamo.renovado = True
        prestamo.save()
        
        return Response(PrestamoSerializer(prestamo).data)
    
    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        """
        POST /api/prestamos/{id}/devolver/
        Registra la devolución del libro, genera multa si hay retraso
        """
        prestamo = self.get_object()
        
        if prestamo.estado == 'DEVUELTO':
            return Response(
                {'error': 'Este préstamo ya fue devuelto'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hoy = timezone.now().date()
        prestamo.fecha_devolucion_real = hoy
        prestamo.estado = 'DEVUELTO'
        
        # Restaurar stock del libro
        prestamo.libro.stock_disponible += 1
        prestamo.libro.save()
        
        # Verificar si hay retraso y generar multa
        if hoy > prestamo.fecha_devolucion_esperada:
            dias_retraso = (hoy - prestamo.fecha_devolucion_esperada).days
            Multa.objects.create(
                prestamo=prestamo,
                dias_retraso=dias_retraso
            )
            # Bloquear usuario
            prestamo.usuario.bloqueado = True
            prestamo.usuario.save()
        
        prestamo.save()
        
        return Response(PrestamoSerializer(prestamo).data)


class MultaViewSet(viewsets.ModelViewSet):
    """
    CRUD para Multas
    """
    queryset = Multa.objects.all()
    serializer_class = MultaSerializer
    
    @action(detail=True, methods=['post'])
    def pagar(self, request, pk=None):
        """
        POST /api/multas/{id}/pagar/
        Registra el pago de una multa
        """
        multa = self.get_object()
        
        if multa.pagada:
            return Response(
                {'error': 'Esta multa ya fue pagada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        multa.pagada = True
        multa.fecha_pago = timezone.now()
        multa.save()
        
        # Verificar si el usuario tiene otras multas pendientes
        usuario = multa.prestamo.usuario
        multas_pendientes = Multa.objects.filter(
            prestamo__usuario=usuario,
            pagada=False
        ).count()
        
        if multas_pendientes == 0:
            usuario.bloqueado = False
            usuario.save()
        
        return Response(MultaSerializer(multa).data)
    
    @action(detail=True, methods=['delete'])
    def eliminar(self, request, pk=None):
        """
        DELETE /api/multas/{id}/eliminar/
        Elimina una multa (para demo)
        """
        multa = self.get_object()
        usuario = multa.prestamo.usuario
        multa.delete()
        
        # Verificar si desbloquear usuario
        multas_pendientes = Multa.objects.filter(
            prestamo__usuario=usuario,
            pagada=False
        ).count()
        
        if multas_pendientes == 0:
            usuario.bloqueado = False
            usuario.save()
        
        return Response({'message': 'Multa eliminada correctamente'})