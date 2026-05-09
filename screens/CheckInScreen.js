import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Feather } from '@expo/vector-icons';

export default function CheckInScreen({ route, navigation }) {
    const { spot } = route.params;
    // Tracks which button is loading to prevent spam taps
    const [loadingStatus, setLoadingStatus] = useState(null);

    const handleCheckIn = async (status) => {
        if (loadingStatus) return; // Anti-spam: block double taps
        setLoadingStatus(status);

        try {
            // 1. Log the check-in
            await addDoc(collection(db, 'checkins'), {
                spotId: spot.id,
                spotName: spot.name,
                status,
                timestamp: serverTimestamp(),
                userId: 'anonymous', // Mock user for the portfolio piece
            });

            // 2. Update the spot's live status AND add the lastUpdated timestamp
            await updateDoc(doc(db, 'spots', spot.id), {
                status,
                lastUpdated: serverTimestamp()
            });

            // 3. Smooth UX: Navigate back instantly, no annoying alert popups
            navigation.navigate('Map');
        } catch (e) {
            console.error(e);
            setLoadingStatus(null);
            alert('Yikes, something went wrong. Try again!');
        }
    };

    return (
        <View style={styles.container}>
            {/* Velvet Void Glow Orb */}
            <View style={styles.glowOrb} />

            <Text style={styles.title}>How busy is it at</Text>
            <Text style={styles.spotName}>{spot.name}?</Text>

            <View style={styles.buttonsContainer}>
                {/* Quiet Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#22c55e' }]}
                    onPress={() => handleCheckIn('quiet')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'quiet' ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Feather name="user" size={20} color="#ffffff" />
                                <Text style={styles.buttonText}>Quiet</Text>
                            </View>
                            <Text style={styles.buttonSub}>Plenty of seats available</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Moderate Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#f97316' }]}
                    onPress={() => handleCheckIn('moderate')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'moderate' ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Feather name="users" size={20} color="#ffffff" />
                                <Text style={styles.buttonText}>Moderate</Text>
                            </View>
                            <Text style={styles.buttonSub}>Some seats available</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Packed Button (Primary Crimson) */}
                <TouchableOpacity
                    style={[styles.button, styles.packedButton]}
                    onPress={() => handleCheckIn('packed')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'packed' ? (
                        <ActivityIndicator color="#640014" />
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Feather name="alert-circle" size={20} color="#640014" />
                                <Text style={[styles.buttonText, { color: '#640014' }]}>Packed</Text>
                            </View>
                            <Text style={[styles.buttonSub, { color: 'rgba(100,0,20,0.7)' }]}>Hardly any seats left</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={!!loadingStatus}
            >
                <Text style={styles.backText}>✕ Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    glowOrb: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: '#ff8d90',
        opacity: 0.06,
        top: '25%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 16,
        color: '#adaaaa',
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    spotName: {
        fontSize: 28,
        color: '#ffffff',
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
        marginBottom: 48,
        letterSpacing: -0.5,
    },
    buttonsContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    packedButton: {
        backgroundColor: '#ff8d90',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        letterSpacing: 0.5,
    },
    buttonSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        marginTop: 2,
    },
    backButton: {
        marginTop: 32,
        padding: 12
    },
    backText: {
        color: '#adaaaa',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15
    },
});