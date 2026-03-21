

## Bewertung deiner Ideen

Starke Auswahl! Hier meine Einschätzung zu jedem Modul:

| Modul | Machbarkeit | Anmerkung |
|-------|-------------|-----------|
| **Problemlösung (VDI 2221/2222 + iPeM/SPALTEN)** | Hoch | Interaktive Checklisten, Schritt-für-Schritt-Workflows — passt perfekt |
| **O-Ring-Auslegung** | Hoch | Berechnungslogik mit Eingabefeldern, Handbuch-Daten hinterlegbar |
| **Schadenskunde + Bildanalyse** | Mittel-Hoch | Katalog mit Schadensbildern machbar; KI-Bildanalyse über Lovable AI (Gemini) möglich |
| **Fertigungsmesstechnik / Tolerierung** | Hoch | Toleranzrechner nach ISO 286-1, Passungssysteme — sehr gut umsetzbar |
| **Normen-Übersicht** | Hoch | Filterbares Verzeichnis mit Kategorien, Suchfunktion |
| **Projektplanung / Gantt** | Mittel | Gantt-Darstellung machbar, Export als Template realistisch |
| **Hydraulik-Auslegung** | Hoch | Berechnungsformulare für Druck, Durchfluss, Zylinder etc. |
| **Template-Datenbank** | Hoch | Download-Bereich für Excel/PDF-Vorlagen |

---

## Plan: Startseite um neue Modul-Kacheln erweitern

### Konzept
Die Startseite wird von einem 2-Spalten-Grid auf ein responsives Multi-Kachel-Grid umgebaut. Die beiden bestehenden Module (Materialdatenbank, Auslegungsassistent) bleiben. Die neuen 8 Module werden als Kacheln hinzugefügt — zunächst mit einem "Kommt bald"-Status, damit du sie Schritt für Schritt mit Inhalt füllen kannst.

### Änderungen

**Datei: `src/pages/HomePage.tsx`**
- Grid-Layout ändern: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` für kompakte Kacheln
- Titel und Beschreibung anpassen: "Engineering Toolkit" statt nur "MaterialSelect"
- Kachel-Daten als Array definieren (Titel, Icon, Route, Beschreibung, Status `active`/`coming_soon`)
- Aktive Module verlinken, "Kommt bald"-Module mit Badge und deaktiviertem Link
- Layout scrollbar machen (kein `justify-center` mehr, da >2 Kacheln)
- Jede Kachel bekommt einen eigenen Farbakzent (verschiedene Blau-/Grautöne)

**Neue Module-Kacheln:**

| Kachel | Icon | Route (vorbereitet) |
|--------|------|---------------------|
| Problemlösung (VDI/iPeM) | `Lightbulb` | `/methodik` |
| O-Ring-Auslegung | `Circle` | `/oring` |
| Schadenskunde | `Search` | `/schadenskunde` |
| Tolerierung & Messtechnik | `Ruler` | `/tolerierung` |
| Normen-Übersicht | `BookOpen` | `/normen` |
| Projektplanung | `GanttChart` | `/projektplanung` |
| Hydraulik-Auslegung | `Droplets` | `/hydraulik` |
| Template-Datenbank | `FolderDown` | `/templates` |

**Datei: `src/App.tsx`**
- Placeholder-Routen für die neuen Module anlegen (zeigen zunächst eine "Kommt bald"-Seite)

**Neue Datei: `src/pages/ComingSoonPage.tsx`**
- Einfache Platzhalter-Seite mit Modulname und "In Entwicklung"-Hinweis

### Ergebnis
Die Startseite zeigt alle 10 Module als übersichtliches Kachel-Grid. Die beiden bestehenden sind voll funktional, die 8 neuen haben ein "Kommt bald"-Badge und eine Platzhalter-Seite. Du kannst dann Modul für Modul sagen, welches wir als nächstes mit Leben füllen.

