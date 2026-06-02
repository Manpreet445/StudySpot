/**
 * StudySpot Design System
 *
 * Single source of truth for all visual tokens used across native and web.
 * Every screen imports from here — no hardcoded color strings in components.
 */

export const colors = {
  // Surfaces
  background: '#0e0e0e',
  surface: '#1a1919',
  surfaceElevated: '#262626',

  // Text hierarchy
  textPrimary: '#ffffff',
  textSecondary: '#adaaaa',
  textMuted: '#555555',

  // Accent
  accent: '#ff8d90',
  accentDark: '#640014',

  // Borders
  borderSubtle: 'rgba(73,72,71,0.3)',
  borderAccent: 'rgba(255,141,144,0.1)',
  borderAccentMedium: 'rgba(255,141,144,0.15)',
  surfaceOverlay: 'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.05)',

  // Status
  status: {
    quiet: '#22c55e',
    moderate: '#f97316',
    packed: '#ff8d90',
  },
};

export const statusConfig = {
  quiet: { color: '#22c55e', label: 'Quiet' },
  moderate: { color: '#f97316', label: 'Moderate' },
  packed: { color: '#ff8d90', label: 'Packed' },
};

export const filters = ['All', 'Quiet', 'Moderate', 'Packed'];

export const fonts = {
  regular: 'Poppins_400Regular',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const shadows = {
  card: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
};

/**
 * Google Maps dark theme styling for the native MapView.
 * Applied via the `customMapStyle` prop on react-native-maps.
 */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: colors.surface }] },
  { elementType: 'labels.text.fill', stylers: [{ color: colors.textSecondary }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: colors.background }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: colors.surfaceElevated }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#131313' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: colors.background }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#131313' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#131313' }] },
];