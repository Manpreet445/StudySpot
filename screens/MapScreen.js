import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, fonts, statusConfig, filters, darkMapStyle, shadows } from '../constants/theme';
import useSpots from '../hooks/useSpots';
import useUserLocation from '../hooks/useUserLocation';

export default function MapScreen({ navigation }) {
    const { spots, loading } = useSpots();
    const { location } = useUserLocation();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedSpot, setSelectedSpot] = useState(null);

    const region = {
        ...location,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const filteredSpots = spots.filter((spot) => {
        const matchesFilter = activeFilter === 'All' || spot.status === activeFilter.toLowerCase();
        const matchesSearch = spot.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.glowOrb} />

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
                        <View style={styles.pinContainer}>
                            <View style={[styles.pinCard, { borderColor: statusConfig[spot.status].color + '50' }]}>
                                <View style={[styles.pinIconBg, { backgroundColor: statusConfig[spot.status].color + '20' }]}>
                                    <Ionicons
                                        name={spot.status === 'quiet' ? 'book' : spot.status === 'moderate' ? 'cafe' : 'people'}
                                        size={16}
                                        color={statusConfig[spot.status].color}
                                    />
                                </View>
                            </View>
                            <View style={[styles.pinStem, { backgroundColor: statusConfig[spot.status].color + '80' }]} />
                            <View style={[styles.pinDot, { backgroundColor: statusConfig[spot.status].color, shadowColor: statusConfig[spot.status].color }]} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="location-sharp" size={26} color={colors.accent} />
                    <Text style={styles.headerTitle}>StudySpot</Text>
                </View>
            </View>

            {/* Search & Filters */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for study spots..."
                        placeholderTextColor={colors.textSecondary}
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

            {/* Selected Spot Card */}
            {selectedSpot && (
                <View style={styles.floatingCard}>
                    <View style={styles.cardTop}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{selectedSpot.name}</Text>
                            <Text style={styles.cardDistance}>Calgary, AB</Text>
                            <View style={styles.cardBadgeRow}>
                                <View style={[styles.cardBadge, { backgroundColor: statusConfig[selectedSpot.status].color + '20' }]}>
                                    <View style={[styles.statusDot, { backgroundColor: statusConfig[selectedSpot.status].color, shadowColor: statusConfig[selectedSpot.status].color }]} />
                                    <Text style={[styles.cardBadgeText, { color: statusConfig[selectedSpot.status].color }]}>
                                        {statusConfig[selectedSpot.status].label}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedSpot(null)} style={styles.closeButton}>
                            <Feather name="x" size={18} color={colors.textSecondary} />
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

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="compass" size={24} color={colors.accent} />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="bookmark" size={24} color={colors.textMuted} />
                    <Text style={styles.navLabel}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <Feather name="map-pin" size={24} color={colors.accent} />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Check-In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={24} color={colors.textMuted} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    map: { flex: 1 },
    glowOrb: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: colors.accent,
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
    headerTitle: { fontSize: 26, fontFamily: fonts.bold, color: colors.accent, letterSpacing: -0.5 },

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
        borderColor: colors.borderAccent,
    },
    searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14, fontFamily: fonts.regular },
    filterRow: { flexDirection: 'row' },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
        backgroundColor: 'rgba(26,25,25,0.95)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
    },
    filterPillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    filterText: { color: colors.textSecondary, fontSize: 13, fontFamily: fonts.semibold },
    filterTextActive: { color: colors.accentDark },

    pinContainer: { alignItems: 'center' },
    pinCard: {
        backgroundColor: colors.surface,
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
        borderColor: colors.borderAccentMedium,
        ...shadows.card,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 20, fontFamily: fonts.bold, color: colors.textPrimary, marginBottom: 4 },
    cardDistance: { fontSize: 13, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: 12 },
    cardBadgeRow: { flexDirection: 'row', alignItems: 'center' },
    cardBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    cardBadgeText: { fontSize: 11, fontFamily: fonts.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
    statusDot: { width: 8, height: 8, borderRadius: 4, shadowOpacity: 0.8, shadowRadius: 4, marginRight: 6 },
    closeButton: { padding: 4, backgroundColor: colors.surfaceHover, borderRadius: 12, height: 32, width: 32, alignItems: 'center', justifyContent: 'center' },
    checkinButton: {
        backgroundColor: colors.accent,
        borderRadius: 9999,
        padding: 16,
        alignItems: 'center',
    },
    checkinText: { color: colors.accentDark, fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1 },

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
        borderColor: colors.surfaceOverlay,
        zIndex: 10,
    },
    navItem: { alignItems: 'center', gap: 4 },
    navItemActive: {
        backgroundColor: 'rgba(255,141,144,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
    },
    navLabel: { fontSize: 10, color: colors.textMuted, fontFamily: fonts.bold, textTransform: 'uppercase', letterSpacing: 1 },
    navLabelActive: { color: colors.accent },
});