# SportTracker

Willkommen bei **SportTracker** – einem Projekt, das wir gemeinsam im Rahmen des Fachs **Softwareentwicklung** umsetzen.

Die Idee ist simpel: Eine Webplattform, die Spielerstatistiken trackt – und zwar nicht nur für ein Spiel, sondern für viele. Wir fangen klein an und bauen das Ding Schritt für Schritt aus.

---

## Was soll die Seite können?

Im Kern geht es darum, dass Spieler ihre Performance nachverfolgen können. Dazu gehören Dinge wie Rang-Verlauf, Match-Historien, Kills, Deaths, Gold – also alles, was man nach einem Match wissen will.

Das System ist modular aufgebaut, damit wir neue Spiele später einfach ergänzen können, ohne alles neu schreiben zu müssen.

---

## Für welche Spiele?

Aktuell orientieren wir uns an **League of Legends(Als Bsp genommen)** als Einstieg, weil das Datenmodell dort schön passt. Geplant sind u. a.:

- League of Legends *(erster Fokus)*
- Valorant
- CS2
- Apex Legends
- *...und was noch dazukommt*

---

## Technologien

Hier ist, womit wir arbeiten:

**Backend**
- [ASP.NET Core](https://learn.microsoft.com/aspnet/core) (.NET) – REST API, Routing, Business Logic
- **Entity Framework Core** – ORM für die Datenbankanbindung, Migrationen und Modellierung der Entitäten

**Frontend**
- **React** – komponentenbasiertes UI
- **HTML / CSS** – Grundstruktur & Styling

**Datenbank**
- Über Entity Framework Core verwaltet – Modelle werden direkt aus den C#-Klassen generiert (Code-First)

---

## Wichtige Entitäten (Auszug)

Hier ein kurzer Überblick über die zentralen Bausteine unseres Datenmodells – nicht alle, aber die, die den Kern des Systems ausmachen.

### `Spieler`
Der registrierte Nutzer auf der Plattform. Speichert spielbezogene Kennzahlen wie **Kills**, **Deaths** und **Gold** pro Match.

### `Summoner`
Der In-Game-Account des Spielers. Hier hängen der aktuelle **Rank** sowie die **Historie** vergangener Ränge dran – also das, was man auf Profil-Seiten typischerweise sieht.

```csharp
public class Summoner
{
    public int Id { get; set; }
    public string Rank { get; set; }
    public string Zusatz { get; set; }
    public List<string> Historie { get; set; }

    public int SpielerId { get; set; }
    public Spieler Spieler { get; set; }
}
```

### `Spiel`
Repräsentiert ein einzelnes Match. Enthält **Zeit** (Zeitstempel / Dauer) und eine Referenz auf die zugehörige **Statistik**.

### `Champion`
Verknüpft einen Spieler mit dem gewählten Charakter in einem Match. Bildet die Grundlage für champion-spezifische Auswertungen.

> Die restlichen Entitäten (Farm, Produkte, NPCs, ...) folgen im weiteren Verlauf des Projekts.

---

## Authentifizierung (Login)

Die Plattform verwendet **Google OAuth 2.0** für die Anmeldung.

### Flow

1. User klickt auf "Mit Google anmelden"
2. Weiterleitung zu Google → User meldet sich an
3. Backend empfängt Google-Antwort, liest Name & E-Mail aus
4. User wird in der Datenbank gespeichert (falls neu)
5. Backend stellt einen **JWT Token** aus
6. Frontend speichert den Token in `localStorage`
7. Geschützte Seiten (z. B. Dashboard) prüfen ob ein Token vorhanden ist

### Wichtige Dateien

| Datei | Beschreibung |
|-------|-------------|
| `backend/Controllers/AuthController.cs` | Google OAuth Endpoints (`/auth/google/login`, `/auth/google/finalize`, `/auth/logout`) |
| `backend/Program.cs` | Auth-Konfiguration (Cookie, Google, CORS) |
| `backend/appsettings.Development.json` | Secrets (Google ClientId/Secret, JWT Key) – nicht im Repository |
| `frontend/src/pages/LoginPage.jsx` | Login-Seite, liest JWT aus URL nach OAuth-Redirect |
| `frontend/src/components/ProtectedRoute.jsx` | Schützt Routen – leitet zu `/login` weiter wenn kein Token vorhanden |
| `frontend/src/pages/Dashboard.jsx` | Dashboard mit Logout-Funktion und E-Mail-Anzeige |

---

## Wo stehen wir gerade?

- [x] Projektidee & Scope definiert
- [x] Erstes Datenmodell skizziert
- [x] ASP.NET Core API – Authentifizierung (Google OAuth + JWT)
- [x] React Frontend – LoginPage, Dashboard, PlayerSearch
- [x] Spieler-Dashboard (Grundstruktur)
- [x] Spielersuche via Overwatch API
- [ ] API-Anbindung (z. B. Riot API für LoL)
- [ ] Erweiterung auf weitere Spiele

---

## Projektstruktur

```
sportracker/
├── README.md
├── .gitignore
├── /backend                        ← ASP.NET Core API
│   ├── /Controllers
│   │   └── AuthController.cs       ← Google OAuth + JWT
│   ├── /Models                     ← EF Core Entitäten
│   ├── /Data
│   │   └── AppDbContext.cs         ← DbContext
│   ├── appsettings.json
│   └── appsettings.Development.json ← Secrets (nicht im Repo)
├── /frontend                       ← React App (Vite)
│   ├── /src
│   │   ├── /components
│   │   │   └── ProtectedRoute.jsx  ← Route-Schutz
│   │   ├── /pages
│   │   │   ├── LoginPage.jsx       ← Google Login
│   │   │   ├── Dashboard.jsx       ← Hauptseite (geschützt)
│   │   │   ├── PlayerSearch.jsx    ← Spielersuche
│   │   │   └── PlayerBox.jsx       ← Suchergebnis-Komponente
│   │   ├── /tools
│   │   │   └── OverwatchApiHandler.js ← API-Client
│   │   └── App.jsx                 ← Routing
│   └── vite.config.js
└── /doc                            ← Dokumentation & Diagramme
```

---
---

*Fach: Softwareentwicklung – Stand: März 2026*
