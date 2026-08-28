---
title: Desafíos
---
<article class="page"><p class="eyebrow">Práctica local</p><h1>Desafíos</h1><p>Descargá y ejecutá los retos exclusivamente en tu propia máquina o entorno aislado. Cada solución se registra con un identificador anónimo derivado en el servidor.</p><div class="grid">{% for item in site.challenges %}<a class="card" href="{{ item.url | relative_url }}"><span class="meta">{{ item.category }} · {{ item.difficulty }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p></a>{% endfor %}</div></article>
