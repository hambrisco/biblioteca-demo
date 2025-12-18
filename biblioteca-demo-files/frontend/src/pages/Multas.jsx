import { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Chip, Alert, Snackbar
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import { multaService } from '../services/api';

function Multas() {
  const [multas, setMultas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchMultas = async () => {
    try {
      const response = await multaService.getAll();
      setMultas(response.data);
    } catch (error) {
      showSnackbar('Error al cargar multas', 'error');
    }
  };

  useEffect(() => { fetchMultas(); }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePagar = async (id) => {
    try {
      await multaService.pagar(id);
      showSnackbar('Multa pagada correctamente. Usuario desbloqueado.');
      fetchMultas();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Error al pagar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta multa?')) {
      try {
        await multaService.delete(id);
        showSnackbar('Multa eliminada');
        fetchMultas();
      } catch (error) {
        showSnackbar('Error al eliminar', 'error');
      }
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Multas</Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Las multas se generan automáticamente al devolver un libro con retraso. 
        <strong> Monto: $1.000 CLP por día de retraso.</strong> El usuario queda bloqueado hasta pagar todas sus multas.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#d32f2f' }}>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Préstamo</TableCell>
              <TableCell sx={{ color: 'white' }}>Días Retraso</TableCell>
              <TableCell sx={{ color: 'white' }}>Monto</TableCell>
              <TableCell sx={{ color: 'white' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha Generación</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {multas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay multas registradas. Las multas se generan al devolver libros con retraso.
                </TableCell>
              </TableRow>
            ) : (
              multas.map((multa) => (
                <TableRow key={multa.id}>
                  <TableCell>{multa.id}</TableCell>
                  <TableCell>Préstamo #{multa.prestamo}</TableCell>
                  <TableCell>{multa.dias_retraso} días</TableCell>
                  <TableCell><strong>{formatMoney(multa.monto_total)}</strong></TableCell>
                  <TableCell>
                    <Chip 
                      label={multa.pagada ? 'PAGADA' : 'PENDIENTE'} 
                      color={multa.pagada ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(multa.fecha_generacion).toLocaleDateString('es-CL')}</TableCell>
                  <TableCell>
                    {!multa.pagada && (
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePagar(multa.id)}
                        sx={{ mr: 1 }}
                      >
                        Pagar
                      </Button>
                    )}
                    <IconButton onClick={() => handleDelete(multa.id)} color="error" title="Eliminar">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Multas;
