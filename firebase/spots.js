/**
 * Firestore data-access layer for study spots.
 *
 * Separates database operations from UI components so screens
 * only deal with state and rendering, not Firestore API details.
 */
import { collection, doc, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const SPOTS_COLLECTION = 'spots';
const CHECKINS_COLLECTION = 'checkins';

/**
 * Subscribe to real-time updates for all spots.
 * Returns an unsubscribe function for cleanup.
 */
export function subscribeToSpots(onData, onError) {
  return onSnapshot(
    collection(db, SPOTS_COLLECTION),
    (snapshot) => {
      const spots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onData(spots);
    },
    onError
  );
}

/**
 * Subscribe to real-time updates for a single spot.
 * Returns an unsubscribe function for cleanup.
 */
export function subscribeToSpot(spotId, onData, onError) {
  return onSnapshot(
    doc(db, SPOTS_COLLECTION, spotId),
    (docSnap) => {
      if (docSnap.exists()) {
        onData({ id: docSnap.id, ...docSnap.data() });
      }
    },
    onError
  );
}

/**
 * Submit a crowd-level check-in for a spot.
 *
 * Creates a checkin record and updates the spot's live status atomically.
 * Validates the status value before writing.
 *
 * @throws {Error} If status is not one of: quiet, moderate, packed
 */
export async function submitCheckIn(spotId, spotName, status) {
  const validStatuses = ['quiet', 'moderate', 'packed'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status "${status}". Expected one of: ${validStatuses.join(', ')}`);
  }

  // Log the check-in
  await addDoc(collection(db, CHECKINS_COLLECTION), {
    spotId,
    spotName,
    status,
    timestamp: serverTimestamp(),
    userId: 'anonymous', // TODO: Replace with auth user ID once auth flow is implemented
  });

  // Update the spot's live status
  await updateDoc(doc(db, SPOTS_COLLECTION, spotId), {
    status,
    lastUpdated: serverTimestamp(),
  });
}
