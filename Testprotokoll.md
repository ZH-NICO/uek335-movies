# Testprotokoll – Movie Details Checker

## Testumgebung

| Angabe | Wert |
|---|---|
| Getesteter Stand (Branch, Commit) | feature/cleanup, d2fe426 |
| Testdatum | 06.11.2026 |
| Gerät / Emulator | iPhone 15 Pro Max (Margarita), Android-Emulator Medium Phone API 37 (Nico) |
| Android- / iOS-Version | Android 17 (API 37) im Emulator |
| Expo Go Version | SDK 58.0.0 |
| Backend | Docker-Image `noseryoung/rest-jsondb`, Port 3030 |

## Allgemeine Vorbedingungen

- Backend läuft: `docker start restdb`
- App läuft: `npx expo start`
- Testkonto für die Tests vorhanden (siehe A-01). Passwort nicht in dieses Protokoll schreiben.
- Nach einem Reset des Backends sind die Konten weg und die Filme wieder im Originalzustand.

**Status:** Bestanden / Fehlgeschlagen / Nicht ausgeführt

## Auswahl der Testfälle

Pro Feature gibt es mindestens einen Happy Path. Die Fehler- und Randfälle decken die grössten Risiken der App ab: falsche Eingaben, falsches Login, Verbindungsverlust, abgelaufene Anmeldung und leere Suchergebnisse. Die Auswahl konzentriert sich auf die MUSS- und SOLL-Funktionen.

## Konto und Anmeldung

| TestCaseId | Component | Priority | Description | Pre-requisites | Test Steps | Expected Result | Actual Result | Status | Executed By |
|---|---|---|---|---|---|---|---|---|---|
| A-01 | Sign up | Hoch | Konto erstellen (Happy Path) | E-Mail noch nicht registriert | 1. „Sign up“ öffnen<br>2. Alle Felder gültig ausfüllen<br>3. „Sign up“ tippen | Konto wird erstellt, die Tabs erscheinen | Konto wird erstellt, die App öffnet die Tabs. | Bestanden | Margarita |
| A-02 | Sign up | Hoch | Ungültige Eingaben | Sign-up-Screen offen | 1. E-Mail `abc`, Passwort `123` eingeben<br>2. Alter leer lassen<br>3. „Sign up“ tippen | Rote Fehlertexte, u.a. „Enter a valid email address.“ und „At least 4 characters – you entered 3.“; kein Konto erstellt | Rote Fehlertexte bei E-Mail und Passwort erscheinen, der Screen bleibt offen, kein Konto erstellt. | Bestanden | Margarita |
| A-04 | Login | Hoch | Login (Happy Path) | Konto aus A-01, ausgeloggt | 1. E-Mail und Passwort eingeben<br>2. „Log in“ tippen | Tabs erscheinen; Zurück führt nicht zum Login | Login klappt, die Tabs erscheinen, Zurück führt nicht zum Login. | Bestanden | Margarita |
| A-05 | Login | Hoch | Falsches Passwort | Konto aus A-01, ausgeloggt | 1. Richtige E-Mail und falsches Passwort eingeben<br>2. „Log in“ tippen | Rote Box „Login failed“ mit „Email or password is incorrect. Check your entries and try again.“ | Rote Box „Login failed“ mit dem erwarteten Text erscheint, der Login-Screen bleibt offen. | Bestanden | Margarita |
| A-07 | Persistenz | Hoch | Nach Neustart eingeloggt | Eingeloggt, Token nicht abgelaufen | 1. App komplett schliessen<br>2. App neu starten | App öffnet ohne Login die Tabs | Nach dem Neustart öffnet die App direkt die Tabs, ohne Login. | Bestanden | Margarita |
| A-08 | Persistenz | Hoch | Abgelaufener Token | Seit dem Login ist mehr als 1 Stunde vergangen | 1. Filmliste neu laden oder App neu starten | Automatische Abmeldung, Login-Screen erscheint | Vor der Testrunde geprüft: nach mehr als 1 Stunde automatische Abmeldung, Login-Screen erscheint. | Bestanden | Margarita |

