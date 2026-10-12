import metadata from './image-assets.json';
import type { ResponsiveImageAsset } from '@/components/ResponsiveImage';

function responsive(image: typeof metadata.images.facade): ResponsiveImageAsset {
  const largest = image.variants[image.variants.length - 1]!;
  const fallback = image.variants[Math.min(1, image.variants.length - 1)]!;
  return {
    src: fallback.url,
    srcSet: image.variants.map(variant => `${variant.url} ${variant.width}w`).join(', '),
    width: largest.width,
    height: largest.height,
  };
}

export const images = {
  facade: responsive(metadata.images.facade),
  bar: responsive(metadata.images.bar),
  table: responsive(metadata.images.table),
  flatWhite: responsive(metadata.images['flat-white']),
  filter: responsive(metadata.images.filter),
  croissant: responsive(metadata.images.croissant),
  interior: responsive(metadata.images.interior),
};

export const socialImage = metadata.social.url;
