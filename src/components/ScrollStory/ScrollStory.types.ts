import type { ResponsiveImageAsset } from '@/components/ResponsiveImage';

export interface StoryScene {
  id: string;
  number: string;
  label: string;
  eyebrow: string;
  title: string;
  lines: readonly string[];
  body: string;
  image: ResponsiveImageAsset;
  alt: string;
  detail: string;
  action?: { label: string; href: string };
}
