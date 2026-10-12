import type { ImageMetadata } from 'astro';

export interface MenuItem {
  name: string;
  category: string;
  description: string;
  image: ImageMetadata;
  alt: string;
}
