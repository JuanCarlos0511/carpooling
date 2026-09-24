import { useColorScheme } from 'react-native';

const sharedColors = {
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

const lightColors = {
  ...sharedColors,
  background: '#F3F8F7',
  surface: '#FFFFFF',
  surfaceElevated: '#EAF4F2',
  inputBackground: '#F0F6F5',
  textPrimary: '#102321',
  textSecondary: '#4F6662',
  textMuted: '#718580',
  border: '#D5E5E2',
  borderStrong: '#8AA9A3',
  primary: '#14B8A6',
  primaryForeground: '#102321',
  accent: '#14B8A6',
  accentSecondary: '#0EA5E9',
  accentStrong: '#087F75',
  accentSoft: 'rgba(20, 184, 166, 0.10)',
  focus: '#087F75',
  overlay: 'rgba(20, 184, 166, 0.08)',
  pattern: 'rgba(20, 184, 166, 0.08)',
  dangerSurface: 'rgba(239, 68, 68, 0.08)',
  disabledBackground: '#D9ECE8',
  disabledForeground: '#50716B',
} as const;

const darkColors = {
  ...sharedColors,
  background: '#101114',
  surface: '#181A1D',
  surfaceElevated: '#202328',
  inputBackground: '#131518',
  textPrimary: '#F7F7F8',
  textSecondary: '#B8BBC1',
  textMuted: '#858991',
  border: '#2A2D33',
  borderStrong: '#555A64',
  primary: '#703297',
  primaryForeground: '#FFFFFF',
  accent: '#FFA263',
  accentSecondary: '#703297',
  accentStrong: '#FFA263',
  accentSoft: 'rgba(255, 162, 99, 0.12)',
  focus: '#FFA263',
  overlay: 'rgba(255, 162, 99, 0.08)',
  pattern: 'rgba(112, 50, 151, 0.10)',
  dangerSurface: 'rgba(239, 68, 68, 0.12)',
  disabledBackground: '#2A2D33',
  disabledForeground: '#9B9FA7',
} as const;

const lightGradients = {
  primary: { start: '#3BCBB9', end: '#40B9ED', overlay: 'transparent' },
} as const;

const darkGradients = {
  primary: { start: '#FFA263', end: '#703297', overlay: 'rgba(12, 8, 16, 0.44)' },
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = { sm: 6, md: 10, lg: 16, full: 9999 } as const;

export const typography = {
  size: { caption: 10, label: 11, bodySmall: 13, body: 15, subtitle: 17, title: 28 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  letterSpacing: { normal: 0, label: 0.8, badge: 1.6 },
} as const;

const metrics = {
  controlHeight: 52,
  iconSize: 18,
  logoSize: 52,
  contentMaxWidth: 440,
  borderWidth: 1,
  strengthHeight: 3,
} as const;

export const lightTheme = {
  dark: false,
  colors: lightColors,
  gradients: lightGradients,
  spacing,
  borderRadius,
  typography,
  metrics,
} as const;

export const darkTheme = {
  dark: true,
  colors: darkColors,
  gradients: darkGradients,
  spacing,
  borderRadius,
  typography,
  metrics,
} as const;

export type AppTheme = typeof lightTheme | typeof darkTheme;

export function useAppTheme(): AppTheme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}

// Alias temporal para las pantallas existentes que todavía consumen la paleta estática.
export const colors = {
  ...lightColors,
  text: lightColors.textPrimary,
  muted: lightColors.textSecondary,
  primarySoft: lightColors.accentSoft,
} as const;
