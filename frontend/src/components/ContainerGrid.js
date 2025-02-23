import React from 'react';
import { Grid } from '@mui/material';
import ContainerCard from './ContainerCard';

function ContainerGrid({ containers }) {
  return (
    <Grid container spacing={3}>
      {containers.map((container) => (
        <Grid item xs={12} sm={6} md={4} key={container.id}>
          <ContainerCard container={container} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ContainerGrid;
