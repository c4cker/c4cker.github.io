param(
  [string]$HostName = "root@100.90.198.42",
  [string]$Release = (Get-Date -Format "yyyyMMddHHmmss")
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

npm.cmd run build:main
npm.cmd run build:labs
Push-Location apps/blog
bundle exec jekyll build --destination _site
Pop-Location

$remoteRelease = "/srv/c4cker/releases/$Release"
ssh $HostName "mkdir -p '$remoteRelease/main' '$remoteRelease/labs' '$remoteRelease/blog'"
scp -r dist/main/. "${HostName}:$remoteRelease/main/"
scp -r dist/labs/. "${HostName}:$remoteRelease/labs/"
scp -r apps/blog/_site/. "${HostName}:$remoteRelease/blog/"
scp deploy/Caddyfile "${HostName}:/etc/caddy/Caddyfile"
ssh $HostName "chmod -R a+rX '$remoteRelease' && ln -sfn '$remoteRelease' /srv/c4cker/current && caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy && systemctl is-active caddy"
Write-Host "Artefactos publicados y Caddy recargado desde $remoteRelease."
