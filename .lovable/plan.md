

## Problem

In `src/main.tsx` werden die Pakete `@fontsource/ibm-plex-sans` und `@fontsource/ibm-plex-mono` importiert (Zeilen 4-7), aber diese Pakete sind **nicht in `package.json`** als Abhängigkeiten installiert. Lediglich `@fontsource/ibm-plex-mono` ist vorhanden — `@fontsource/ibm-plex-sans` fehlt komplett.

Gleichzeitig wurden die Schriftarten im letzten Design-Update auf **Inter** und **JetBrains Mono** umgestellt (per Google Fonts in `index.css`). Die `@fontsource`-Imports in `main.tsx` sind also **überflüssig** und verursachen den Build-Fehler.

## Fix

1. **Alle `@fontsource`-Imports aus `src/main.tsx` entfernen** (Zeilen 4-7 löschen)
2. **`@fontsource/ibm-plex-mono` aus `package.json` entfernen**, da es nicht mehr gebraucht wird

Die Schriftarten Inter und JetBrains Mono werden bereits korrekt über den Google Fonts Import in `src/index.css` geladen.