## Home und Profil

| TestCaseId | Component | Priority | Description | Pre-requisites | Test Steps | Expected Result | Actual Result | Status | Executed By |
|---|---|---|---|---|---|---|---|---|---|
| H-01 | Home | Mittel | Überblick anzeigen | Eingeloggt | 1. Tab „Home“ öffnen | Begrüssung, Top-Film, Zahlen (Movies, Genres, Ø Rating) und weitere Top-Filme werden angezeigt | Begrüssung, Top-Film, Zahlen und weitere Top-Filme werden angezeigt. | Bestanden | Margarita |
| P-01 | Profil | Hoch | Benutzerdaten anzeigen | Eingeloggt mit Konto aus A-01 | 1. Tab „Profile“ öffnen | E-Mail, Vorname, Nachname und Alter stimmen; kein Passwort sichtbar | E-Mail, Vorname, Nachname und Alter stimmen, kein Passwort sichtbar. | Bestanden | Margarita |
| P-02 | Profil | Hoch | Logout | Eingeloggt | 1. „Log out“ tippen<br>2. Im Dialog „Log out“ tippen | Login-Screen erscheint; Zurück führt nicht in die App; nach einem Neustart bleibt der Login-Screen | Login-Screen erscheint, Zurück führt nicht in die App, auch nach dem Neustart bleibt der Login-Screen. | Bestanden | Margarita |

## Filmliste

| TestCaseId | Component | Priority | Description | Pre-requisites | Test Steps | Expected Result | Actual Result | Status | Executed By |
|---|---|---|---|---|---|---|---|---|---|
| L-01 | Liste | Hoch | Filme anzeigen (Happy Path) | Eingeloggt | 1. Tab „Movies“ öffnen | Spinner, danach Karten mit Poster, Titel, Jahr, Genre und Rating | Karten mit Poster, Titel, Jahr, Genre und Rating erscheinen, nach Titel sortiert. Der Spinner ist nur sehr kurz sichtbar. (Android-Emulator, API 37) | Bestanden | Nico |
| L-03 | Suche | Hoch | Suche nach Titel (Happy Path) | Liste offen | 1. `in` eingeben | Nach kurzer Pause nur passende Filme; Untertitel zeigt z.B. „N results for «in»“ | Nach kurzer Pause nur Inception, The Lion King, The Shining und The Terminator; Untertitel „4 results for «in»“. Gleich wie die Abfrage direkt im Backend. (Android-Emulator, API 37) | Bestanden | Nico |
| L-04 | Suche | Hoch | Keine Treffer | Liste offen | 1. `xyzxyz` eingeben | Meldung „No movies match your search. Try another title or remove a filter.“ | Untertitel „0 results for «xyzxyz»“ und Meldung „No movies match your search. Try another title or remove a filter.“ (Android-Emulator, API 37) | Bestanden | Nico |
| L-05 | Filter | Hoch | Genre, Jahr und IMDb filtern | Liste offen | 1. Genre wählen<br>2. Jahrzehnt wählen<br>3. IMDb-Wert wählen | Liste zeigt nur Filme, die allen Filtern entsprechen | Sci-Fi: 6 Filme; dazu 1980s: 2 Filme; dazu IMDb ≥ 8: Back to the Future und The Terminator. Gleich wie im Backend. Filter lassen sich mit „x“ entfernen. (Android-Emulator, API 37) | Bestanden | Nico |
| L-07 | Liste | Hoch | Backend aus beim Laden | Eingeloggt, Liste offen | 1. `docker stop restdb`<br>2. Suchbegriff eingeben<br>3. `docker start restdb`<br>4. „Try again“ tippen | 2. Nach höchstens ca. 10 s „No connection to the server. Check your connection and try again.“<br>4. Liste erscheint | Ohne Backend erscheint „No connection to the server. Check your connection and try again.“ mit „Try again“. Nach dem Neustart des Backends und „Try again“ erscheint Alien. (Android-Emulator, API 37) | Bestanden | Nico |

