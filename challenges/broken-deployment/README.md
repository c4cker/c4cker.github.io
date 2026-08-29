# Broken Deployment

Formato: Docker · Modo: multi-staged · Duración: 50 min

```bash
docker compose up --build
```

Abrí `http://localhost:8082`. Las etapas `frontend`, `api` y `worker` se pueden resolver en cualquier orden. Todos los servicios permanecen en la red local del challenge.
