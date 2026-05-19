# Schritt-für-Schritt: App auf iPad installieren

## 1. ZIP entpacken

Entpacke die ZIP-Datei auf deinem Windows-PC.

## 2. GitHub-Repository öffnen

Öffne dein Repository, in dem die App bereits deployed ist.

## 3. Dateien ersetzen

Lade den Inhalt des entpackten Ordners hoch und ersetze die alten Dateien:

- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- .nojekyll
- icons/

Wichtig: Die Dateien müssen direkt im Hauptverzeichnis liegen, nicht in einem Unterordner.

## 4. Commit ausführen

Unten auf `Commit changes` klicken.

## 5. GitHub Pages warten lassen

Warte, bis GitHub Pages neu deployed hat.

## 6. iPad-Cache leeren / App aktualisieren

Da die App offline cached, kann das iPad die alte Version behalten.

Empfohlen:

1. Home-Screen-App vom iPad löschen.
2. Safari öffnen.
3. GitHub-Pages-Link öffnen.
4. Seite neu laden.
5. Teilen → Zum Home-Bildschirm.
6. App neu hinzufügen.

## 7. Ton aktivieren

Nach dem Start einmal `Ton aktivieren / testen` antippen.

## 8. Bedienung

### Timer bearbeiten

1. Oben auf `Bearb.` tippen.
2. Timer antippen.
3. Einstellungen ändern.
4. Speichern.
5. Oben auf `Fertig` tippen.

### Timer starten

- Wenn Bearbeiten aus ist: Timer antippen.

### Schachuhr einstellen

- Schachuhr-Tab öffnen.
- Oben rechts Zahnrad antippen.
- Zeit, Namen, Farben und Sound einstellen.

### Schachuhr verwenden

- Spielerfläche antippen: eigener Zug endet, anderer Spieler startet.
- `Stopp / Pause`: gesamte Uhr pausieren.
- `Zurücksetzen`: Restzeit, Aktivzeit und Züge zurücksetzen.

## Hinweis

Eine PWA klingelt auf iPad/iPhone nur zuverlässig, wenn die App offen ist und der Bildschirm aktiv bleibt.
