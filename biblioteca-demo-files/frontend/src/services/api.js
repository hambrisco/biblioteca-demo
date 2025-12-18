/**
 * Configuración de Axios para conexión con el backend
 */
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de Usuario
export const usuarioService = {
  getAll: () => api.get('/usuarios/'),
  getById: (id) => api.get(`/usuarios/${id}/`),
  create: (data) => api.post('/usuarios/', data),
  update: (id, data) => api.put(`/usuarios/${id}/`, data),
  delete: (id) => api.delete(`/usuarios/${id}/`),
};

// Servicios de Libro
export const libroService = {
  getAll: () => api.get('/libros/'),
  search: (query) => api.get(`/libros/?search=${query}`),
  getById: (isbn) => api.get(`/libros/${isbn}/`),
  create: (data) => api.post('/libros/', data),
  update: (isbn, data) => api.put(`/libros/${isbn}/`, data),
  delete: (isbn) => api.delete(`/libros/${isbn}/`),
};

// Servicios de Préstamo
export const prestamoService = {
  getAll: () => api.get('/prestamos/'),
  getById: (id) => api.get(`/prestamos/${id}/`),
  create: (data) => api.post('/prestamos/', data),
  renovar: (id) => api.post(`/prestamos/${id}/renovar/`),
  devolver: (id) => api.post(`/prestamos/${id}/devolver/`),
  delete: (id) => api.delete(`/prestamos/${id}/`),
};

// Servicios de Multa
export const multaService = {
  getAll: () => api.get('/multas/'),
  getById: (id) => api.get(`/multas/${id}/`),
  pagar: (id) => api.post(`/multas/${id}/pagar/`),
  delete: (id) => api.delete(`/multas/${id}/`),
};

export default api;
