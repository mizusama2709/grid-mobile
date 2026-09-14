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
  orange: '#FF8A5B',
  gold: '#FFC978',
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
    ['#F2A07B', '#B3577F', '#4A2E63'],
    ['#7FD4F5', '#5B8DEF', '#2B2F72'],
    ['#FFC978', '#E0736B', '#5C2A4A'],
    ['#A6F4EE', '#4FA9C7', '#1F3A54'],
    ['#C7A6F4', '#7B5BEF', '#2A1C4F'],
    ['#9BE8B5', '#3F9E8C', '#1C3B3E'],
    ['#F4C7D8', '#C06A9B', '#3E2044'],
    ['#FFB27A', '#C4595B', '#3A1F33'],
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
