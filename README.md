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

## Wo stehen wir gerade?

Wir sind am Anfang. Das Datenmodell steht soweit, der Rest ist Work in Progress:

- [x] Projektidee & Scope definiert
- [x] Erstes Datenmodell skizziert
- [ ] Datenbankschema & EF-Migrationen aufsetzen
- [ ] ASP.NET Core API – erste Endpoints
- [ ] React Frontend – erste Seiten & Komponenten
- [ ] Spieler-Dashboard bauen
- [ ] API-Anbindung (z. B. Riot API für LoL)
- [ ] Erweiterung auf weitere Spiele

---

## Projektstruktur

```
sportracker/
├── README.md
├── .gitignore
├── /backend             ← ASP.NET Core API
│   ├── /Controllers
│   ├── /Models          ← EF Core Entitäten
│   └── /Data            ← DbContext & Migrationen
├── /frontend            ← React App
│   ├── /components
│   └── /pages
└── /doc                 ← Dokumentation & Diagramme
```

---
---

*Fach: Softwareentwicklung – Stand: März 2026*
