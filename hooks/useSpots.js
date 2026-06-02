import { useEffect, useState } from 'react';
import { subscribeToSpots } from '../firebase/spots';

/**
 * Hook that provides real-time spot data from Firestore.
 *
 * Subscribes on mount, cleans up on unmount.
 * Returns { spots, loading, error } so the consuming component
 * can render loading/error states without managing subscriptions.
 */
export default function useSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToSpots(
      (data) => {
        setSpots(data);
        setLoading(false);
      },
      (err) => {
        console.error('useSpots subscription error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { spots, loading, error };
}
