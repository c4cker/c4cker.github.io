#!/bin/sh
set -eu

# Certbot ejecuta este hook solo después de renovar un certificado.
# Apache termina TLS para c4cker y debe recargarse para tomar el nuevo archivo.
systemctl reload apache2
