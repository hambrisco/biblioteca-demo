import { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Chip, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usuarioService } from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    id: null,
    rut: '',
    nombre: '',
    email: '',
    telefono: '',
    tipo_usuario: 'ESTUDIANTE'
  });

  const fetchUsuarios = async () => {
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      showSnackbar('Error al cargar usuarios', 'error');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (usuario = null) => {
    if (usuario) {
      setFormData(usuario);
      setEditMode(true);
    } else {
      setFormData({ id: null, rut: '', nombre: '', email: '', telefono: '', tipo_usuario: 'ESTUDIANTE' });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ id: null, rut: '', nombre: '', email: '', telefono: '', tipo_usuario: 'ESTUDIANTE' });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await usuarioService.update(formData.id, formData);
        showSnackbar('Usuario actualizado correctamente');
      } else {
        await usuarioService.create(formData);
        showSnackbar('Usuario creado correctamente');
      }
      handleClose();
      fetchUsuarios();
    } catch (error) {
      showSnackbar('Error al guardar usuario', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usuarioService.delete(id);
        showSnackbar('Usuario eliminado correctamente');
        fetchUsuarios();
      } catch (error) {
        showSnackbar('Error al eliminar usuario', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
      
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Nuevo Usuario
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>RUT</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.rut}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.tipo_usuario} 
                    color={usuario.tipo_usuario === 'DOCENTE' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.bloqueado ? 'Bloqueado' : 'Activo'} 
                    color={usuario.bloqueado ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(usuario)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="normal" label="RUT" placeholder="12345678-9"
            value={formData.rut}
            onChange={(e) => setFormData({...formData, rut: e.target.value})}
            disabled={editMode}
          />
          <TextField
            fullWidth margin="normal" label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          />
          <TextField
            fullWidth margin="normal" label="Email" type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            fullWidth margin="normal" label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Usuario</InputLabel>
            <Select
              value={formData.tipo_usuario}
              label="Tipo de Usuario"
              onChange={(e) => setFormData({...formData, tipo_usuario: e.target.value})}
            >
              <MenuItem value="ESTUDIANTE">Estudiante</MenuItem>
              <MenuItem value="DOCENTE">Docente</MenuItem>
              <MenuItem value="BIBLIOTECARIO">Bibliotecario</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Usuarios;
