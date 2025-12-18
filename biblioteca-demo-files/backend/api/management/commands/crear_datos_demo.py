"""
Comando para crear datos de demostración
Ejecutar: python manage.py crear_datos_demo
"""
from django.core.management.base import BaseCommand
from api.models import Usuario, Libro, Prestamo
from datetime import timedelta
from django.utils import timezone


class Command(BaseCommand):
    help = 'Crea datos de demostración para la biblioteca'

    def handle(self, *args, **options):
        # Limpiar datos existentes
        Prestamo.objects.all().delete()
        Usuario.objects.all().delete()
        Libro.objects.all().delete()
        
        # Crear usuarios
        usuarios = [
            Usuario.objects.create(
                rut='12345678-9',
                nombre='Juan Pérez',
                email='juan@mail.com',
                telefono='912345678',
                tipo_usuario='ESTUDIANTE'
            ),
            Usuario.objects.create(
                rut='98765432-1',
                nombre='María García',
                email='maria@mail.com',
                telefono='987654321',
                tipo_usuario='DOCENTE'
            ),
            Usuario.objects.create(
                rut='11111111-1',
                nombre='Carlos López',
                email='carlos@mail.com',
                tipo_usuario='ESTUDIANTE'
            ),
        ]
        self.stdout.write(f'✓ Creados {len(usuarios)} usuarios')
        
        # Crear libros
        libros = [
            Libro.objects.create(
                isbn='9780134685991',
                titulo='Effective Java',
                autor='Joshua Bloch',
                editorial='Addison-Wesley',
                anio_publicacion=2018,
                categoria='PROGRAMACION',
                stock_total=3,
                stock_disponible=3
            ),
            Libro.objects.create(
                isbn='9781491950357',
                titulo='JavaScript: The Good Parts',
                autor='Douglas Crockford',
                editorial="O'Reilly",
                anio_publicacion=2008,
                categoria='PROGRAMACION',
                stock_total=2,
                stock_disponible=2
            ),
            Libro.objects.create(
                isbn='9780596517748',
                titulo='JavaScript: The Definitive Guide',
                autor='David Flanagan',
                editorial="O'Reilly",
                anio_publicacion=2020,
                categoria='PROGRAMACION',
                stock_total=2,
                stock_disponible=2
            ),
            Libro.objects.create(
                isbn='9781449373320',
                titulo='Designing Data-Intensive Applications',
                autor='Martin Kleppmann',
                editorial="O'Reilly",
                anio_publicacion=2017,
                categoria='BASE_DATOS',
                stock_total=2,
                stock_disponible=2
            ),
            Libro.objects.create(
                isbn='9780135166307',
                titulo='Clean Architecture',
                autor='Robert C. Martin',
                editorial='Prentice Hall',
                anio_publicacion=2017,
                categoria='SISTEMAS',
                stock_total=3,
                stock_disponible=3
            ),
        ]
        self.stdout.write(f'✓ Creados {len(libros)} libros')
        
        # Crear un préstamo activo
        Prestamo.objects.create(
            usuario=usuarios[0],
            libro=libros[0],
            fecha_devolucion_esperada=timezone.now().date() + timedelta(days=7)
        )
        libros[0].stock_disponible -= 1
        libros[0].save()
        
        # Crear un préstamo vencido (para demo de multas)
        prestamo_vencido = Prestamo.objects.create(
            usuario=usuarios[2],
            libro=libros[1],
            fecha_devolucion_esperada=timezone.now().date() - timedelta(days=5)
        )
        prestamo_vencido.estado = 'VENCIDO'
        prestamo_vencido.save()
        libros[1].stock_disponible -= 1
        libros[1].save()
        
        self.stdout.write(self.style.SUCCESS('✓ Datos de demostración creados exitosamente!'))
        self.stdout.write('')
        self.stdout.write('Resumen:')
        self.stdout.write(f'  - Usuarios: {Usuario.objects.count()}')
        self.stdout.write(f'  - Libros: {Libro.objects.count()}')
        self.stdout.write(f'  - Préstamos: {Prestamo.objects.count()}')
