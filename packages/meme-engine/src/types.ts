export interface MemeTemplate {
  id: string;
  token: string;
  name: string;
  baseSvg: string;
  layers: MemeLayer[];
  styleHints: string[];
}

export interface MemeLayer {
  type: 'text' | 'image' | 'shape';
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style?: Record<string, string>;
}

export interface MemeInstance {
  id: string;
  templateId: string;
  token: string;
  caption: string;
  style: MemeStyle;
  svgOutput?: string;
  pngUrl?: string;
  createdAt: string;
  metadata?: NftMetadata;
}

export type MemeStyle = 'neoGlow' | 'flash' | 'glitch';

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface RenderOptions {
  templateId: string;
  caption: string;
  style: MemeStyle;
}
