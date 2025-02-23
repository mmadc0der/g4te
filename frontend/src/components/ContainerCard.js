import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Link,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';

function ContainerCard({ container }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'exited':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <PlayArrowIcon />;
      case 'exited':
        return <StopIcon />;
      default:
        return null;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: 6,
        borderColor: container.is_available ? 'success.main' : 'error.main'
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {container.name}
        </Typography>
        
        <Typography color="textSecondary" gutterBottom>
          {container.image}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={getStatusIcon(container.status)}
            label={container.status}
            color={getStatusColor(container.status)}
            size="small"
          />
          {container.is_available ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Available"
              color="success"
              size="small"
            />
          ) : (
            <Chip
              icon={<CancelIcon />}
              label="Unavailable"
              color="error"
              size="small"
            />
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          {container.ports.map((port, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Link 
                href={`http://localhost:${port.host_port}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {`${port.container_port} → ${port.host_port}`}
              </Link>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ContainerCard;
