
export type LayoutType = 'vertical-cards' | 'horizontal-steps' | 'radial-process' | 'timeline-flow' | 'circular-progress' | 'multi-column';

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface InfographicData {
  title: string;
  subtitle?: string;
  steps: Step[];
}

export interface BrandConfig {
  primary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface StyleOptions {
  accentColor: string;
  backgroundColor: string;
  cornerStyle: 'sharp' | 'soft' | 'extra-soft';
  borderVariant: 'solid' | 'dashed' | 'none';
}
