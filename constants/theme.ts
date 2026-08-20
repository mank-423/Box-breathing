import { TextStyle } from "react-native";

export const Colors = {
  primary: '#6C5CE7',
  secondary: '#A29BFE',
  accent: '#FD79A8',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  white: '#FFFFFF',
  black: '#000000',
  gray: 'rgba(255,255,255,0.6)',
  grayLight: 'rgba(255,255,255,0.1)',
  grayDark: 'rgba(0,0,0,0.8)',
  background: '#0A0A0A',
  cardBg: 'rgba(255,255,255,0.05)',
};

export const Fonts: Record<string, TextStyle> = {
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.gray,
    lineHeight: 24,
  },
  timer: {
    fontSize: 72,
    fontWeight: '200',
    color: Colors.white,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  countdown: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cycle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  circle: 999,
};