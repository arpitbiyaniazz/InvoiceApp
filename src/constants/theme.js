// Invoice App — Design System Tokens

export const COLORS = {
  // Backgrounds
  bg: '#0F0F1A',
  bgSecondary: '#161625',
  card: '#1A1A2E',
  cardHover: '#222240',
  surface: '#252542',

  // Accent
  primary: '#6C63FF',
  primaryLight: '#8B83FF',
  primaryDark: '#5A52E0',
  primaryGlow: 'rgba(108, 99, 255, 0.15)',

  // Status
  success: '#00D4AA',
  successLight: 'rgba(0, 212, 170, 0.15)',
  danger: '#FF6584',
  dangerLight: 'rgba(255, 101, 132, 0.15)',
  warning: '#FFB347',
  warningLight: 'rgba(255, 179, 71, 0.15)',
  info: '#4FC3F7',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textTertiary: '#6B6B80',
  textInverse: '#0F0F1A',

  // Borders
  border: '#2A2A45',
  borderLight: '#353555',
  borderFocus: '#6C63FF',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const ITEM_TYPES = [
  { label: 'Product', value: 'product' },
  { label: 'Service', value: 'service' },
];

export const UNITS = [
  { label: 'Pieces', value: 'Pcs' },
  { label: 'Pairs', value: 'Prs' },
  { label: 'Nos', value: 'Nos' },
  { label: 'Hours', value: 'Hrs' },
  { label: 'Kg', value: 'Kg' },
  { label: 'Liters', value: 'Ltr' },
  { label: 'Meters', value: 'Mtr' },
  { label: 'Bottle', value: 'Btl' },
  { label: 'Box', value: 'Box' },
  { label: 'Pack', value: 'Pack' },
  { label: 'Set', value: 'Set' },
  { label: 'Roll', value: 'Roll' },
];
