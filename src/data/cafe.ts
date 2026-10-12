import { images } from './images';
const { facade, bar, table, flatWhite, filter, croissant, interior } = images;
import type { StoryScene } from '@/components/ScrollStory/ScrollStory.types';
import type { MenuItem } from '@/components/Menu/Menu.types';

export const brand = {
  name: 'Bruma Café',
  wordmark: 'bruma',
  title: 'Bruma Café · Un momento para ti',
  description: 'Un pequeño refugio donde el café se prepara con calma y cada pausa sabe un poco mejor. Descubre el mundo de Bruma Café.',
  descriptor: 'Café de especialidad',
};

export const navigation = [
  { label: 'Nuestro mundo', href: '#recorrido' },
  { label: 'La carta', href: '#carta' },
  { label: 'El espacio', href: '#ambiente' },
] as const;

export const scenes = [
  {
    id: 'llegar', number: '01', label: 'Llegar',
    eyebrow: 'Café de especialidad · pequeños rituales',
    title: 'Un café. Un momento para ti.',
    lines: ['Un café.', 'Un momento', 'para ti.'],
    body: 'Un pequeño refugio donde el café se prepara con calma y cada pausa sabe un poco mejor.',
    image: facade,
    alt: 'Diorama de una cafetería con fachada crema, toldo terracota y una pequeña terraza.',
    detail: 'Tu pausa empieza aquí.',
    action: { label: 'Explorar Bruma', href: '#barra' },
  },
  {
    id: 'barra', number: '02', label: 'Preparar',
    eyebrow: 'El ritual', title: 'Todo empieza con un buen café.',
    lines: ['Todo empieza', 'con un buen café.'],
    body: 'Moler, preparar, servir. Un ritual sencillo al que le ponemos toda nuestra atención.',
    image: bar,
    alt: 'Diorama de una barra de café con máquina espresso, molino y vajilla de cerámica.',
    detail: 'Preparado con calma.',
  },
  {
    id: 'mesa', number: '03', label: 'Disfrutar',
    eyebrow: 'La mejor parte', title: 'Tu mesa. Tu momento.',
    lines: ['Tu mesa.', 'Tu momento.'],
    body: 'Una taza caliente, algo recién horneado y un rincón para bajar el ritmo.',
    image: table,
    alt: 'Diorama de una mesa de madera junto a una ventana, con una taza de café y un croissant.',
    detail: 'Sin prisa. A tu manera.',
    action: { label: 'Descubrir la carta', href: '#carta' },
  },
] satisfies readonly StoryScene[];

export const menu = {
  eyebrow: 'La carta',
  title: 'Pequeños placeres, bien hechos.',
  body: 'Lo de siempre, preparado con cariño. Encuentra tu próximo favorito.',
  items: [
    { name: 'Flat white', category: 'Suave y cremoso', description: 'Espresso y leche sedosa. Un equilibrio suave para cualquier momento.', image: flatWhite, alt: 'Flat white en taza de cerámica crema con un corazón de latte art.' },
    { name: 'Café filtrado', category: 'Puro y delicado', description: 'Una taza limpia y delicada para descubrir el café, sorbo a sorbo.', image: filter, alt: 'Café filtrado servido en una jarra de vidrio junto a una taza de cerámica.' },
    { name: 'Croissant', category: 'Recién horneado', description: 'Capas de mantequilla, un exterior dorado y el compañero perfecto de tu taza.', image: croissant, alt: 'Croissant de mantequilla sobre un plato de cerámica y una servilleta terracota.' },
  ] satisfies readonly MenuItem[],
};

export const manifesto = {
  lines: ['Buen café.', 'Tiempo para disfrutarlo.'],
  body: 'A veces, lo que necesitas es una buena pausa.',
};

export const atmosphere = {
  eyebrow: 'El espacio',
  title: 'Quédate un poco más.',
  body: 'Luz cálida, madera y conversaciones que no miran el reloj. Un espacio pensado para estar a gusto.',
  detail: 'Un rincón para bajar el ritmo.',
  image: interior,
  alt: 'Interior conceptual de una cafetería con mesas de madera, ventanas arqueadas y luz cálida.',
};

export const closing = {
  title: 'Nos vemos en tu próxima pausa.',
  action: 'Volver al inicio',
  note: 'Concepto visual para presentación',
};
