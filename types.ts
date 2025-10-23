export type HandwritingStyle = 'Kalam' | 'Caveat' | 'Dancing Script' | 'Permanent Marker' | 'Indie Flower' | 'Rock Salt' | 'Gochi Hand' | 'Custom';
export type WritingInstrument = 'pen' | 'pencil' | 'marker' | 'custom';
export type PaperType = 'plain' | 'lined' | 'grid' | 'parchment';

export interface StyleSettings {
  fontFamily: HandwritingStyle;
  instrument: WritingInstrument;
  color: string;
  thickness: number; // Corresponds to font-weight
  lineHeight: number; // Corresponds to line-height in rem
  pressure: number; // 0-100, intensity of pressure variations
  smudgeLevel: number; // 0-5, amount of smudging
  paper: PaperType;
  wordSpacing: number; // in rem
  letterRotation: number; // in degrees
  verticalShift: number; // in pixels
  horizontalSkew: number; // in degrees
  inkBleed: number; // 0-100, intensity of ink bleed effect
}