import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import ContainerGrid from './components/ContainerGrid';
import { fetchContainers } from './api';

function App() {
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContainers = async () => {
      try {
        const data = await fetchContainers();
        setContainers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load containers');
        console.error('Error loading containers:', err);
      }
    };

    // Загружаем контейнеры сразу и каждые 10 секунд
    loadContainers();
    const interval = setInterval(loadContainers, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            G4te Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error ? (
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        ) : (
          <ContainerGrid containers={containers} />
        )}
      </Container>
    </Box>
  );
}

export default App;
