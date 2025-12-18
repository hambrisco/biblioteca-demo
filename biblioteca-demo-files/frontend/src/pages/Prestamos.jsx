import { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel,
  IconButton, Chip, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import DeleteIcon from '@mui/icons-material/Delete';
import { prestamoService, usuarioService, libroService } from '../services/api';

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ usuario: '', libro: '' });

  const fetchData = async () => {
    try {
      const [prestamosRes, usuariosRes, librosRes] = await Promise.all([
        prestamoService.getAll(),
        usuarioService.getAll(),
        libroService.getAll()
      ]);
      setPrestamos(prestamosRes.data);
      setUsuarios(usuariosRes.data);
      setLibros(librosRes.data);
    } catch (error) {
      showSnackbar('Error al cargar datos', 'error');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async () => {
    try {
      await prestamoService.create(formData);
      showSnackbar('Préstamo creado correctamente');
      setOpen(false);
      setFormData({ usuario: '', libro: '' });
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.error || error.response?.data?.[0] || 'Error al crear préstamo', 'error');
    }
  };

  const handleRenovar = async (id) => {
    try {
      await prestamoService.renovar(id);
      showSnackbar('Préstamo renovado correctamente');
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error al renovar', 'error');
    }
  };

  const handleDevolver = async (id) => {
    try {
      const response = await prestamoService.devolver(id);
      if (response.data.multa) {
        showSnackbar(`Devolución registrada. Multa generada: $${response.data.multa.monto_total.toLocaleString('es-CL')}`, 'warning');
      } else {
        showSnackbar('Devolución registrada correctamente');
      }
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error al devolver', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este préstamo?')) {
      try {
        await prestamoService.delete(id);
        showSnackbar('Préstamo eliminado');
        fetchData();
      } catch (error) {
        showSnackbar('Error al eliminar', 'error');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'ACTIVO': return 'primary';
      case 'DEVUELTO': return 'success';
      case 'VENCIDO': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Préstamos</Typography>
      
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Nuevo Préstamo
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f57c00' }}>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white' }}>Libro</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha Préstamo</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha Devolución</TableCell>
              <TableCell sx={{ color: 'white' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No hay préstamos registrados</TableCell>
              </TableRow>
            ) : (
              prestamos.map((prestamo) => (
                <TableRow key={prestamo.id}>
                  <TableCell>{prestamo.id}</TableCell>
                  <TableCell>{prestamo.usuario_nombre}</TableCell>
                  <TableCell>{prestamo.libro_titulo}</TableCell>
                  <TableCell>{new Date(prestamo.fecha_prestamo).toLocaleDateString('es-CL')}</TableCell>
                  <TableCell>{prestamo.fecha_devolucion_esperada}</TableCell>
                  <TableCell>
                    <Chip label={prestamo.estado} color={getEstadoColor(prestamo.estado)} size="small" />
                    {prestamo.renovado && <Chip label="Renovado" size="small" sx={{ ml: 1 }} />}
                  </TableCell>
                  <TableCell>
                    {prestamo.estado === 'ACTIVO' && (
                      <>
                        <IconButton onClick={() => handleRenovar(prestamo.id)} color="primary" title="Renovar">
                          <AutorenewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDevolver(prestamo.id)} color="success" title="Devolver">
                          <AssignmentReturnIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton onClick={() => handleDelete(prestamo.id)} color="error" title="Eliminar">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Préstamo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Usuario</InputLabel>
            <Select value={formData.usuario} label="Usuario"
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}>
              {usuarios.filter(u => !u.bloqueado).map(u => (
                <MenuItem key={u.id} value={u.id}>{u.nombre} ({u.rut}) - {u.tipo_usuario}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Libro</InputLabel>
            <Select value={formData.libro} label="Libro"
              onChange={(e) => setFormData({...formData, libro: e.target.value})}>
              {libros.filter(l => l.stock_disponible > 0).map(l => (
                <MenuItem key={l.isbn} value={l.isbn}>{l.titulo} (Stock: {l.stock_disponible})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!formData.usuario || !formData.libro}>
            Crear Préstamo
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Prestamos;
