# uek335-movies

Movie Details Checker – Mobile-App für MovieCruxStudios (üK 335).

## Voraussetzungen

- Node.js LTS (22 oder 24)
- Docker Desktop
- Android Studio mit eingerichtetem Emulator (AVD)

## Installation

```bash
git clone <repo-url>
cd uek335-movies
npm install
```

## Backend starten

```bash
docker run -d -p 3030:3000 --name restdb noseryoung/rest-jsondb
```

Das Backend ist danach unter `http://localhost:3030` erreichbar, aus dem Android-Emulator unter `http://10.0.2.2:3030`.

## App starten

1. Android-Emulator in Android Studio starten.
2. App starten:

```bash
npm run android
```

## Tech-Stack

- React Native mit Expo (TypeScript)
- Expo Router
- React Native Paper
