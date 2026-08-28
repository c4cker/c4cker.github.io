---
title: Proyectos
---
<article class="page"><p class="eyebrow">Código abierto</p><h1>Proyectos</h1><div class="grid">{% for item in site.projects %}<a class="card" href="{{ item.repository | default: item.url | relative_url }}"><span class="meta">{{ item.status | default: 'en progreso' }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p></a>{% endfor %}</div></article>
