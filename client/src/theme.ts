export const colors = {
  primary: '#007AFF',
  primaryDark: '#0062CC',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#1C1C1E',
  textSecondary: '#77777A',
  border: '#E5E5EA',
  white: '#FFFFFF',
  cameraOverlay: 'rgba(28, 28, 30, 0.88)',
  success: '#34C759',
  warning: '#FF9500',
  left: '#007AFF',
  right: '#FF9500',
  ahead: '#34C759',
}

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
}

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  button: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
}
