---
title: Hola, contenedor
category: web
difficulty: inicial
description: Plantilla de reto local para probar el circuito de descarga y flag.
download_url: "#"
---
<article class="page"><p class="eyebrow">{{ page.category }} · {{ page.difficulty }}</p><h1>{{ page.title }}</h1><p>{{ page.description }}</p><p class="notice">La descarga se añadirá al publicar el reto. No incluyas flags ni credenciales reales dentro de imágenes o HTML descargables.</p><h2>Enviar flag</h2><form class="challenge-form" data-flag-form data-challenge="{{ page.slug }}"><label for="flag">Flag obtenida</label><input id="flag" name="flag" autocomplete="off" placeholder="C4CKER{...}" maxlength="512" required><button class="button" type="submit">Validar flag</button><output class="form-status" aria-live="polite"></output></form></article>
