import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Gestión de Biblioteca
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/usuarios">Usuarios</Button>
          <Button color="inherit" component={Link} to="/libros">Libros</Button>
          <Button color="inherit" component={Link} to="/prestamos">Préstamos</Button>
          <Button color="inherit" component={Link} to="/multas">Multas</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