## Details

| TestCaseId | Component | Priority | Description | Pre-requisites | Test Steps | Expected Result | Actual Result | Status | Executed By |
|---|---|---|---|---|---|---|---|---|---|
| D-01 | Details | Hoch | Details anzeigen (Happy Path) | Liste offen | 1. Film mit Poster antippen, z.B. Inception | Poster, Titel, Rating und alle Angaben werden angezeigt | Poster, Inception, 8.8 / 10 IMDb, Christopher Nolan, Sci-Fi, Jul 16 2010, 148 min, 87 % werden angezeigt. (Android-Emulator, API 37) | Bestanden | Nico |

## Film erstellen, bearbeiten, löschen

| TestCaseId | Component | Priority | Description | Pre-requisites | Test Steps | Expected Result | Actual Result | Status | Executed By |
|---|---|---|---|---|---|---|---|---|---|
| F-01 | Neu | Hoch | Film erstellen (Happy Path) | Liste offen | 1. „New movie“ tippen<br>2. Titel `Test A` und Datum `Jul 16 2010` eingeben<br>3. „Save movie“ tippen | Meldung „«Test A» saved.“, Film erscheint in der Liste | Snackbar „«Test A» saved.“, die Liste erscheint wieder. Film ist im Backend gespeichert (leere Felder als null). (Android-Emulator, API 37) | Bestanden | Nico |
| F-02 | Neu | Hoch | Pflichtfelder leer | Formular offen | 1. Alles leer lassen<br>2. „Save movie“ tippen | „Enter a title.“ und „Enter a real date like Sep 03 2009.“; nichts gespeichert | „Enter a title.“ und „Enter a real date like Sep 03 2009.“ erscheinen, Anzahl Filme im Backend bleibt 31. (Android-Emulator, API 37) | Bestanden | Nico |
| F-03 | Validierung | Hoch | Ungültige Werte | Formular offen, Pflichtfelder gültig | 1. IMDb `11` eingeben<br>2. Rotten Tomatoes `101` eingeben<br>3. Laufzeit `abc` eingeben<br>4. Speichern | Passender Fehlertext unter jedem Feld; nichts gespeichert | „Enter the running time in whole minutes.“, „Enter a number from 0 to 10.“ und „Enter a number from 0 to 100.“ erscheinen, nichts gespeichert. (Android-Emulator, API 37) | Bestanden | Nico |
| F-08 | Bearbeiten | Hoch | Film bearbeiten (Happy Path) | Film mit Poster, Details offen | 1. „Edit movie“ tippen<br>2. Felder sind vorausgefüllt<br>3. Titel ändern<br>4. „Save changes“ tippen | Details zeigen den neuen Titel, das Poster bleibt erhalten; die Liste ist aktuell | Noch nicht ausgeführt. | Nicht ausgeführt | Nico |
| F-10 | Löschen | Hoch | Film löschen (Happy Path) | Film aus F-01, Details offen | 1. Papierkorb tippen<br>2. Im Dialog „Delete“ tippen | Liste erscheint ohne den Film, Snackbar zeigt „Undo“ | Noch nicht ausgeführt. | Nicht ausgeführt | Nico |
| F-12 | Löschen | Hoch | Löschen rückgängig machen | Film wie in F-10 gelöscht, Snackbar sichtbar | 1. „Undo“ tippen | Film ist wieder in der Liste, alle Angaben sind erhalten | Noch nicht ausgeführt. | Nicht ausgeführt | Nico |

## Gefundene Fehler und Nachtests

| Fehler-ID | TestCaseId | Beschreibung | Behoben in (Commit) | Nachtest am | Nachtest-Ergebnis | Executed By |
|---|---|---|---|---|---|---|
| | | | | | | |

## Zusammenfassung

| Total | Bestanden | Fehlgeschlagen | Nicht ausgeführt |
|---|---|---|---|
| 21 | 18 | 0 | 3 |
