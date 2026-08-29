# Cache Mirage

Formato: Docker · Modo: multi-staged · Duración: 50 min

```bash
docker compose up --build
```

Abrí `http://localhost:8081`. Las etapas `headers`, `preview` y `final` se pueden resolver en cualquier orden. El reto modela respuestas HTTP y una caché deliberadamente mal configurada dentro de Docker local.
