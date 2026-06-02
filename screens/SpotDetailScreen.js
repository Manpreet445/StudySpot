import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, statusConfig, shadows } from '../constants/theme';
import { subscribeToSpot } from '../firebase/spots';

export default function SpotDetailScreen({ route, navigation }) {
  const { spot: initialSpot } = route.params;
  const [spot, setSpot] = useState(initialSpot);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSpot(
      initialSpot.id,
      (data) => {
        setSpot(data);
        setLoading(false);
      },
      (err) => {
        console.error('SpotDetail subscription error:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [initialSpot.id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const config = statusConfig[spot.status];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.glowOrb} />

      <View style={styles.card}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.description}>{spot.description}</Text>

        {/* Status badge with live indicator */}
        <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: config.color, shadowColor: config.color }]} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.label.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Feather name="wifi" size={14} color={colors.textSecondary} />
            <Text style={styles.tagText}>Fast WiFi</Text>
          </View>
          <View style={styles.tag}>
            <Feather name="plug" size={14} color={colors.textSecondary} />
            <Text style={styles.tagText}>Outlets</Text>
          </View>
          <View style={styles.tag}>
            <Feather name="volume-x" size={14} color={colors.textSecondary} />
            <Text style={styles.tagText}>Quiet Zone</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkinButton}
          onPress={() => navigation.navigate('CheckIn', { spot })}
        >
          <Text style={styles.checkinText}>CHECK IN HERE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="x" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, justifyContent: 'center' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  glowOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.accent,
    opacity: 0.08,
    top: '10%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73,72,71,0.1)',
    ...shadows.card,
  },
  name: { fontSize: 26, fontFamily: fonts.bold, marginBottom: 8, color: colors.textPrimary, letterSpacing: -0.5 },
  description: { fontSize: 15, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: 20 },

  statusBadge: {
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, shadowOpacity: 0.8, shadowRadius: 6 },
  statusText: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1 },

  sectionTitle: { fontSize: 16, fontFamily: fonts.semibold, color: colors.textPrimary, marginBottom: 12 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  tag: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.textSecondary },

  checkinButton: { backgroundColor: colors.accent, borderRadius: 9999, padding: 16, alignItems: 'center', marginBottom: 16 },
  checkinText: { color: colors.accentDark, fontFamily: fonts.bold, fontSize: 14, letterSpacing: 1 },

  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
  backText: { color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: 14 },
});