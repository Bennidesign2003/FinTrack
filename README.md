# Buchhaltungssoftware - Version 0 (V0)

![Buchhaltungssoftware Logo](https://cdn3d.iconscout.com/3d/premium/thumb/accounting-3d-icon-png-download-8149531.png)

**Beschreibung**  
Diese Buchhaltungssoftware bietet eine einfache und benutzerfreundliche Lösung für kleine und mittelständische Unternehmen zur Verwaltung ihrer Finanzen. Version 0 (V0) umfasst grundlegende Funktionen für die Rechnungsstellung, Zahlungsverarbeitung, Kunden- und Lieferantenverwaltung sowie einfache Finanzberichte.

---

## Schnellstart: Next.js App

Dieses Repository enthält jetzt ein Scaffold für eine Next.js-Anwendung mit TypeScript und Tailwind CSS.

1. Abhängigkeiten installieren

```bash
cd /workspaces/Buchhaltung_App
npm install
```

2. Dev-Server starten

```bash
npm run dev
```

3. Öffne im Browser: `http://localhost:3000`

Die App enthält Beispielseiten:

- `pages/index.tsx` — Startseite
- `pages/about.tsx` — Beispielseite
- `pages/api/hello.ts` — Beispiel-API-Route

Eine MongoDB-Verbindungs-Hilfe befindet sich in `lib/mongodb.ts` (verwende `MONGODB_URI` Umgebungsvariable).

---

## Features

- **Kundenverwaltung:** Erstellen und verwalten von Kundenprofilen mit relevanten Informationen (Name, Adresse, Steuernummer).
- **Lieferantenverwaltung:** Speichern von Lieferanteninformationen zur Verwaltung von Geschäftspartnerschaften.
- **Rechnungsstellung:** Erstellen und verwalten von Rechnungen, mit Rechnungsnummer, Beträgen und Mehrwertsteuerberechnung.
- **Zahlungsbuchungen:** Verwalten von Zahlungseingängen und -ausgängen sowie Verknüpfung mit Bankkonten.
- **Finanzberichte:** Generierung einer einfachen Gewinn- und Verlustrechnung (GuV) sowie Umsatzsteuer-Voranmeldung.
- **Kontenplan:** Kategorisierung von Einnahmen und Ausgaben in einem strukturierten Kontenplan.
- **Datensicherung:** Automatische Sicherung der Daten zur Vermeidung von Datenverlust.

---

## Technologien

Diese Buchhaltungssoftware nutzt unter anderem folgende Technologien:

### Frontend:
- **React / Next.js** (für die Benutzeroberfläche)
- **Tailwind CSS** (für Design und Layout)

### Backend / Sonstiges:
- **Node.js** (für die Serverlogik)
- **Next.js API Routes** (für einfache Server-APIs)
- **MongoDB / Mongoose** (DB-Zugang als Template)

## Installation (ausführlich)

### Voraussetzungen

- Node.js (Version 14 oder höher)
- Optional: MongoDB (lokale Instanz oder MongoDB Atlas) wenn du DB-Funktionen testen willst

### Schritte zur Installation

1. **Repository klonen** (falls noch nicht geschehen)

```bash
git clone <dein-repo-url>
cd Buchhaltung_App
```

2. **Abhängigkeiten installieren**

```bash
npm install
```

3. **Dev-Server starten**

```bash
npm run dev
```

4. **Build & Produktion**

```bash
npm run build
npm run start
```

---

Wenn du möchtest, richte ich jetzt optional ein vollständiges Auth-/DB-Beispiel ein oder binde spezifische Features (Rechnungen, Kunden-CRUD etc.).