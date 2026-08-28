---
title: Writeups
---
<article class="page"><p class="eyebrow">Resoluciones</p><h1>Writeups</h1><p>Documentación orientada al aprendizaje. Sin publicar secretos, accesos ni técnicas aplicadas a objetivos fuera de un entorno autorizado.</p><div class="grid">{% for item in site.writeups %}<a class="card" href="{{ item.url | relative_url }}"><span class="meta">{{ item.level | default: 'investigación' }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p></a>{% endfor %}</div></article>
