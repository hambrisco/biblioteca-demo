import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WarningIcon from '@mui/icons-material/Warning';
import { useState, useEffect } from 'react';
import { usuarioService, libroService, prestamoService, multaService } from '../services/api';

function Home() {
  const [stats, setStats] = useState({
    usuarios: 0,
    libros: 0,
    prestamos: 0,
    multas: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, libros, prestamos, multas] = await Promise.all([
          usuarioService.getAll(),
          libroService.getAll(),
          prestamoService.getAll(),
          multaService.getAll()
        ]);
        setStats({
          usuarios: usuarios.data.length,
          libros: libros.data.length,
          prestamos: prestamos.data.filter(p => p.estado === 'ACTIVO').length,
          multas: multas.data.filter(m => !m.pagada).length
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Usuarios', value: stats.usuarios, icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
    { title: 'Libros', value: stats.libros, icon: <BookIcon sx={{ fontSize: 40 }} />, color: '#388e3c' },
    { title: 'Préstamos Activos', value: stats.prestamos, icon: <SwapHorizIcon sx={{ fontSize: 40 }} />, color: '#f57c00' },
    { title: 'Multas Pendientes', value: stats.multas, icon: <WarningIcon sx={{ fontSize: 40 }} />, color: '#d32f2f' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard - Biblioteca INACAP
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Sistema de Gestión de Biblioteca - Proyecto Integrado Unidad 3
      </Typography>
      <Typography variant="body2" gutterBottom align="center" color="text.secondary">
        Mario Campos - Francisco Currihuinca
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
