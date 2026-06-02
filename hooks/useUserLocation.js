import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const CALGARY_DEFAULT = {
  latitude: 51.0447,
  longitude: -114.0719,
};

/**
 * Hook that requests foreground location permission and returns
 * the user's current coordinates. Falls back to Calgary if
 * permission is denied or location services are unavailable.
 */
export default function useUserLocation() {
  const [location, setLocation] = useState(CALGARY_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        if (!cancelled) {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLocation();
    return () => { cancelled = true; };
  }, []);

  return { location, loading, error };
}
