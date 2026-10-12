# Validación de entrega

12 de octubre de 2026. Verificación sobre el build estático servido localmente en 127.0.0.1:4322.

| Comprobación | Resultado |
| --- | --- |
| pnpm check | 33 archivos; 0 errores, 0 advertencias, 0 hints |
| pnpm build | Correcto; landing y 404 generadas |
| Playwright Chromium | 14 pruebas correctas en la ejecución final |
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

## Assets de producción

63 variantes de imagen: 21 AVIF, 21 WebP y 21 JPEG. Dos fuentes WOFF2 latinas, aproximadamente 61 KB en total. Los PNG originales no se sirven desde dist. El JavaScript cliente combina módulos pequeños e instrucciones inline; no se carga React ni otro runtime de UI. No hubo solicitudes a servicios externos en la prueba de navegación principal.

La lámina de diseño está en design-board.png. Las capturas de presentación están en ../presentation/ y se regeneran con pnpm capture. Las escenas individuales de escritorio muestran la experiencia con movimiento normal; desktop-full.png utiliza movimiento reducido para presentar los tres dioramas en una imagen estática completa. Las capturas móviles mantienen el modo normal.

Esta validación usa Chromium y tamaños de pantalla emulados. No incluye pruebas en un dispositivo iOS real ni una auditoría manual completa con lector de pantalla. La entrega permanece local, conceptual y noindex.
