import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Feather } from '@expo/vector-icons'; // 👈 Bringing in the premium icons

export default function SpotDetailScreen({ route, navigation }) {
  const { spot: initialSpot } = route.params;
  const [spot, setSpot] = useState(initialSpot);
  const [loading, setLoading] = useState(true);

  // Real-time listener: Fixes the stale data bug
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'spots', initialSpot.id), (docSnap) => {
      if (docSnap.exists()) {
        setSpot({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [initialSpot.id]);

  const statusColor = {
    quiet: '#22c55e',
    moderate: '#f97316',
    packed: '#ff8d90',
  };

  const statusLabel = {
    quiet: 'Quiet',
    moderate: 'Moderate',
    packed: 'Packed',
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff8d90" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Subtle Glow Orb Effect */}
      <View style={styles.glowOrb} />

      <View style={styles.card}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.description}>{spot.description}</Text>

        {/* Premium Glowing Status Dot (No Emojis) */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor[spot.status] + '20' }]}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: statusColor[spot.status], shadowColor: statusColor[spot.status], shadowOpacity: 0.8, shadowRadius: 6 }} />
          <Text style={[styles.statusText, { color: statusColor[spot.status] }]}>
            {statusLabel[spot.status].toUpperCase()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.tags}>
          {/* Feather Vector Icons replacing the emojis */}
          <View style={styles.tag}>
            <Feather name="wifi" size={14} color="#adaaaa" />
            <Text style={styles.tagText}>Fast WiFi</Text>
          </View>
          <View style={styles.tag}>
            <Feather name="plug" size={14} color="#adaaaa" />
            <Text style={styles.tagText}>Outlets</Text>
          </View>
          <View style={styles.tag}>
            <Feather name="volume-x" size={14} color="#adaaaa" />
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
          <Feather name="x" size={16} color="#adaaaa" style={{ marginRight: 6 }} />
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0e0e0e', padding: 20, justifyContent: 'center' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e0e0e' },
  glowOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#ff8d90',
    opacity: 0.08,
    top: '10%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1a1919',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73,72,71,0.1)',
    shadowColor: '#ff8d90',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  name: { fontSize: 26, fontFamily: 'Poppins_700Bold', marginBottom: 8, color: '#ffffff', letterSpacing: -0.5 },
  description: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#adaaaa', marginBottom: 20 },

  statusBadge: {
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusText: { fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 1 },

  sectionTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#ffffff', marginBottom: 12 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  tag: {
    backgroundColor: '#262626',
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  tagText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#adaaaa' },

  checkinButton: { backgroundColor: '#ff8d90', borderRadius: 9999, padding: 16, alignItems: 'center', marginBottom: 16 },
  checkinText: { color: '#640014', fontFamily: 'Poppins_700Bold', fontSize: 14, letterSpacing: 1 },

  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
  backText: { color: '#adaaaa', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});