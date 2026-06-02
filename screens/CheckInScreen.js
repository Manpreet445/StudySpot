import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, statusConfig, shadows } from '../constants/theme';
import { submitCheckIn } from '../firebase/spots';

export default function CheckInScreen({ route, navigation }) {
    const { spot } = route.params;
    const [loadingStatus, setLoadingStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleCheckIn = async (status) => {
        if (loadingStatus) return;
        setLoadingStatus(status);
        setError(null);

        try {
            await submitCheckIn(spot.id, spot.name, status);
            navigation.navigate('Map');
        } catch (e) {
            console.error('Check-in failed:', e);
            setError('Something went wrong. Please try again.');
            setLoadingStatus(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.glowOrb} />

            <Text style={styles.title}>How busy is it at</Text>
            <Text style={styles.spotName}>{spot.name}?</Text>

            {error && (
                <View style={styles.errorBanner}>
                    <Feather name="alert-triangle" size={16} color={colors.accent} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: statusConfig.quiet.color }]}
                    onPress={() => handleCheckIn('quiet')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'quiet' ? (
                        <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                        <>
                            <View style={styles.buttonRow}>
                                <Feather name="user" size={20} color={colors.textPrimary} />
                                <Text style={styles.buttonText}>Quiet</Text>
                            </View>
                            <Text style={styles.buttonSub}>Plenty of seats available</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: statusConfig.moderate.color }]}
                    onPress={() => handleCheckIn('moderate')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'moderate' ? (
                        <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                        <>
                            <View style={styles.buttonRow}>
                                <Feather name="users" size={20} color={colors.textPrimary} />
                                <Text style={styles.buttonText}>Moderate</Text>
                            </View>
                            <Text style={styles.buttonSub}>Some seats available</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.packedButton]}
                    onPress={() => handleCheckIn('packed')}
                    disabled={!!loadingStatus}
                >
                    {loadingStatus === 'packed' ? (
                        <ActivityIndicator color={colors.accentDark} />
                    ) : (
                        <>
                            <View style={styles.buttonRow}>
                                <Feather name="alert-circle" size={20} color={colors.accentDark} />
                                <Text style={[styles.buttonText, { color: colors.accentDark }]}>Packed</Text>
                            </View>
                            <Text style={[styles.buttonSub, { color: 'rgba(100,0,20,0.7)' }]}>Hardly any seats left</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={!!loadingStatus}
            >
                <Feather name="x" size={16} color={colors.textSecondary} />
                <Text style={styles.backText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    glowOrb: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: colors.accent,
        opacity: 0.06,
        top: '25%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 16,
        color: colors.textSecondary,
        fontFamily: fonts.semibold,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    spotName: {
        fontSize: 28,
        color: colors.textPrimary,
        fontFamily: fonts.bold,
        textAlign: 'center',
        marginBottom: 48,
        letterSpacing: -0.5,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.accent + '15',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 24,
        width: '100%',
    },
    errorText: {
        color: colors.accent,
        fontFamily: fonts.semibold,
        fontSize: 13,
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
        ...shadows.button,
    },
    packedButton: {
        backgroundColor: colors.accent,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontFamily: fonts.bold,
        letterSpacing: 0.5,
    },
    buttonSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontFamily: fonts.regular,
        marginTop: 2,
    },
    backButton: {
        marginTop: 32,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backText: {
        color: colors.textSecondary,
        fontFamily: fonts.semibold,
        fontSize: 15,
    },
});