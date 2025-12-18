"""
Serializadores - Convierten modelos a JSON y viceversa
"""
from rest_framework import serializers
from .models import Usuario, Libro, Prestamo, Multa

class UsuarioSerializer(serializers.ModelSerializer):
    dias_prestamo = serializers.ReadOnlyField()
    
    class Meta:
        model = Usuario
        fields = '__all__'


class LibroSerializer(serializers.ModelSerializer):
    disponible = serializers.ReadOnlyField()
    
    class Meta:
        model = Libro
        fields = '__all__'


class MultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Multa
        fields = '__all__'


class PrestamoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    libro_titulo = serializers.CharField(source='libro.titulo', read_only=True)
    dias_retraso = serializers.ReadOnlyField()
    multa = MultaSerializer(read_only=True)
    
    class Meta:
        model = Prestamo
        fields = '__all__'


class PrestamoCreateSerializer(serializers.ModelSerializer):
    """Serializador para crear préstamos"""
    class Meta:
        model = Prestamo
        fields = ['usuario', 'libro']
    
    def validate(self, data):
        # Validar que el usuario no esté bloqueado
        if data['usuario'].bloqueado:
            raise serializers.ValidationError("El usuario está bloqueado por multas pendientes")
        
        # Validar que el libro esté disponible
        if data['libro'].stock_disponible <= 0:
            raise serializers.ValidationError("El libro no está disponible")
        
        return data