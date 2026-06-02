# 📍 StudySpot

A cross-platform mobile app for discovering and reporting study spots in real time. Built with **React Native**, **Expo**, and **Firebase**. Map UI runs natively on Android/iOS via Google Maps and on Web via Leaflet — single codebase, three platforms.

![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-55-000020?logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-green)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange)

**🚀 Status:** Core feature set shipped — real-time check-ins, cross-platform map, Firestore-backed crowd-level data. Auth flow, search/filter, and expanded spot dataset in development.

---

## ✨ What's Working

- **Cross-platform map** — Google Maps native (Android/iOS), Leaflet web, dark-themed styling on both
- **Custom design system** — Glassmorphism cards, glow accents, custom pins, Poppins typography
- **Spot navigation** — Tap a pin → spot detail screen
- **Live crowd-level data** — Spot locations defined in-app (3 sample locations for now); crowd-level state (Quiet / Moderate / Packed) lives in Firestore and updates across all connected clients in real time via `onSnapshot` listeners
- **Real-time check-ins** — Users submit crowd levels; updates propagate live to all connected devices
- **Auth-gated writes** — Firestore security rules deployed: public read, authenticated write
- **Cross-platform routing** — React Navigation stack working on all three targets
- **Environment hygiene** — No keys in source, `.env.example` template, `.env` gitignored

---

## 🛣️ Roadmap

- [x] Expo + Firebase scaffolding
- [x] Cross-platform map (native + web implementations)
- [x] Spot pins rendered on map
- [x] Custom dark-mode design system
- [x] Spot detail screen navigation
- [x] Check-in submission flow with Firestore persistence
- [x] Real-time crowd-level updates via `onSnapshot`
- [x] Cross-device live sync
- [x] Production deployment of Firestore security rules
- [ ] Migrate spot location data from in-app constants to Firestore
- [ ] Add admin / seeding flow to populate more locations
- [ ] Search & filter by crowd level
- [ ] Authentication flow (anonymous → email)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigation | React Navigation (Stack) |
| Database | Cloud Firestore (real-time) |
| Maps (Native) | `react-native-maps` (Google Maps) |
| Maps (Web) | `react-leaflet` + Leaflet.js |
| Icons | `@expo/vector-icons` (Feather + Ionicons) |
| Fonts | `@expo-google-fonts/poppins` |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- A [Firebase](https://console.firebase.google.com/) project with Firestore enabled
- A [Google Maps API key](https://console.cloud.google.com/apis/credentials) (for Android native maps)

### 1. Clone the repository

```bash
git clone https://github.com/Manpreet445/StudySpot.git
cd StudySpot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and replace the placeholder values with your actual keys:

```env
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=000000000000
FIREBASE_APP_ID=your_firebase_app_id
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> **Where to find these:**
> - **Firebase keys** → [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps → Web app config
> - **Google Maps key** → [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

### 4. Start the app

```bash
# Start the Expo dev server
npx expo start

# Run on specific platforms
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## 📁 Project Structure

```
StudySpot/
├── App.js                  # Root — navigation stack setup
├── app.config.js           # Expo config (reads env vars)
├── firebase/
│   └── config.js           # Firebase init (reads from expo-constants)
├── screens/
│   ├── MapScreen.js        # Native map with custom pins
│   ├── MapScreen.web.js    # Web map using Leaflet
│   ├── SpotDetailScreen.js # Spot details with live crowd-level
│   └── CheckInScreen.js    # Crowd-level check-in flow
├── components/
│   └── SpotCard.js         # Reusable spot card component
├── constants/
│   └── theme.js            # Design tokens (colors, fonts)
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── .env.example            # Template for required env vars
└── .gitignore
```

---

## 🔒 Security Notes

- **No secrets in source code** — All API keys are loaded from environment variables via `.env`
- **`.env` is gitignored** — Your credentials never touch version control
- **Firestore rules enforce** read-only access for unauthenticated users and write access only for authenticated users
- If you fork this project, **generate your own API keys** — never reuse someone else's

---

## 📜 Firestore Security Rules

The included `firestore.rules` enforce:

| Collection | Read | Write |
|---|---|---|
| `spots` | ✅ Public | 🔐 Auth required |
| `checkins` | ✅ Public | 🔐 Auth required (create only) |
| Everything else | ❌ Denied | ❌ Denied |

Deploy rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

---

## 📄 License

This project is for educational / portfolio purposes.

---

*Side project — exploring React Native + real-time data sync. For shipped production work, see [Recepie](https://github.com/Manpreet445/Recepie).*
