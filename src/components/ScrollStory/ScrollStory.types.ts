import type { ImageMetadata } from 'astro';

export interface StoryScene {
  id: string;
  number: string;
  label: string;
  eyebrow: string;
  title: string;
  lines: readonly string[];
  body: string;
  image: ImageMetadata;
  alt: string;
  detail: string;
  action?: { label: string; href: string };
}
