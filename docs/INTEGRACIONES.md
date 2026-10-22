# Integraciones

## Despliegue: GitHub Pages

GitHub Pages publica un único artefacto: Main en `/`, Labs en `/labs/` y el blog Chirpy en `/blog/`. Pages también sirve los ZIPs de `challenges-sources/`. No hay backend: Labs no tiene login, ranking ni validación de flags.

La única integración externa es el formulario de contacto (Google Forms), configurado con las variables `PUBLIC_GOOGLE_*` del workflow de Pages.
