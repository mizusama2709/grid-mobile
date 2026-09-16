export const colors = {
  bg: '#08080A',
  bgTop: '#16161C',
  surface: 'rgba(255,255,255,0.045)',
  surfaceStrong: 'rgba(255,255,255,0.07)',
  surfaceInput: 'rgba(255,255,255,0.055)',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.09)',
  textPrimary: '#F4F4F6',
  textSecondary: '#86868F',
  textTertiary: '#8A8A94',
  textMuted: '#4E4E58',
  chipText: '#A0A0A9',
  chipTextAlt: '#C9C9D1',
  teal: '#6EE7E0',
  tealLight: '#A6F4EE',
  blue: '#5B8DEF',
  blueLight: '#7FD4F5',
  purple: '#B06EF0',
  orange: '#E0764F',
  gold: '#E0B071',
  onAccent: '#06201F',
  navBg: 'rgba(255,255,255,0.06)',
  navActivePill: 'rgba(255,255,255,0.14)',
  sheetBg: 'rgba(14,14,18,0.82)',
} as const;

export const gradients = {
  brand: ['#6EE7E0', '#5B8DEF', '#B06EF0'] as const,
  accentButton: ['#6EE7E0', '#7FD4F5'] as const,
  avatar: ['#6EE7E0', '#5B8DEF', '#B06EF0'] as const,
  google: ['#EA4335', '#FBBC05', '#34A853', '#4285F4'] as const,
  listing: [
    ['#C4805F', '#7E3D58', '#22162B'],
    ['#5E9CBC', '#3A5B96', '#151A33'],
    ['#C79A5A', '#9A4C48', '#2A1524'],
    ['#6FBDB6', '#2F7288', '#12202E'],
    ['#907ABE', '#4E3C8C', '#170F2B'],
    ['#6FA887', '#2C6A5E', '#101F22'],
    ['#BE8DA1', '#8A4770', '#231327'],
    ['#C4834F', '#8C3F44', '#22131E'],
  ] as const,
} as const;

export const gradientAt = (i: number) => gradients.listing[((i % gradients.listing.length) + gradients.listing.length) % gradients.listing.length];

export const statusTint: Record<string, { bg: string; fg: string }> = {
  Upcoming: { bg: 'rgba(110,231,224,0.13)', fg: colors.teal },
  Pending: { bg: 'rgba(255,201,120,0.14)', fg: colors.gold },
  Past: { bg: 'rgba(255,255,255,0.08)', fg: '#A0A0A9' },
  Cancelled: { bg: 'rgba(255,138,91,0.14)', fg: colors.orange },
};

export const fonts = {
  regular: 'InstrumentSans_400Regular',
  medium: 'InstrumentSans_500Medium',
  semiBold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
} as const;
