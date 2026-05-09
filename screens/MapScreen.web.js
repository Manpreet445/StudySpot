import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Ionicons, Feather } from '@expo/vector-icons';

// Leaflet Imports
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Velvet Void Status Colors
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

const filters = ['All', 'Quiet', 'Moderate', 'Packed'];

// Premium SVG Icons for Leaflet Web
const createCustomIcon = (status) => {
    const color = statusColor[status];

    const quietSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    const moderateSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    const packedSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;

    const iconSvg = status === 'quiet' ? quietSvg : status === 'moderate' ? moderateSvg : packedSvg;

    const html = `
    <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
      <div style="background: #1a1919; border: 1px solid ${color}50; border-radius: 14px; padding: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        <div style="background: ${color}20; border-radius: 10px; padding: 6px; display: flex; justify-content: center; align-items: center;">
          ${iconSvg}
        </div>
      </div>
      <div style="width: 2px; height: 16px; background: ${color}80;"></div>
      <div style="width: 10px; height: 10px; border-radius: 5px; background: ${color}; box-shadow: 0 0 10px ${color};"></div>
    </div>
  `;

    return L.divIcon({
        html,
        className: 'custom-leaflet-pin',
        iconSize: [44, 64],
        iconAnchor: [22, 64],
    });
};

export default function MapScreenWeb({ navigation }) {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedSpot, setSelectedSpot] = useState(null);

    const [region, setRegion] = useState({
        latitude: 51.0447,
        longitude: -114.0719,
    });

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    setRegion({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });
                }
            } catch (e) {
                console.log('Location unavailable, sticking to Calgary default.');
            }
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'spots'),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSpots(data);
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const filteredSpots = spots.filter((spot) => {
        const matchesFilter = activeFilter === 'All' || spot.status === activeFilter.toLowerCase();
        const matchesSearch = spot.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ff8d90" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <style>{`
        .dark-satellite { filter: brightness(0.7) contrast(1.2); }
        .leaflet-control-container { display: none; }
      `}</style>

            <View style={styles.glowOrb} />

            <View style={StyleSheet.absoluteFillObject}>
                <MapContainer
                    center={[region.latitude, region.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', backgroundColor: '#0e0e0e' }}
                    onClick={() => setSelectedSpot(null)}
                >
                    <TileLayer
                        className="dark-satellite"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles &copy; Esri &mdash; Source: Esri"
                    />

                    {filteredSpots.map((spot) => (
                        <Marker
                            key={spot.id}
                            position={[spot.latitude, spot.longitude]}
                            icon={createCustomIcon(spot.status)}
                            eventHandlers={{
                                click: () => setSelectedSpot(spot),
                            }}
                        />
                    ))}
                </MapContainer>
            </View>

            {/* Glassmorphism Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="location-sharp" size={24} color="#ff8d90" />
                    <Text style={styles.headerTitle}>StudySpot</Text>
                </View>
            </View>

            {/* Floating Search & Filters */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color="#adaaaa" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for study spots..."
                        placeholderTextColor="#adaaaa"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Floating Selected Spot Card */}
            {selectedSpot && (
                <View style={styles.floatingCard}>
                    <View style={styles.cardTop}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{selectedSpot.name}</Text>
                            <Text style={styles.cardDistance}>📍 Calgary, AB</Text>
                            <View style={styles.cardBadgeRow}>
                                <View style={[styles.cardBadge, { backgroundColor: statusColor[selectedSpot.status] + '20', flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                                    {/* Premium Glowing Status Dot */}
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor[selectedSpot.status], shadowColor: statusColor[selectedSpot.status], shadowOpacity: 0.8, shadowRadius: 4 }} />
                                    <Text style={[styles.cardBadgeText, { color: statusColor[selectedSpot.status] }]}>
                                        {statusLabel[selectedSpot.status]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedSpot(null)} style={styles.closeButton}>
                            <Feather name="x" size={16} color="#adaaaa" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.checkinButton}
                        onPress={() => navigation.navigate('SpotDetail', { spot: selectedSpot })}
                    >
                        <Text style={styles.checkinText}>VIEW DETAILS →</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Nav Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="compass" size={22} color="#555" />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="bookmark" size={22} color="#555" />
                    <Text style={styles.navLabel}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <Feather name="map-pin" size={22} color="#ff8d90" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Check-In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={22} color="#555" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0e0e0e' },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e0e0e' },
    glowOrb: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#ff8d90',
        opacity: 0.06,
        top: '20%',
        left: '-10%',
        zIndex: 0,
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 110,
        backgroundColor: 'rgba(14,14,14,0.85)',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 20,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#ff8d90', letterSpacing: -0.5 },

    searchContainer: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        zIndex: 1000,
        gap: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(38,38,38,0.95)',
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,141,144,0.1)',
    },
    searchInput: { flex: 1, color: '#ffffff', fontSize: 14, fontFamily: 'Poppins_400Regular', outlineStyle: 'none' },
    filterRow: { flexDirection: 'row' },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
        backgroundColor: 'rgba(26,25,25,0.95)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(73,72,71,0.3)',
    },
    filterPillActive: { backgroundColor: '#ff8d90', borderColor: '#ff8d90' },
    filterText: { color: '#adaaaa', fontSize: 13, fontFamily: 'Poppins_600SemiBold' },
    filterTextActive: { color: '#640014' },

    floatingCard: {
        position: 'absolute',
        bottom: 110,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(26,25,25,0.95)',
        borderRadius: 24,
        padding: 20,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: 'rgba(255,141,144,0.15)',
        shadowColor: '#ff8d90',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#ffffff', marginBottom: 4 },
    cardDistance: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#adaaaa', marginBottom: 12 },
    cardBadgeRow: { flexDirection: 'row' },
    cardBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    cardBadgeText: { fontSize: 11, fontFamily: 'Poppins_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
    closeButton: { padding: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, height: 32, width: 32, alignItems: 'center', justifyContent: 'center' },
    checkinButton: {
        backgroundColor: '#ff8d90',
        borderRadius: 9999,
        padding: 16,
        alignItems: 'center',
    },
    checkinText: { color: '#640014', fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 1 },

    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(20,19,19,0.98)',
        paddingVertical: 16,
        paddingBottom: 28,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
        zIndex: 1000,
    },
    navItem: { alignItems: 'center', gap: 4 },
    navItemActive: {
        backgroundColor: 'rgba(255,141,144,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
    },
    navLabel: { fontSize: 10, color: '#555', fontFamily: 'Poppins_700Bold', textTransform: 'uppercase', letterSpacing: 1 },
    navLabelActive: { color: '#ff8d90' },
});