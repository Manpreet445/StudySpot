import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const spots = [
    {
        id: '1',
        name: 'Central Library',
        description: 'Quiet, great WiFi',
        latitude: 51.0447,
        longitude: -114.0719,
        status: 'quiet',
    },
    {
        id: '2',
        name: 'Starbucks - 17th Ave',
        description: 'Busy but good vibes',
        latitude: 51.0391,
        longitude: -114.0748,
        status: 'moderate',
    },
    {
        id: '3',
        name: 'MacEwan Conference Centre',
        description: 'Lots of seating',
        latitude: 51.0486,
        longitude: -114.0669,
        status: 'packed',
    }
];

async function seed() {
    try {
        for (const spot of spots) {
            await setDoc(doc(db, "spots", spot.id), spot);
            console.log(`Seeded spot: ${spot.name}`);
        }
        console.log("All spots seeded successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding: ", e);
        process.exit(1);
    }
}

seed();
