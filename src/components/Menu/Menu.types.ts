import type { ResponsiveImageAsset } from '@/components/ResponsiveImage';

export interface MenuItem {
  name: string;
  category: string;
  description: string;
  image: ResponsiveImageAsset;
  alt: string;
}
