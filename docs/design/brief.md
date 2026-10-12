# Bruma Café · dirección de diseño

Fecha: 12 de octubre de 2026. Entrega: demo conceptual local en español.

## Intención

Una primera propuesta para presentar una cafetería de especialidad: cálida, tranquila y con personalidad. El visitante descubre el lugar, el ritual y la carta. La acción principal es «Explorar Bruma», que avanza a la barra. El público de esta presentación es el cliente y los futuros visitantes que valoran el café y el ambiente.

## Dirección visual

Editorial cálida con un pequeño mundo arquitectónico. Composición asimétrica, mucho aire, titulares serif, fotografía tangible y dioramas de cerámica mate. El hero abre con una fachada; el recorrido entra a la barra y termina en la mesa. Madera de nogal, arcos, cerámica crema, azulejo terracota y plantas salvia conectan todas las imágenes.

| Token | Valor | Uso |
| --- | --- | --- |
| cream | #F3ECE0 | Fondo principal |
| espresso | #2B1B14 | Texto y títulos |
| terracotta | #A64B35 | Acción y acentos |
| sage | #6A7559 | Decoración |
| paper | #FFF9F0 | Superficies secundarias |

Contrastes calculados: espresso/cream 14.09:1; cream/terracotta 4.86:1; espresso/paper 15.80:1. Sage/cream 4.16:1 se reserva a decoración, no texto pequeño.

Fuentes: Fraunces variable, peso 400–500 para titulares; Manrope variable, peso 400–600 para cuerpo y navegación. Subconjunto latino servido localmente. Titular 36/40 px en móvil y 72/72 px en escritorio; secciones 36/40 y 48/48 px; texto 16/24 y 18/28 px. Sin cursivas. Ancho máximo 1280 px; gutters 24/48 px; ritmo de espacios 8, 12, 16, 24, 32, 48, 64, 80, 96 px. Superficies planas y radios de 8–16 px. Curva de movimiento cubic-bezier(0.32, 0.72, 0, 1).

## Outline y textos definitivos

1. Navegación: Nuestro mundo · La carta · El espacio.
2. Hero: «Un café. Un momento para ti.» Subtítulo: «Un pequeño refugio donde el café se prepara con calma y cada pausa sabe un poco mejor.» CTA: «Explorar Bruma». Descriptor: «Café de especialidad · pequeños rituales».
3. Barra: «Todo empieza con un buen café.» Cuerpo: «Moler, preparar, servir. Un ritual sencillo al que le ponemos toda nuestra atención.»
4. Mesa: «Tu mesa. Tu momento.» Cuerpo: «Una taza caliente, algo recién horneado y un rincón para bajar el ritmo.»
5. Carta: «Pequeños placeres, bien hechos.» Introducción: «Lo de siempre, preparado con cariño. Encuentra tu próximo favorito.»
   - Flat white: «Espresso y leche sedosa. Un equilibrio suave para cualquier momento.»
   - Café filtrado: «Una taza limpia y delicada para descubrir el café, sorbo a sorbo.»
   - Croissant: «Capas de mantequilla, un exterior dorado y el compañero perfecto de tu taza.»
6. Manifiesto: «Buen café. Tiempo para disfrutarlo.» Apoyo: «A veces, lo que necesitas es una buena pausa.»
7. Ambiente: «Quédate un poco más.» Cuerpo: «Luz cálida, madera y conversaciones que no miran el reloj. Un espacio pensado para estar a gusto.»
8. Cierre: «Nos vemos en tu próxima pausa.» CTA: «Volver al inicio». Footer: «Bruma Café · Concepto visual para presentación».

Beneficios narrativos: descubrir el ritual del café, encontrar un favorito, imaginar una pausa en un ambiente tranquilo. No son afirmaciones verificadas sobre un negocio real. No se incluyen testimonios, cifras, precios, direcciones ni horarios.

Layout: hero editorial integrado en una historia de tres escenas, seguido de secciones breves. No hay FAQ comercial, formularios, garantías ni prueba social: el alcance acordado es una presentación visual. Metadatos noindex, nofollow; no se publica ni se añade schema de un negocio real.

## Storyboard e interacción

| Escena | Imagen | Texto | Acción |
| --- | --- | --- | --- |
| 01 · Fachada | Fachada con arcos, toldo y terraza | Hero | Explorar Bruma → #barra |
| 02 · Barra | Máquina espresso, molino y cerámica | Ritual de preparación | Continuar al hacer scroll |
| 03 · Mesa | Café y croissant junto a una ventana | Pausa personal | Descubrir la carta → #carta |

Desde 1024 px: imágenes en una columna sticky; textos en tres tramos. La opacidad y una transformación leve acompañan el scroll en ambos sentidos. No hay scroll hijacking, vuelo continuo real ni video. Bajo 1024 px: imágenes completas junto a cada texto, sin sticky. Movimiento reducido y ausencia de JavaScript: lectura estática completa.

## Skills y adaptaciones autorizadas

- landing-page-design: https://github.com/elayadesign/ai-design-skills/tree/1c1e97cb9878e236552c772092dda7adcdddbcb2/skills/landing-page-design · MIT.
- scroll-world: https://github.com/oso95/scroll-world/tree/71cc36d3bb150248ae36a2c552f9cbf88802a79c/skills/scroll-world · MIT.
- Instaladas en ~/.codex/skills con el instalador oficial de Codex; AGENTS.md se conserva.
- El brief aprobado prevalece sobre defaults de las skills: dos familias, tinta espresso plana, navegación editorial, contenido conceptual y narrativa con imágenes en lugar del pipeline de video. Se reutilizan preámbulo de estilo, secuenciación, progresión por scroll, protección móvil y reducción de movimiento de scroll-world; no se presenta como su vuelo cinematográfico.
- imagegen integrado: generación raster de las siete imágenes. Prompts exactos y procedencia en assets.json. Recursos gráficos simples, wordmark y wireframes son SVG/HTML nativos.

## Criterios de entrega

Diseño y assets completos antes de los componentes. Sitio estático Astro 7, Tailwind 4, TypeScript estricto. Componentes por carpeta con archivos privados colocados junto al propietario, contenido separado y props tipadas. Navegación por teclado, Escape y devolución de foco. Imágenes locales responsive; sin servicios externos en runtime. QA en 320, 390, 768 y 1440 px; scroll inverso, movimiento reducido y JavaScript desactivado; capturas de escritorio y móvil.
