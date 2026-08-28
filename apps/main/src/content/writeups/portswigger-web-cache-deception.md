---
slug: portswigger-web-cache-deception
order: 2
platform: PortSwigger Web Security Academy
kind: Laboratorio de referencia
title: Web cache deception
level: medio
date: Semilla editorial · 2026
status: referencia externa
description: Ejemplo de reporte Markdown basado en material público de una plataforma de práctica autorizada.
tags: [web, cache, arquitectura]
sources:
  - label: "Ruta de aprendizaje de Web cache deception"
    url: https://portswigger.net/web-security/learning-paths/web-cache-deception
  - label: "Web cache deception: explicación y prevención"
    url: https://portswigger.net/web-security/web-cache-deception
  - label: "Documentación HTTP caching de MDN"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
---

## Nota de atribución

Este documento es una **semilla editorial**, no una resolución atribuida a c4cker. Resume, en lenguaje propio, cómo estructurar notas sobre los laboratorios públicos de Web Security Academy. La fuente reúne ejercicios sobre diferencias entre la caché y el origen, además de su prevención.

## Contexto

El punto de partida es una discrepancia de interpretación: el sistema de caché y la aplicación de origen no necesariamente evalúan una ruta de la misma manera. El objetivo del reporte no es coleccionar cargas útiles, sino demostrar el desalineamiento y explicar el impacto.

## Observación reproducible

Una buena bitácora registra tres cosas: qué respuesta se solicitó, qué componente la trató como almacenable y qué condición demuestra que el origen la interpretó de otro modo. En una práctica autorizada, esa evidencia se puede repetir sin tocar sistemas ajenos.

## Decisión

Antes de intentar variantes, conviene definir qué comportamiento sería relevante y qué dato debería permanecer privado. Eso evita confundir una respuesta inesperada con un impacto real.

## Mitigación

- Alinear las reglas de caché con el enrutamiento de origen.
- No almacenar respuestas personalizadas o dependientes de sesión.
- Probar las normalizaciones de rutas como parte de la revisión de despliegue.

## Fuente

La [ruta de aprendizaje Web cache deception de PortSwigger](https://portswigger.net/web-security/learning-paths/web-cache-deception) se mantiene como referencia externa. Si este texto se convierte en una resolución propia, agregá fecha, laboratorio exacto, evidencia propia y los límites del entorno.
