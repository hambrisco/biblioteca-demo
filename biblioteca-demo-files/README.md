# 🚀 GUÍA RÁPIDA - Sistema de Biblioteca Demo

## Pasos para ejecutar (15-20 minutos)

### PASO 1: Instalar Software
- Python 3.10+: https://www.python.org/downloads/
- Node.js 18+: https://nodejs.org/

---

### PASO 2: Configurar Backend

```bash
# Crear carpeta y entrar
mkdir biblioteca-demo
cd biblioteca-demo

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate
# Activar (Mac/Linux)
source venv/bin/activate

# Crear proyecto Django
pip install django djangorestframework django-cors-headers
django-admin startproject biblioteca_api backend
cd backend
python manage.py startapp api
```

**Ahora copiar los archivos:**
- `biblioteca_api/settings.py` → reemplazar contenido
- `biblioteca_api/urls.py` → reemplazar contenido  
- `api/models.py` → reemplazar contenido
- `api/serializers.py` → crear archivo
- `api/views.py` → reemplazar contenido
- `api/urls.py` → crear archivo
- `api/admin.py` → reemplazar contenido

**Crear carpetas para comando:**
```bash
mkdir -p api/management/commands
```
Crear archivos `__init__.py` vacíos en:
- `api/management/__init__.py`
- `api/management/commands/__init__.py`

Copiar `crear_datos_demo.py` a `api/management/commands/`

**Ejecutar:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py crear_datos_demo
python manage.py runserver
```

✅ Backend corriendo en: http://127.0.0.1:8000/api/

---

### PASO 3: Configurar Frontend

**Abrir NUEVA terminal:**

```bash
cd biblioteca-demo
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

**Copiar archivos:**
- `src/services/api.js` → crear carpeta y archivo
- `src/components/Navbar.jsx` → crear carpeta y archivo
- `src/pages/Home.jsx` → crear carpeta y archivo
- `src/pages/Usuarios.jsx`
- `src/pages/Libros.jsx`
- `src/pages/Prestamos.jsx`
- `src/pages/Multas.jsx`
- `src/App.jsx` → reemplazar
- `src/main.jsx` → reemplazar

**Ejecutar:**
```bash
npm run dev
```

✅ Frontend corriendo en: http://localhost:5173

---

## 🎮 Demo para Presentación

1. **Dashboard** → Ver estadísticas
2. **Usuarios** → Crear "Pedro González" (estudiante)
3. **Libros** → Agregar "Python Avanzado"
4. **Préstamos** → Pedro pide el libro
5. **Renovar** → Click en icono de renovar
6. **Devolver** → Click en icono devolver (simular retraso editando fecha en admin)
7. **Multas** → Ver multa generada, usuario bloqueado
8. **Pagar** → Usuario desbloqueado

---

## 📁 Estructura de Archivos

```
biblioteca-demo/
├── backend/
│   ├── biblioteca_api/
│   │   ├── __init__.py
│   │   ├── settings.py      ← COPIAR
│   │   ├── urls.py          ← COPIAR
│   │   └── wsgi.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── models.py        ← COPIAR
│   │   ├── serializers.py   ← COPIAR
│   │   ├── views.py         ← COPIAR
│   │   ├── urls.py          ← COPIAR
│   │   ├── admin.py         ← COPIAR
│   │   └── management/
│   │       └── commands/
│   │           └── crear_datos_demo.py  ← COPIAR
│   └── manage.py
│
└── frontend/
    └── src/
        ├── services/
        │   └── api.js       ← COPIAR
        ├── components/
        │   └── Navbar.jsx   ← COPIAR
        ├── pages/
        │   ├── Home.jsx     ← COPIAR
        │   ├── Usuarios.jsx ← COPIAR
        │   ├── Libros.jsx   ← COPIAR
        │   ├── Prestamos.jsx← COPIAR
        │   └── Multas.jsx   ← COPIAR
        ├── App.jsx          ← COPIAR
        └── main.jsx         ← COPIAR
```

---

## ⚠️ Troubleshooting

**Error CORS:** Verificar que corsheaders está en settings.py

**Error "Module not found":** Ejecutar `pip install` o `npm install` de nuevo

**API no responde:** Verificar que el servidor Django está corriendo

**Puerto ocupado:** Cambiar puerto con `python manage.py runserver 8001`
