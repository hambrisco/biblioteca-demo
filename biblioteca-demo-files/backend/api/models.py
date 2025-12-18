"""
Modelos de la Base de Datos - Sistema de Gestión de Biblioteca
"""
from django.db import models
from django.utils import timezone
from datetime import timedelta

class Usuario(models.Model):
    """Modelo base para usuarios del sistema"""
    TIPO_CHOICES = [
        ('ESTUDIANTE', 'Estudiante'),
        ('DOCENTE', 'Docente'),
        ('BIBLIOTECARIO', 'Bibliotecario'),
    ]
    
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15, blank=True)
    tipo_usuario = models.CharField(max_length=15, choices=TIPO_CHOICES, default='ESTUDIANTE')
    bloqueado = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.nombre} ({self.rut})"
    
    @property
    def dias_prestamo(self):
        """Estudiantes: 7 días, Docentes: 14 días"""
        return 14 if self.tipo_usuario == 'DOCENTE' else 7
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'


class Libro(models.Model):
    """Catálogo de libros de la biblioteca"""
    CATEGORIA_CHOICES = [
        ('PROGRAMACION', 'Programación'),
        ('BASE_DATOS', 'Base de Datos'),
        ('REDES', 'Redes'),
        ('SISTEMAS', 'Sistemas Operativos'),
        ('MATEMATICAS', 'Matemáticas'),
        ('GENERAL', 'General'),
    ]
    
    isbn = models.CharField(max_length=13, primary_key=True)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    editorial = models.CharField(max_length=100)
    anio_publicacion = models.IntegerField()
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='GENERAL')
    stock_total = models.IntegerField(default=1)
    stock_disponible = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.titulo} - {self.autor}"
    
    @property
    def disponible(self):
        return self.stock_disponible > 0
    
    class Meta:
        verbose_name = 'Libro'
        verbose_name_plural = 'Libros'


class Prestamo(models.Model):
    """Registro de préstamos de libros"""
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('DEVUELTO', 'Devuelto'),
        ('VENCIDO', 'Vencido'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='prestamos')
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name='prestamos')
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion_esperada = models.DateField()
    fecha_devolucion_real = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVO')
    renovado = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        # Calcular fecha de devolución automáticamente
        if not self.fecha_devolucion_esperada:
            self.fecha_devolucion_esperada = timezone.now().date() + timedelta(days=self.usuario.dias_prestamo)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Préstamo: {self.libro.titulo} -> {self.usuario.nombre}"
    
    @property
    def dias_retraso(self):
        """Calcula días de retraso si el préstamo está vencido"""
        if self.estado == 'DEVUELTO' and self.fecha_devolucion_real:
            if self.fecha_devolucion_real > self.fecha_devolucion_esperada:
                return (self.fecha_devolucion_real - self.fecha_devolucion_esperada).days
        elif self.estado == 'ACTIVO':
            hoy = timezone.now().date()
            if hoy > self.fecha_devolucion_esperada:
                return (hoy - self.fecha_devolucion_esperada).days
        return 0
    
    class Meta:
        verbose_name = 'Préstamo'
        verbose_name_plural = 'Préstamos'
        ordering = ['-fecha_prestamo']


class Multa(models.Model):
    """Multas por devolución tardía"""
    prestamo = models.OneToOneField(Prestamo, on_delete=models.CASCADE, related_name='multa')
    dias_retraso = models.IntegerField()
    monto_por_dia = models.IntegerField(default=1000)  # $1000 CLP por día
    monto_total = models.IntegerField()
    pagada = models.BooleanField(default=False)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    fecha_pago = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Calcular monto total automáticamente
        self.monto_total = self.dias_retraso * self.monto_por_dia
        super().save(*args, **kwargs)
    
    def __str__(self):
        estado = "Pagada" if self.pagada else "Pendiente"
        return f"Multa ${self.monto_total} - {estado}"
    
    class Meta:
        verbose_name = 'Multa'
        verbose_name_plural = 'Multas'