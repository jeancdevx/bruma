# Arquitectura

Sitio estático generado con Astro 7. Los componentes Astro producen HTML; únicamente navegación, recorrido y manifiesto ejecutan TypeScript en el navegador. Tailwind 4 se integra por Vite y comparte tokens con estilos locales de Astro. No hay React ni framework cliente adicional.

La organización sigue [Josh Comeau](https://www.joshwcomeau.com/react/file-structure/): carpetas por función, un directorio por componente público y colocación de archivos privados junto al componente propietario. Los index.ts son exports explícitos; no hay un barrel global que importe todos los componentes.

| Capa | Responsabilidad |
| --- | --- |
| pages | Composición de la landing y ruta 404 |
| layouts | Documento, idioma, metadatos, fuentes y CSS global |
| components | Renderizado, estilos locales y comportamiento propio |
| data | Identidad, navegación, escenas y textos comerciales |
| helpers | Observer de entrada compartido por carta y ambiente |
| styles | Tokens Tailwind, tipografías y reglas transversales |
| assets | Originales IA locales e iconos SVG |

Interfaces públicas mínimas: StoryScene, MenuItem y props de sección. La página recibe contenido de data/cafe.ts; los componentes no importan el contenido comercial. SceneCopy y MenuCard son privados. Las interacciones no leen un repositorio, almacenamiento ni API.

## Recorrido

El HTML original conserva tres escenas completas con sus imágenes. En escritorio y sin preferencia de movimiento reducido, el cliente crea réplicas visuales decorativas en una columna sticky, oculta las figuras originales y mantiene los textos en el flujo. La región visual tiene una descripción accesible que cambia con la escena. Se cachean posiciones al cambiar el layout; el scroll sólo agenda un requestAnimationFrame. El mismo progreso funciona hacia delante y hacia atrás.

En móvil, sin JavaScript o con movimiento reducido, el HTML original se muestra completo. La preferencia de movimiento se observa también después de cargar. El menú usa dialog nativo, cierre con Escape, límites explícitos de Tab y devolución de foco. El manifiesto revela sus cinco palabras en orden; la lectura ya realizada se conserva al volver hacia arriba.

## Imágenes y publicación futura

ResponsiveImage renderiza un img nativo con srcset y tamaños acordes con el layout. Las 21 variantes WebP (400, 800 y 1200 px) se generan por adelantado con Sharp y se sirven directamente desde public/images. No hay conversión mediante /_image al cargar o hacer scroll, tampoco en desarrollo. Los archivos contienen un hash en su nombre para evitar cachés antiguas al cambiar una imagen. Sólo la imagen inicial tiene prioridad alta; las otras dos escenas sticky se precargan con prioridad baja antes del crossfade. La carta y el ambiente mantienen carga diferida. Se cargan dos WOFF2 latinos locales.

pnpm images:optimize conserva los siete PNG originales, convierte únicamente las fuentes modificadas, actualiza src/data/image-assets.json y elimina únicamente variantes antiguas registradas por el generador. pnpm build ejecuta esta preparación antes de Astro; las variantes guardadas en el repositorio también permiten iniciar astro dev --background directamente. La imagen social JPEG se genera en el mismo paso, antes de las solicitudes. pnpm images:measure registra tiempos locales con la caché HTTP del navegador desactivada en docs/design/image-performance.json.

Esta versión es conceptual, local y noindex. La imagen social tiene una ruta local. Para una publicación posterior con datos reales, definir site en astro.config.mjs y actualizar la identidad y los datos en data/cafe.ts; el layout resolverá una URL absoluta para la imagen social. No se configuró hospedaje en esta entrega.
