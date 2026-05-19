# Schritt-für-Schritt: App auf das iPad bekommen

## 1. ZIP entpacken

Lade die ZIP herunter und entpacke sie auf deinem Windows-11-PC.

Du solltest danach diesen Ordnerinhalt sehen:

```text
index.html
styles.css
app.js
manifest.webmanifest
sw.js
.nojekyll
README.md
TUTORIAL.md
icons/
```

Wichtig: `index.html` muss direkt im Hauptordner liegen, nicht in einem Unterordner.

---

## 2. GitHub-Repository erstellen

1. Öffne `github.com`.
2. Melde dich an.
3. Oben rechts auf `+` klicken.
4. `New repository` wählen.
5. Repository-Name setzen, z. B.:

```text
multi-timer-app
```

6. Sichtbarkeit: `Public`.
7. `Create repository` klicken.

---

## 3. Dateien hochladen

Im neuen Repository:

1. `Add file` anklicken.
2. `Upload files` wählen.
3. Alle entpackten Dateien und den Ordner `icons` hochladen.
4. Unten bei Commit-Nachricht z. B. eintragen:

```text
Initial upload
```

5. `Commit changes` klicken.

Die Struktur im Repository muss so aussehen:

```text
multi-timer-app/
├─ index.html
├─ styles.css
├─ app.js
├─ manifest.webmanifest
├─ sw.js
├─ .nojekyll
├─ README.md
├─ TUTORIAL.md
└─ icons/
   ├─ icon-180.png
   ├─ icon-192.png
   └─ icon-512.png
```

---

## 4. GitHub Pages aktivieren

1. Im Repository oben `Settings` öffnen.
2. Links `Pages` anklicken.
3. Unter `Build and deployment` einstellen:

| Feld | Wert |
|---|---|
| Source | Deploy from a branch |
| Branch | main |
| Folder | /root |

4. `Save` klicken.

Nach kurzer Zeit zeigt GitHub eine URL an, ungefähr so:

```text
https://DEIN-GITHUB-NAME.github.io/multi-timer-app/
```

---

## 5. App am PC testen

Öffne die GitHub-Pages-Adresse am PC.

Prüfe:

| Prüfung | Erwartung |
|---|---|
| App lädt | Ja |
| Timer-Tab sichtbar | Ja |
| Schachuhr-Tab sichtbar | Ja |
| Boards öffnen | Ja |
| Timer startet per Klick | Ja |
| Sound-Test nach Klick | Ja |

---

## 6. App auf dem iPad öffnen

Auf dem iPad:

1. Safari öffnen.
2. Deine GitHub-Pages-Adresse eingeben.
3. App laden lassen.
4. `Ton aktivieren / testen` antippen.

---

## 7. App zum Home-Bildschirm hinzufügen

In Safari auf dem iPad:

1. Teilen-Symbol antippen.
2. `Zum Home-Bildschirm` wählen.
3. Namen prüfen, z. B. `Multi Timer`.
4. `Hinzufügen` antippen.

Danach erscheint ein App-Icon auf deinem iPad.

---

## 8. App benutzen

1. App über das neue Icon starten.
2. Einmal `Ton aktivieren / testen` antippen.
3. Timer oder Schachuhr auswählen.

---

## 9. Für zuverlässige Nutzung beim Spielen

Die Web-App funktioniert am zuverlässigsten, wenn das iPad aktiv bleibt.

Empfohlene Einstellung:

```text
Einstellungen → Anzeige & Helligkeit → Automatische Sperre → Nie
```

Falls `Nie` nicht verfügbar ist, liegt es oft an Energiesparmodus, Geräteverwaltung oder Familien-/Firmenprofil.

---

## 10. Bedienung

### Multi-Timer

| Aktion | Ergebnis |
|---|---|
| Timer antippen | Start / Pause / Fortsetzen |
| Timer 5 Sekunden halten | Timer bearbeiten |
| `+` antippen | Timer hinzufügen |
| `Boards` antippen | Timer-Zusammenstellungen verwalten |
| `Alle zurücksetzen` | Timer zurücksetzen |

### Schachuhr

| Aktion | Ergebnis |
|---|---|
| Spielerfläche antippen | Spieler beendet seinen Zug, anderer Timer startet |
| `Stopp / Pause` | Beide Zeiten pausieren |
| `Zurücksetzen` | Restzeit, Aktivzeit und Züge zurücksetzen |
| Spielerfläche 5 Sekunden halten | Schachuhr-Einstellungen öffnen |
| Zeit abgelaufen | Alarm maximal 10 Sekunden, danach ruhig |

---

## 11. Einschränkung

Diese App ist eine GitHub-Pages-PWA, keine native iOS-App.

| Situation | Verhalten |
|---|---|
| App sichtbar, Bildschirm an | Gut |
| Bildschirm ausgeschaltet | Nicht zuverlässig |
| App im Hintergrund | Nicht zuverlässig |
| App später wieder geöffnet | Zeit wird nachberechnet |

Für einen echten Hintergrund-Wecker bräuchte man eine native iOS-App oder Push-Infrastruktur.
