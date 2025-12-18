import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Libros from './pages/Libros';
import Prestamos from './pages/Prestamos';
import Multas from './pages/Multas';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f57c00' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/multas" element={<Multas />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
