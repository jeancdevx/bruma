# Validación de entrega

12 de octubre de 2026. Validación inicial del build estático y actualización de rendimiento verificada también en el servidor de desarrollo.

| Comprobación | Resultado |
| --- | --- |
| pnpm check | 0 errores, 0 advertencias, 0 hints |
| pnpm build | Correcto; landing y 404 generadas |
| Playwright Chromium | 17 pruebas correctas: 14 de la landing y 3 de imágenes |
| Regresión de imágenes en producción | 3 pruebas correctas sobre el build estático |
| axe WCAG A/AA y 2.1 AA | Sin violaciones detectadas en página escritorio, móvil y menú abierto, usando movimiento reducido |
| Capturas | 6 PNG y registro de sus modos; revisadas visualmente |
| Manifiesto de assets | Hashes SHA-256 verificados para las 7 imágenes |
| AGENTS.md / CLAUDE.md | Sin modificaciones |

## Escenarios probados

- Idioma español, fuentes locales, noindex y CTA hacia la barra.
- Recorrido hacia delante y atrás, descripción accesible de escena y cambio entre escritorio y móvil.
- Anchos 320, 390, 768 y 1440 px; imágenes completas y ausencia de desbordamiento horizontal.
- Menú con Enter, Shift+Tab, Escape, navegación interna, devolución de foco y cierre al pasar a escritorio.
- Movimiento reducido inicial y cambio de preferencia después de cargar.
- Todas las escenas y navegación disponibles sin JavaScript.
- Salto al contenido por teclado y revelado de las cinco palabras del manifiesto.
- Página 404 con respuesta 404 y retorno a la landing.
- Imágenes WebP estáticas sin solicitudes a /_image, con caché HTTP desactivada, en escritorio y móvil.
- Selección de variantes de 400 y 800 px para el hero según viewport y precarga de las siguientes escenas.

## Assets de producción

21 variantes WebP estáticas (400, 800 y 1200 px) que suman 1308 KiB, más un JPEG para la imagen social. Dos fuentes WOFF2 latinas, aproximadamente 61 KB en total. Los siete PNG originales se conservan como fuentes y no se sirven desde dist. El JavaScript cliente combina módulos pequeños e instrucciones inline; no se carga React ni otro runtime de UI. No hubo solicitudes a servicios externos en la prueba de navegación principal.

## Medición de la corrección de rendimiento

La conversión PNG → AVIF bajo demanda en desarrollo tardaba entre 4295 y 10554 ms por petición, casi todo antes del primer byte. Ahora las imágenes se preparan con Sharp antes de servir la página y se descargan como archivos estáticos. No se depende de una caché de transformaciones para que la primera visita sea rápida.

| Medición local | Antes | Después |
| --- | --- | --- |
| Media por petición de imagen, escritorio | 7094 ms | 11 ms |
| Hero descargado y decodificado, escritorio | 4932 ms | 191 ms |
| Media por petición de imagen, móvil | — | 8 ms |
| Hero descargado y decodificado, móvil | — | 154 ms |

Datos exactos en image-performance.json. Mediciones con Chromium y caché HTTP del navegador desactivada, en una conexión local sin limitación de red; no equivalen a tiempos garantizados en una red móvil real. Se regeneran con pnpm images:measure mientras la vista local está activa.

La lámina de diseño está en design-board.png. Las capturas de presentación están en ../presentation/ y se regeneran con pnpm capture. Las escenas individuales de escritorio muestran la experiencia con movimiento normal; desktop-full.png utiliza movimiento reducido para presentar los tres dioramas en una imagen estática completa. Las capturas móviles mantienen el modo normal.

Esta validación usa Chromium y tamaños de pantalla emulados. No incluye pruebas en un dispositivo iOS real ni una auditoría manual completa con lector de pantalla. La entrega permanece local, conceptual y noindex.
