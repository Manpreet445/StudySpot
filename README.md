# 📍 StudySpot

A real-time, crowd-sourced study spot finder built with **React Native**, **Expo**, and **Firebase**. Users can discover nearby study locations on an interactive map, check in to report crowd levels, and view live status updates — all wrapped in a premium dark-mode UI.

![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-55-000020?logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-green)

---

## ✨ Features

- **Interactive Map** — Google Maps (native) / Leaflet (web) with custom dark-themed styling
- **Real-Time Status** — Live crowd levels (Quiet / Moderate / Packed) powered by Firestore `onSnapshot`
- **Check-In System** — Users report current busyness, instantly updating the map for everyone
- **Search & Filter** — Find spots by name or filter by crowd level
- **Cross-Platform** — Runs on Android, iOS, and Web from a single codebase
- **Premium UI** — Glassmorphism cards, glow orbs, custom map pins, and Poppins typography

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
git clone https://github.com/YOUR_USERNAME/StudySpot.git
cd StudySpot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your credentials:

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

### 4. Seed the database (optional)

Populate Firestore with sample study spots:

```bash
node seed.mjs
```

### 5. Start the app

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
│   ├── MapScreen.js        # Native map with custom pins & filters
│   ├── MapScreen.web.js    # Web map using Leaflet
│   ├── SpotDetailScreen.js # Spot details with live status
│   └── CheckInScreen.js    # Crowd-level check-in flow
├── components/
│   └── SpotCard.js         # Reusable spot card component
├── constants/
│   └── theme.js            # Design tokens (colors, fonts)
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── seed.mjs                # Database seeder script
├── .env.example            # Template for required env vars
└── .gitignore
```

---

## 🔒 Security Notes

- **No secrets in source code** — All API keys are loaded from environment variables via `.env`
- **`.env` is gitignored** — Your credentials never touch version control
- **Firestore rules** enforce read-only access for unauthenticated users and write access only for authenticated users
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

## 📱 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 📄 License

This project is for educational / portfolio purposes.
