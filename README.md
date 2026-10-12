# Bruma Café

Primera propuesta conceptual para una cafetería: diseño editorial cálido, dioramas originales generados con IA y un recorrido animado por scroll. Entrega local en español, sin datos de un negocio real ni servicios de pedidos o reservas.

## Desarrollo

Requisitos: Node >=22.12 y pnpm. Instalar dependencias y lanzar el servidor en background, siguiendo AGENTS.md:

```sh
pnpm install
pnpm exec astro dev --background
```

Vista local: http://localhost:4321.

```sh
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

## Validación y capturas

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test
pnpm capture
```

Las pruebas y capturas requieren un servidor iniciado. Para probar exactamente el build, ejecutar `pnpm exec astro preview --host 127.0.0.1 --port 4322` en otra terminal y usar `BRUMA_BASE_URL=http://127.0.0.1:4322 pnpm test` o `BRUMA_BASE_URL=http://127.0.0.1:4322 pnpm capture`. Las pruebas cubren scroll hacia delante y atrás, responsive, menú por teclado, reducción de movimiento, ausencia de JavaScript, 404 y accesibilidad automática con axe.

## Diseño y presentación

- [Brief, paleta, tipografía, storyboard y textos](docs/design/brief.md)
- [Tablero visual y wireframes](docs/design/board.html)
- [Lámina exportada del tablero](docs/design/design-board.png)
- [Assets, prompts exactos, tamaños y hashes](docs/design/assets.json)
- [Arquitectura y comportamiento](docs/design/architecture.md)
- [Resultados de validación](docs/design/validation.md)
- [Captura de escritorio](docs/presentation/desktop.png)
- [Captura móvil completa](docs/presentation/mobile-full.png)
- [Registro de capturas y modos utilizados](docs/presentation/captures.json)

Siete imágenes originales se guardan en `src/assets/images/`. Fueron generadas con imagegen integrado: fachada, barra y mesa en un mismo mundo isométrico; flat white, café filtrado, croissant y ambiente en fotografía editorial. Ninguna imagen representa un negocio real. Las fuentes Fraunces y Manrope se sirven localmente mediante Fontsource. Licencias de fuentes, skills e iconos en `docs/design/licenses/`.

## Imágenes y rendimiento

Las imágenes visibles son archivos WebP estáticos con versiones de 400, 800 y 1200 px. El componente ResponsiveImage selecciona el tamaño mediante srcset y sizes. No se convierten imágenes durante las solicitudes del navegador: se elimina la demora de generar AVIF bajo demanda en desarrollo. Los siete PNG originales se conservan para edición y los nombres de las variantes incorporan un hash para invalidar cachés antiguas.

```sh
pnpm images:optimize
pnpm images:measure
```

El primer comando regenera sólo las fuentes modificadas; pnpm build también lo ejecuta automáticamente. El segundo requiere la vista local iniciada y guarda las mediciones en [image-performance.json](docs/design/image-performance.json). Las siguientes escenas del recorrido se preparan con prioridad baja; las imágenes de carta y ambiente mantienen carga diferida.

## Skills utilizadas

Instaladas con skill-installer en `~/.codex/skills`, conservando AGENTS.md:

- [landing-page-design](https://github.com/elayadesign/ai-design-skills/tree/1c1e97cb9878e236552c772092dda7adcdddbcb2/skills/landing-page-design), commit `1c1e97cb9878e236552c772092dda7adcdddbcb2`.
- [scroll-world](https://github.com/oso95/scroll-world/tree/71cc36d3bb150248ae36a2c552f9cbf88802a79c/skills/scroll-world), commit `71cc36d3bb150248ae36a2c552f9cbf88802a79c`.

La adaptación aprobada utiliza prompts y narrativa de scroll-world con transiciones entre imágenes; no genera ni reproduce un vuelo continuo en video. Los overrides de identidad y alcance están documentados en el brief.

## Estructura

Astro 7, Tailwind 4, TypeScript y componentes por carpeta siguiendo los principios de colocación de Josh Comeau. `src/pages` compone; `src/layouts` define el documento; `src/components` conserva estilos y comportamiento junto a cada componente; `src/data/cafe.ts` centraliza marca y textos; `src/styles` define tokens. Subcomponentes privados permanecen dentro del propietario. No se añade React.

Para adaptar el concepto a una cafetería real, editar `src/data/cafe.ts` y sustituir los assets. Antes de publicar, configurar `site` en Astro, revisar los datos reales y cambiar deliberadamente el `noindex`. Esta entrega no tiene publicación ni seguimiento analítico.
