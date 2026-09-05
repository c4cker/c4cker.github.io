param(
  [string]$HostName = "root@100.90.198.42"
)

$ErrorActionPreference = "Stop"

ssh -o BatchMode=yes $HostName @'
set -e
cd /opt/c4cker
git pull --ff-only origin main
npm ci --no-audit --no-fund
npm run build:main
npm run build:labs
cd apps/blog
bundle install
bundle exec jekyll build --destination _site
cd /opt/c4cker
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
systemctl is-active caddy
'@

Write-Host "Hetzner actualizado desde /opt/c4cker y Caddy recargado."
