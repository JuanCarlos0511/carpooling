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
  background: '#F4F4F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',
  inputBackground: '#F4F4F5',
  textPrimary: '#18181B',
  textSecondary: '#71717A',
  textMuted: '#A1A1AA',
  border: '#E4E4E7',
  borderStrong: '#A1A1AA',
  primary: '#000000',
  primaryForeground: '#FFFFFF',
  overlay: 'rgba(24, 24, 27, 0.05)',
  pattern: 'rgba(24, 24, 27, 0.05)',
} as const;

const darkColors = {
  ...sharedColors,
  background: '#0F0F12',
  surface: '#16161D',
  surfaceElevated: '#1D1D25',
  inputBackground: '#0F0F12',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  border: '#262631',
  borderStrong: '#52525B',
  primary: '#FFFFFF',
  primaryForeground: '#18181B',
  overlay: 'rgba(255, 255, 255, 0.06)',
  pattern: 'rgba(255, 255, 255, 0.08)',
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
  spacing,
  borderRadius,
  typography,
  metrics,
} as const;

export const darkTheme = {
  dark: true,
  colors: darkColors,
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
  primarySoft: '#DCEFE7',
} as const;
