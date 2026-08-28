---
title: Laboratorios
---
<article class="page"><p class="eyebrow">Entornos aislados</p><h1>Laboratorios</h1><p>Espacios prácticos vinculados a los artículos. Revisá siempre el repositorio y ejecutalos sin privilegios, en una máquina que controles.</p><div class="grid">{% for item in site.labs %}<a class="card" href="{{ item.url | relative_url }}"><span class="meta">{{ item.runtime | default: 'local' }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p></a>{% endfor %}</div></article>
