# 📚 Sistema de Gestión de Biblioteca

Sistema completo de gestión de biblioteca desarrollado con **Django REST Framework** (Backend) y **React** (Frontend).

## 🎯 Características

- ✅ Gestión de Usuarios (Estudiantes, Docentes, Bibliotecarios)
- ✅ Catálogo de Libros con búsqueda
- ✅ Sistema de Préstamos y Devoluciones
- ✅ Generación automática de Multas por retraso
- ✅ Bloqueo de usuarios con multas pendientes
- ✅ Dashboard con estadísticas en tiempo real
- ✅ API REST completamente funcional
- ✅ Interfaz moderna con Material Design

## 🛠️ Tech Stack

### Backend
- **Django 4.2** - Framework web Python
- **Django REST Framework** - API REST
- **django-cors-headers** - Soporte CORS
- **SQLite** - Base de datos

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **Material-UI (MUI)** - Componentes UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## 📋 Instalación y Configuración

### Requisitos Previos
- Python 3.13+
- Node.js 18+
- npm o yarn

### Backend (Django)

```bash
# Navegar al directorio del backend
cd biblioteca-demo-files/backend

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear datos de demostración
python manage.py crear_datos_demo

# Iniciar servidor
python manage.py runserver
```

El backend estará disponible en: **http://127.0.0.1:8000/**

### Frontend (React)

```bash
# Navegar al directorio del frontend
cd biblioteca-demo-files/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173/**

## 📡 API Endpoints

### Usuarios
- `GET /api/usuarios/` - Listar todos los usuarios
- `POST /api/usuarios/` - Crear nuevo usuario
- `GET /api/usuarios/{id}/` - Obtener usuario específico
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario

### Libros
- `GET /api/libros/` - Listar todos los libros
- `GET /api/libros/?search=query` - Buscar libros
- `POST /api/libros/` - Crear nuevo libro
- `PUT /api/libros/{isbn}/` - Actualizar libro
- `DELETE /api/libros/{isbn}/` - Eliminar libro

### Préstamos
- `GET /api/prestamos/` - Listar préstamos
- `POST /api/prestamos/` - Crear préstamo
- `POST /api/prestamos/{id}/renovar/` - Renovar préstamo
- `POST /api/prestamos/{id}/devolver/` - Devolver libro
- `DELETE /api/prestamos/{id}/` - Eliminar préstamo

### Multas
- `GET /api/multas/` - Listar multas
- `POST /api/multas/{id}/pagar/` - Pagar multa
- `DELETE /api/multas/{id}/` - Eliminar multa

## 📊 Modelos de Datos

### Usuario
```python
- RUT (único)
- Nombre
- Email
- Teléfono
- Tipo (Estudiante/Docente/Bibliotecario)
- Bloqueado (por multas)
```

### Libro
```python
- ISBN (clave primaria)
- Título
- Autor
- Editorial
- Año de Publicación
- Categoría
- Stock Total
- Stock Disponible
```

### Préstamo
```python
- Usuario (FK)
- Libro (FK)
- Fecha de Préstamo
- Fecha de Devolución Esperada
- Fecha de Devolución Real
- Estado (ACTIVO/DEVUELTO/VENCIDO)
- Renovado (booleano)
```

### Multa
```python
- Préstamo (FK Única)
- Días de Retraso
- Monto por Día ($1.000 CLP)
- Monto Total
- Pagada (booleano)
- Fecha de Generación
- Fecha de Pago
```

## 🎮 Uso de la Aplicación

1. Acceder a **http://localhost:5173/**
2. Navegar por el menú superior
3. **Inicio**: Ver estadísticas del sistema
4. **Usuarios**: Gestionar usuarios (CRUD)
5. **Libros**: Catálogo y búsqueda de libros
6. **Préstamos**: Crear, renovar y devolver libros
7. **Multas**: Ver y pagar multas pendientes

## 🔑 Datos de Demostración

Al ejecutar `crear_datos_demo` se crean:
- **3 Usuarios**: Juan Pérez, María García, Carlos López
- **5 Libros**: Variedades en Programación, BD, Redes, Sistemas y Matemáticas
- **2 Préstamos**: Activos en el sistema

## 📝 Notas

- El servidor Django incluye admin en: **http://127.0.0.1:8000/admin/**
- CORS está habilitado para permitir conexiones locales
- No requiere autenticación en modo demo
- Las multas se generan automáticamente al devolver libros con retraso
- Los usuarios se bloquean automáticamente si tienen multas pendientes

## 🚀 Despliegue a Producción

Para desplegar a producción:

1. **Backend**:
   - Cambiar `DEBUG = False` en settings.py
   - Usar base de datos PostgreSQL
   - Configurar variables de entorno (.env)
   - Usar gunicorn como servidor WSGI

2. **Frontend**:
   - Ejecutar `npm run build`
   - Servir archivos estáticos desde Nginx o Apache

## 📄 Estructura del Proyecto

```
biblioteca-demo-completo/
├── .venv/                          # Entorno virtual Python
├── biblioteca-demo-files/
│   ├── backend/
│   │   ├── api/                    # Aplicación Django
│   │   │   ├── models.py           # Modelos de datos
│   │   │   ├── views.py            # ViewSets API
│   │   │   ├── serializers.py      # Serializadores
│   │   │   ├── urls.py             # Rutas API
│   │   │   ├── admin.py            # Admin site
│   │   │   └── management/
│   │   │       └── commands/
│   │   │           └── crear_datos_demo.py
│   │   ├── biblioteca_api/         # Configuración Django
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── manage.py               # Herramienta CLI Django
│   │   └── requirements.txt        # Dependencias Python
│   │
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx             # Componente principal
│       │   ├── main.jsx            # Punto de entrada
│       │   ├── components/
│       │   │   └── Navbar.jsx
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Usuarios.jsx
│       │   │   ├── Libros.jsx
│       │   │   ├── Prestamos.jsx
│       │   │   └── Multas.jsx
│       │   └── services/
│       │       └── api.js          # Cliente Axios
│       ├── package.json            # Dependencias Node
│       ├── vite.config.js          # Configuración Vite
│       └── index.html              # HTML principal
│
├── .gitignore
└── README.md
```

## 👥 Autores

- Mario Campos
- Francisco Currihuinca

Proyecto Integrado - Unidad 3 - INACAP

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## ❓ Soporte

Para reportar problemas o sugerencias, cree un issue en el repositorio de GitHub.

---

**Última actualización**: 17 de diciembre de 2025
