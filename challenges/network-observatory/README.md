# Network Observatory

Formato: Docker · Modo: staged · Duración: 45 min

```bash
docker compose up --build
```

Abrí `http://localhost:8080`. Las etapas son `recon`, `internal-api` y `final`, en ese orden. Para detenerlo:

```bash
docker compose down
```

El entorno expone solo el gateway en localhost.
