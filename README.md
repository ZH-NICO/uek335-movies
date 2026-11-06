# uek335-movies

Movie Details Checker – Mobile-App für MovieCruxStudios (üK 335).

Mit der App können Mitarbeitende Filme anschauen, suchen, filtern, erfassen, bearbeiten und löschen. Für die Nutzung braucht es ein Konto.

## Voraussetzungen

- Node.js LTS (22 oder 24)
- Docker Desktop
- Android Studio mit eingerichtetem Emulator (AVD) **oder** Expo Go auf dem Handy (App Store / Play Store)

## Installation

```bash
git clone https://github.com/ZH-NICO/uek335-movies.git
cd uek335-movies
npm install
```

## Backend starten

```bash
docker run -d -p 3030:3000 --name restdb noseryoung/rest-jsondb
```

Das Backend läuft danach auf Port 3030. Die App findet die Adresse selbst: Sie nimmt die IP des Computers, auf dem Expo läuft. Es muss nichts im Code angepasst werden.

Backend zurücksetzen (alle Daten wieder wie am Anfang):

```bash
docker rm -f restdb
docker run -d -p 3030:3000 --name restdb noseryoung/rest-jsondb
```

## App starten

```bash
npx expo start
```

- **Android-Emulator:** Emulator in Android Studio starten, dann im Terminal `a` drücken.
- **iPhone / Android-Handy:** Handy im gleichen WLAN wie der Computer. QR-Code mit der iPhone-Kamera bzw. mit Expo Go scannen.

Danach ein Konto mit «Sign up» erstellen oder mit einem bestehenden Konto einloggen.

## Probleme

### «No connection to the server»

- Läuft das Backend? `docker ps` muss `restdb` anzeigen.
- Auf einem echten Handy: Die Windows-Firewall muss Port 3030 im WLAN erlauben.

### Emulator mit Android 17 (API 37)

Expo Go braucht dort die Berechtigung für das lokale Netzwerk, sonst erreicht die App das Backend nicht. Einmalig ausführen, nachdem Expo Go installiert ist:

```bash
adb shell pm grant host.exp.exponent android.permission.ACCESS_LOCAL_NETWORK
```

## Tech-Stack

- React Native mit Expo SDK 58 (TypeScript)
- Expo Router
- React Native Paper
- axios
- expo-secure-store
- Backend: noseryoung/rest-jsondb (json-server mit json-server-auth)

## Projektstruktur

| Ordner | Inhalt |
|---|---|
| `src/app` | Screens und Layouts (jede Datei ist eine Route) |
| `src/components` | Wiederverwendbare Komponenten |
| `src/api` | axios-Instanz und Anfragen an das Backend |
| `src/context` | Login-Status und Snackbar |
| `src/hooks` | Daten laden beim Öffnen eines Screens |
| `src/storage` | Token und User-ID im SecureStore |
| `src/constants`, `src/types`, `src/utils` | Theme, Konfiguration, Typen und Validierung |

## Team

- Nico Schult: Konto, Navigation, Home, Profil
- Margarita Grigoreva: Filme
