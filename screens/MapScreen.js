import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Ionicons, Feather } from '@expo/vector-icons'; // 👈 Premium Icons

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

export default function MapScreen({ navigation }) {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedSpot, setSelectedSpot] = useState(null);

    const [region, setRegion] = useState({
        latitude: 51.0447,
        longitude: -114.0719,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // 1. Ask for Location
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    // const loc = await Location.getCurrentPositionAsync({});
                    // COMMENT THIS OUT FOR THE DEMO:
                    // setRegion({
                    //   latitude: loc.coords.latitude,
                    //   longitude: loc.coords.longitude,
                    //   latitudeDelta: 0.05,
                    //   longitudeDelta: 0.05,
                    // });
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
            {/* Background Glow Orb */}
            <View style={styles.glowOrb} />

            {/* The Map */}
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
                customMapStyle={darkMapStyle}
                onPress={() => setSelectedSpot(null)}
            >
                {filteredSpots.map((spot) => (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                        onPress={(e) => {
                            e.stopPropagation();
                            setSelectedSpot(spot);
                        }}
                    >
                        {/* Custom Aesthetic Pin with Ionicons */}
                        <View style={styles.pinContainer}>
                            <View style={[styles.pinCard, { borderColor: statusColor[spot.status] + '50' }]}>
                                <View style={[styles.pinIconBg, { backgroundColor: statusColor[spot.status] + '20' }]}>
                                    <Ionicons
                                        name={spot.status === 'quiet' ? 'book' : spot.status === 'moderate' ? 'cafe' : 'people'}
                                        size={16}
                                        color={statusColor[spot.status]}
                                    />
                                </View>
                            </View>
                            <View style={[styles.pinStem, { backgroundColor: statusColor[spot.status] + '80' }]} />
                            <View style={[styles.pinDot, { backgroundColor: statusColor[spot.status], shadowColor: statusColor[spot.status] }]} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Glassmorphism Header with Icon */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="location-sharp" size={26} color="#ff8d90" />
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
                            style={[
                                styles.filterPill,
                                activeFilter === filter && styles.filterPillActive,
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter && styles.filterTextActive,
                            ]}>
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
                            <Text style={styles.cardDistance}>Calgary, AB</Text>
                            <View style={styles.cardBadgeRow}>
                                <View style={[styles.cardBadge, { backgroundColor: statusColor[selectedSpot.status] + '20' }]}>
                                    {/* Premium Glowing Status Dot */}
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor[selectedSpot.status], shadowColor: statusColor[selectedSpot.status], shadowOpacity: 0.8, shadowRadius: 4, marginRight: 6 }} />
                                    <Text style={[styles.cardBadgeText, { color: statusColor[selectedSpot.status] }]}>
                                        {statusLabel[selectedSpot.status]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedSpot(null)} style={styles.closeButton}>
                            <Feather name="x" size={18} color="#adaaaa" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.checkinButton}
                        onPress={() => navigation.navigate('SpotDetail', { spot: selectedSpot })}
                    >
                        <Text style={styles.checkinText}>VIEW DETAILS</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Nav Bar with Feather Icons */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="compass" size={24} color="#ff8d90" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="bookmark" size={24} color="#555" />
                    <Text style={styles.navLabel}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <Feather name="map-pin" size={24} color="#ff8d90" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Check-In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={24} color="#555" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Physically turns Google Maps into the Velvet Void
const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1a1919' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#adaaaa' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0e0e0e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#262626' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#131313' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#131313' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#131313' }] },
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0e0e0e' },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e0e0e' },
    map: { flex: 1 },
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
        zIndex: 10,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: '#ff8d90', letterSpacing: -0.5 },

    searchContainer: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        zIndex: 10,
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
    searchInput: { flex: 1, color: '#ffffff', fontSize: 14, fontFamily: 'Poppins_400Regular' },
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

    // Custom Pin with Vector Icons
    pinContainer: { alignItems: 'center' },
    pinCard: {
        backgroundColor: '#1a1919',
        padding: 6,
        borderRadius: 14,
        borderWidth: 1,
    },
    pinIconBg: { padding: 8, borderRadius: 10 },
    pinStem: { width: 2, height: 16 },
    pinDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        elevation: 4,
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },

    floatingCard: {
        position: 'absolute',
        bottom: 110,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(26,25,25,0.95)',
        borderRadius: 24,
        padding: 20,
        zIndex: 10,
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
    cardBadgeRow: { flexDirection: 'row', alignItems: 'center' },
    cardBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
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
        zIndex: 10,
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