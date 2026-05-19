# Multi Timer PWA

Installierbare GitHub-Pages-Web-App mit:

- programmierbaren Multi-Timern
- mehreren Timer-Boards
- Schachuhr-Dashboard
- Spielerwechsel per Tap
- Aktivzeitmessung pro Spieler
- Zugzähler
- Schachuhr-Alarm nur 10 Sekunden
- lokaler Speicherung im Browser
- Offline-Cache nach erstem Laden

## Dateien

```text
index.html
styles.css
app.js
manifest.webmanifest
sw.js
.nojekyll
icons/
```

## Upload auf GitHub Pages

1. Neues Repository erstellen, z. B. `multi-timer-app`.
2. Alle Dateien aus diesem Ordner direkt ins Repository hochladen.
3. Repository öffnen.
4. `Settings` öffnen.
5. Links `Pages` wählen.
6. Source: `Deploy from a branch`.
7. Branch: `main`.
8. Folder: `/root`.
9. Speichern.
10. GitHub-Pages-Link öffnen.

Die App ist danach erreichbar unter:

```text
https://DEIN-GITHUB-NAME.github.io/multi-timer-app/
```

## iPad/iPhone Installation

1. Link in Safari öffnen.
2. Teilen-Symbol antippen.
3. `Zum Home-Bildschirm` wählen.
4. Namen bestätigen.
5. App über das neue Icon starten.
6. Einmal `Ton aktivieren / testen` drücken.

## Wichtige Einschränkung

Auf iPhone/iPad funktionieren Ton und Timer zuverlässig, solange die App sichtbar ist und der Bildschirm aktiv bleibt.

Wenn das Gerät gesperrt ist oder die App im Hintergrund liegt, kann iOS die Web-App pausieren. Die App berechnet beim Wiederöffnen die vergangene Zeit nach, kann aber nicht zuverlässig im Hintergrund klingeln.

Empfehlung für Spielbetrieb:

```text
Einstellungen → Anzeige & Helligkeit → Automatische Sperre → Nie
```

## Bedienung

### Timer

| Aktion | Ergebnis |
|---|---|
| Timer antippen | Start / Pause / Fortsetzen |
| Timer 5 Sekunden halten | Einstellungen öffnen |
| `+` | Neuen Timer hinzufügen |
| `Boards` | Boards öffnen |
| `Alle zurücksetzen` | Alle Timer zurücksetzen |

### Schachuhr

| Aktion | Ergebnis |
|---|---|
| Spielerfläche antippen | Dieser Spieler beendet seinen Zug; der andere Timer startet |
| `Stopp / Pause` | Beide Zeiten pausieren |
| `Zurücksetzen` | Restzeit, Aktivzeit und Züge zurücksetzen |
| Spielerfläche 5 Sekunden halten | Schachuhr-Einstellungen öffnen |
| Zeitablauf | 10 Sekunden Alarm, danach ruhig weiter sichtbar |
