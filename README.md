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

**OverwatchAdapterService**
- **Node.js / Express** – eigenständiger Microservice für die Overwatch-Anbindung
- **MariaDB** – speichert Spielerdaten, Competitive Stats und detaillierte Stat-Snapshots
- **Overfast API** – externe API, von der wir die Spielerdaten ziehen

**Frontend**
- **React** – komponentenbasiertes UI
- **HTML / CSS** – Grundstruktur & Styling

**Datenbank**
- Über Entity Framework Core verwaltet – Modelle werden direkt aus den C#-Klassen generiert (Code-First)
- `gameService` DB – wird vom OverwatchAdapterService befüllt (Spieler, Ränge, Stat-Snapshots)
- `eventApp` DB – wird vom Backend verwaltet (User, Events, Teilnahmen)

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

## OverwatchAdapterService

Der OverwatchAdapterService ist unser eigenständiger Node.js-Microservice, der die Kommunikation mit der externen Overfast API übernimmt und die Daten in der `gameService`-Datenbank speichert. Das Frontend redet nicht direkt mit der externen API – alles läuft über diesen Service.

Der Service läuft auf Port **8081**, das Frontend proxied alle `/api/*`-Requests dorthin.

### Endpoints

| Methode | Pfad | Beschreibung |
|--------|------|-------------|
| `GET` | `/api/players/search/:query` | Spielersuche über die Overfast API |
| `GET` | `/api/players/summary/:playerId` | Holt die Profilzusammenfassung eines Spielers und speichert Rank-Daten in der DB |
| `GET` | `/api/players/stats/summary/:playerId` | Holt detaillierte Spielstatistiken und speichert einen Snapshot in der DB |

### Stats Endpoint im Detail

Den `/api/players/stats/summary/:playerId` Endpoint habe ich im Rahmen von [Issue #30](https://github.com/Ansarshirzad2r382/SportTracker/issues/30) implementiert. Er zieht die vollständigen Statistiken eines Spielers von der Overfast API und schreibt die Daten strukturiert in zwei Tabellen:

- **`STATS_SNAPSHOT`** – Ein Zeitstempel-Eintrag pro Abruf, verknüpft mit dem Spieler
- **`STAT_BLOCK`** – Die eigentlichen Zahlen pro Kategorie (general, role, hero) – Spiele, Winrate, KDA, Damage, Healing, Eliminations usw.

**Wichtig:** Der Spieler muss vorher mindestens einmal über `/api/players/summary/:playerId` geladen worden sein, damit er in der `PLAYER`-Tabelle existiert. Der Stats-Endpoint gibt sonst eine sprechende 404-Fehlermeldung zurück.

### Datenbankschema (gameService)

```
PLAYER              – Basisdaten: PlayerId, Username, Avatar, EndorsementLevel
COMPETITIVE_STAT    – Competitive-Saison pro Plattform (pc/console)
ROLE_RANK           – Rank pro Rolle (tank/damage/support) je Competitive-Eintrag
STATS_SNAPSHOT      – Zeitstempel eines Stat-Abrufs, FK auf PLAYER
STAT_BLOCK          – Detailwerte pro Snapshot: GamesPlayed, Winrate, KDA, Damage, Healing ...
```

---

## PlayerStatPage – Statistikanzeige

Die `PlayerStatPage` zeigt alles, was wir über einen Spieler wissen. Sie lädt zwei API-Calls parallel: einmal `/summary` für Profil und Ranks, einmal `/stats/summary` für die detaillierten Statistiken.

### Was wird angezeigt?

**Profilbereich**
- Avatar, Username, Namecard als Hintergrundbild, Endorsement Level

**Ranks**
- Alle Competitive-Ränge des Spielers, aufgeteilt nach Plattform (PC/Console) und Rolle (Tank, Damage, Support) mit Season-Angabe und Rank-Icons

**Hero Playtime**
- Übersicht der gespielten Heroes mit ihrer Spielzeit

**Allgemeine Statistiken** *(neu)*
- 8 Stat-Karten: Gesamtspiele, Winrate, KDA, Spielzeit, Gewonnen/Verloren, Eliminations, Damage, Healing

**Role Breakdown** *(neu)*
- Je eine Karte für Tank, Damage und Support mit den wichtigsten Werten: Spiele, Winrate, KDA, Spielzeit, Ø Eliminations, Ø Damage

**Top Heroes** *(neu)*
- Tabelle der Top 15 Heroes nach Spielanzahl mit Winrate (grün ≥ 50% / rot < 50%), KDA und Ø Damage

Die Stats-Sektionen werden nur angezeigt, wenn die API Daten zurückgibt – läuft die Stats-API nicht oder hat der Spieler noch keinen Snapshot, bleibt die Seite trotzdem funktionsfähig.

---

## Wo stehen wir gerade?

- [x] Projektidee & Scope definiert
- [x] Erstes Datenmodell skizziert
- [x] ASP.NET Core API – Authentifizierung (Google OAuth + JWT)
- [x] React Frontend – LoginPage, Dashboard, PlayerSearch
- [x] Spieler-Dashboard (Grundstruktur)
- [x] Spielersuche via Overwatch API
- [x] OverwatchAdapterService – Spielersuche & Summary-Endpoint mit DB-Persistierung
- [x] Stats-Endpoint (`/api/players/stats/summary/:playerId`) – speichert Snapshots in gameService DB
- [x] PlayerStatPage – Allgemeine Statistiken, Role Breakdown, Top Heroes
- [ ] API-Anbindung (z. B. Riot API für LoL)
- [ ] Erweiterung auf weitere Spiele

---

## Projektstruktur

```
sportracker/
├── README.md
├── docker-compose.yaml
├── .gitignore
├── /backend                            ← ASP.NET Core API (Auth, Events)
│   ├── /Controllers
│   │   └── AuthController.cs           ← Google OAuth + JWT
│   ├── /Models                         ← EF Core Entitäten
│   ├── /Data
│   │   └── AppDbContext.cs             ← DbContext (eventApp DB)
│   ├── appsettings.json
│   └── appsettings.Development.json    ← Secrets (nicht im Repo)
├── /frontend                           ← React App (Vite)
│   ├── /src
│   │   ├── /components
│   │   │   └── ProtectedRoute.jsx      ← Route-Schutz
│   │   ├── /pages
│   │   │   ├── LoginPage.jsx           ← Google Login
│   │   │   ├── Dashboard.jsx           ← Hauptseite (geschützt)
│   │   │   ├── PlayerSearch.jsx        ← Spielersuche
│   │   │   ├── PlayerStatPage.jsx      ← Spielerprofil + Statistiken
│   │   │   └── PlayerBox.jsx           ← Suchergebnis-Komponente
│   │   ├── /tools
│   │   │   └── OverwatchApiHandler.js  ← API-Client (search, summary, stats/summary)
│   │   └── App.jsx                     ← Routing
│   └── vite.config.js
├── /overwatchAdapter                   ← Node.js Microservice (Port 8081)
│   ├── app.js                          ← Express App + Routing
│   ├── db.js                           ← MariaDB Connection Pool
│   └── /src/controller
│       └── PlayerController.js         ← searchPlayer, summary, stats
└── /doc                                ← Dokumentation & DB-Schemas
    ├── gameservice.sql
    └── eventApp.sql
```

---

*Fach: Softwareentwicklung – Stand: Juni 2026*
