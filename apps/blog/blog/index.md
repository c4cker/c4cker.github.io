---
title: Blog
---
<article class="page"><p class="eyebrow">Notas de campo</p><h1>Blog</h1>{% if site.posts.size > 0 %}{% for post in site.posts %}<a class="card" href="{{ post.url | relative_url }}"><span class="meta">{{ post.date | date: '%d.%m.%Y' }}</span><h3>{{ post.title }}</h3><p>{{ post.excerpt | strip_html | truncate: 160 }}</p></a>{% endfor %}{% else %}<p class="notice">Todavía no hay artículos. Creá un Markdown en <code>_posts/AAAA-MM-DD-titulo.md</code>.</p>{% endif %}</article>
