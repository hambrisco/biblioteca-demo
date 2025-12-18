import { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Chip, Alert, Snackbar, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { libroService } from '../services/api';

function Libros() {
  const [libros, setLibros] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    isbn: '', titulo: '', autor: '', editorial: '',
    anio_publicacion: 2024, categoria: 'GENERAL', stock_total: 1, stock_disponible: 1
  });

  const fetchLibros = async () => {
    try {
      const response = search 
        ? await libroService.search(search)
        : await libroService.getAll();
      setLibros(response.data);
    } catch (error) {
      showSnackbar('Error al cargar libros', 'error');
    }
  };

  useEffect(() => {
    fetchLibros();
  }, [search]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (libro = null) => {
    if (libro) {
      setFormData(libro);
      setEditMode(true);
    } else {
      setFormData({ isbn: '', titulo: '', autor: '', editorial: '', anio_publicacion: 2024, categoria: 'GENERAL', stock_total: 1, stock_disponible: 1 });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await libroService.update(formData.isbn, formData);
        showSnackbar('Libro actualizado correctamente');
      } else {
        await libroService.create(formData);
        showSnackbar('Libro creado correctamente');
      }
      setOpen(false);
      fetchLibros();
    } catch (error) {
      showSnackbar('Error al guardar libro', 'error');
    }
  };

  const handleDelete = async (isbn) => {
    if (window.confirm('¿Está seguro de eliminar este libro?')) {
      try {
        await libroService.delete(isbn);
        showSnackbar('Libro eliminado correctamente');
        fetchLibros();
      } catch (error) {
        showSnackbar('Error al eliminar libro', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Catálogo de Libros</Typography>
      
      <TextField
        placeholder="Buscar por título o autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, mr: 2, width: 300 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
        }}
      />
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
        Nuevo Libro
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#388e3c' }}>
              <TableCell sx={{ color: 'white' }}>ISBN</TableCell>
              <TableCell sx={{ color: 'white' }}>Título</TableCell>
              <TableCell sx={{ color: 'white' }}>Autor</TableCell>
              <TableCell sx={{ color: 'white' }}>Categoría</TableCell>
              <TableCell sx={{ color: 'white' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {libros.map((libro) => (
              <TableRow key={libro.isbn}>
                <TableCell>{libro.isbn}</TableCell>
                <TableCell>{libro.titulo}</TableCell>
                <TableCell>{libro.autor}</TableCell>
                <TableCell><Chip label={libro.categoria} size="small" /></TableCell>
                <TableCell>
                  <Chip 
                    label={`${libro.stock_disponible}/${libro.stock_total}`}
                    color={libro.stock_disponible > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(libro)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(libro.isbn)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Libro' : 'Nuevo Libro'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="ISBN" placeholder="9780134685991" value={formData.isbn}
            onChange={(e) => setFormData({...formData, isbn: e.target.value})} disabled={editMode} />
          <TextField fullWidth margin="normal" label="Título" value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
          <TextField fullWidth margin="normal" label="Autor" value={formData.autor}
            onChange={(e) => setFormData({...formData, autor: e.target.value})} />
          <TextField fullWidth margin="normal" label="Editorial" value={formData.editorial}
            onChange={(e) => setFormData({...formData, editorial: e.target.value})} />
          <TextField fullWidth margin="normal" label="Año" type="number" value={formData.anio_publicacion}
            onChange={(e) => setFormData({...formData, anio_publicacion: parseInt(e.target.value)})} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select value={formData.categoria} label="Categoría"
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
              <MenuItem value="PROGRAMACION">Programación</MenuItem>
              <MenuItem value="BASE_DATOS">Base de Datos</MenuItem>
              <MenuItem value="REDES">Redes</MenuItem>
              <MenuItem value="SISTEMAS">Sistemas</MenuItem>
              <MenuItem value="MATEMATICAS">Matemáticas</MenuItem>
              <MenuItem value="GENERAL">General</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Stock Total" type="number" value={formData.stock_total}
            onChange={(e) => setFormData({...formData, stock_total: parseInt(e.target.value), stock_disponible: parseInt(e.target.value)})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Libros;
