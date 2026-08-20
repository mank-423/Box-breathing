export const Colors = {
  primary: '#4A90D9',
  secondary: '#6C5CE7',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  white: '#FFFFFF',
  black: '#000000',
  gray: 'rgba(255,255,255,0.5)',
  grayLight: 'rgba(255,255,255,0.1)',
  grayDark: 'rgba(0,0,0,0.8)',
};

export const Fonts = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.gray,
  },
  timer: {
    fontSize: 72,
    fontWeight: '200' as const,
    color: Colors.white,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '200' as const,
    color: Colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.gray,
  },
  cycle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.gray,
  },
  message: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.gray,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  circle: 999,
};