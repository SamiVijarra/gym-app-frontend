export const colors = {
    bg: 'var(--app-bg)',
    surface: 'var(--app-surface)',
    surface2: 'var(--app-surface-2)',
    surfaceHover: 'var(--app-surface-hover)',
    text: 'var(--app-text)',
    textSecondary: 'var(--app-text-secondary)',
    textMuted: 'var(--app-text-muted)',
    primary: 'var(--app-primary)',
    primaryLight: 'var(--app-primary-light)',
    primarySoft: 'var(--app-primary-soft)',
    onPrimary: 'var(--app-on-primary)',
    secondary: 'var(--app-secondary)',
    secondaryHover: 'var(--app-secondary-hover)',
    secondaryText: 'var(--app-secondary-text)',
    accent: 'var(--app-accent)',
    accentLight: 'var(--app-accent-light)',
    onAccent: 'var(--app-on-accent)',
    success: 'var(--app-success)',
    danger: 'var(--app-danger)',
    warning: 'var(--app-warning)',
    onWarning: 'var(--app-on-warning)',
    border: 'var(--app-border)',
    borderStrong: 'var(--app-border-strong)',
} as const;

export const radius = {
    sm: 'var(--app-radius-sm)',
    md: 'var(--app-radius-md)',
    lg: 'var(--app-radius-lg)',
    xl: 'var(--app-radius-xl)',
    full: 'var(--app-radius-full)',
} as const;

export const spacing = {
    1: 'var(--app-space-1)',
    2: 'var(--app-space-2)',
    3: 'var(--app-space-3)',
    4: 'var(--app-space-4)',
    5: 'var(--app-space-5)',
    6: 'var(--app-space-6)',
    7: 'var(--app-space-7)',
    8: 'var(--app-space-8)',
} as const;

export const breakpoints = {
    sm: 480,
    md: 640,
    lg: 768,
    xl: 1024,
} as const;

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radius;
export type SpacingToken = keyof typeof spacing;
export type Breakpoint = keyof typeof breakpoints;
