# G4te - Application Gateway Dashboard

A lightweight dashboard for monitoring and accessing Docker applications running on your server.

## Features

- Display running applications as cards with status indicators
- Automatic discovery of Docker containers running on ports 8xxx
- Real-time status monitoring
- Clean and modern UI

## Tech Stack

- Frontend: React
- Backend: FastAPI (Python)
- Container: Docker & Docker Compose
- Proxy: Nginx

## Project Structure

```
g4te/
├── frontend/         # React frontend application
├── backend/          # FastAPI backend application
├── nginx/           # Nginx configuration
└── docker-compose.yml
```

## Development

1. Install Docker and Docker Compose
2. Clone this repository
3. Run `docker-compose up --build`
4. Access the dashboard at `http://localhost:8080`

## Configuration

The application will automatically discover Docker containers running on ports 8xxx.
Additional configuration options will be available in future releases.
