from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import docker
import asyncio
import aiohttp
from typing import List, Optional
import socket

app = FastAPI(title="G4te API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене заменить на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class ContainerInfo(BaseModel):
    id: str
    name: str
    status: str
    ports: List[dict]
    is_available: bool = True
    image: str

# Docker клиент
try:
    # Пробуем подключиться через сокет
    docker_client = docker.from_env()
except:
    try:
        # Пробуем подключиться через TCP
        docker_client = docker.DockerClient(base_url='tcp://localhost:2375')
    except:
        # Если не получается, используем заглушку для тестирования
        print("Warning: Could not connect to Docker daemon. Using mock data for testing.")
        docker_client = None

async def check_port_availability(host: str, port: int) -> bool:
    try:
        # Создаем TCP соединение для проверки порта
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)  # Таймаут 1 секунда
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

@app.get("/api/v1/containers", response_model=List[ContainerInfo])
async def get_containers():
    try:
        if docker_client is None:
            # Тестовые данные
            return [
                ContainerInfo(
                    id="mock_id_1",
                    name="test-container-1",
                    status="running",
                    ports=[{"container_port": "80/tcp", "host_port": "8080"}],
                    is_available=True,
                    image="test/image:latest"
                )
            ]

        containers = docker_client.containers.list(all=True)
        container_info_list = []

        for container in containers:
            # Получаем информацию о портах
            ports = []
            container_ports = container.attrs['NetworkSettings']['Ports']
            if container_ports:
                for container_port, host_ports in container_ports.items():
                    if host_ports:
                        for host_port in host_ports:
                            ports.append({
                                'container_port': container_port,
                                'host_port': host_port['HostPort']
                            })

            # Проверяем доступность сервиса
            is_available = False
            if ports and container.status == 'running':
                for port_info in ports:
                    host_port = int(port_info['host_port'])
                    is_available = await check_port_availability('localhost', host_port)
                    if is_available:
                        break

            container_info = ContainerInfo(
                id=container.id,
                name=container.name,
                status=container.status,
                ports=ports,
                is_available=is_available,
                image=container.image.tags[0] if container.image.tags else "none"
            )
            container_info_list.append(container_info)

        return container_info_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}
