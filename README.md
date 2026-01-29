<div align="center">

# 📊 FinTrack - Buchhaltungssoftware

**Moderne Buchhaltungslösung für kleine und mittelständische Unternehmen**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

[Funktionen](#-funktionen) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Technologien](#-technologien) • [Lizenz](#-lizenz)

</div>

---

## 🎯 Übersicht

FinTrack ist eine leistungsstarke, benutzerfreundliche Buchhaltungssoftware, die speziell für kleine und mittelständische Unternehmen entwickelt wurde. Mit einem modernen Glasmorphismus-Design und einer intuitiven Benutzeroberfläche ermöglicht FinTrack eine effiziente Verwaltung von Finanzen, Rechnungen und Geschäftsbeziehungen.

---

## ✨ Funktionen

### 📈 Dashboard
- **Echtzeit-Übersicht** über Gesamtumsatz, offene Rechnungen, Ausgaben und Gewinn
- **Interaktive Diagramme** für Umsatzentwicklung und Ausgabenverteilung
- **Drag & Drop Widgets** für individuelle Dashboard-Anpassung
- **Schnellaktionen** für häufige Aufgaben

### 👥 Kundenverwaltung
- Erstellen und verwalten von Kundenprofilen
- Kontaktinformationen, Adressen und Steuernummern
- Übersichtliche Kundenliste mit Suchfunktion

### 🏢 Lieferantenverwaltung
- Komplette Lieferantendatenbank
- Geschäftspartner-Informationen zentral verwalten
- Schneller Zugriff auf Kontaktdaten

### 📄 Rechnungsstellung
- Professionelle Rechnungserstellung
- Automatische Mehrwertsteuerberechnung
- Status-Tracking (Offen, Bezahlt, Überfällig)
- Rechnungshistorie und -verwaltung

### 💳 Zahlungsmanagement
- Zahlungseingänge und -ausgänge verfolgen
- Verknüpfung mit Bankkonten
- Übersichtliche Transaktionslisten

### 📊 Berichte & Analysen
- Gewinn- und Verlustrechnung (GuV)
- Umsatzsteuer-Voranmeldung
- Visuelle Datenanalysen mit Chart.js

### 📁 Kontenplan
- Strukturierte Kategorisierung von Einnahmen und Ausgaben
- Übersichtlicher Kontenrahmen
- Einfache Buchungszuordnung

---

## 📸 Screenshots

<div align="center">

![Dashboard](Buchhaltung_App-main/Screenshot%202025-11-24%20145505.png)

*Modernes Dashboard mit Glasmorphismus-Design*

</div>

---

## 🚀 Installation

### Voraussetzungen

- **Node.js** (Version 18 oder höher)
- **npm** oder **yarn**

### Schnellstart

```bash
# Repository klonen
git clone https://github.com/Bennidesign2003/Buchhaltung_App.git

# In das Projektverzeichnis wechseln
cd Buchhaltung_App/Buchhaltung_App-main

# Abhängigkeiten installieren
npm install

# Datenbank initialisieren
npm run db:push

# Entwicklungsserver starten
npm run dev
```

> **Hinweis:** Der Quellcode befindet sich im Unterordner `Buchhaltung_App-main/`.

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Produktions-Build

```bash
# Build erstellen
npm run build

# Produktionsserver starten
npm start
```

---

## 🛠 Technologien

| Kategorie | Technologie |
|-----------|-------------|
| **Frontend** | Next.js, React, TypeScript |
| **Styling** | Tailwind CSS, Glasmorphismus-Design |
| **Datenbank** | SQLite mit Drizzle ORM |
| **Diagramme** | Chart.js, react-chartjs-2 |
| **Icons** | Heroicons |
| **Linting** | ESLint, Prettier |

---

## 📁 Projektstruktur

```
Buchhaltung_App-main/
├── components/          # React-Komponenten
│   ├── Dashboard*.tsx   # Dashboard-Widgets
│   ├── *Modal.tsx       # Modal-Dialoge
│   └── *Chart.tsx       # Diagramm-Komponenten
├── pages/               # Next.js Seiten
│   ├── api/             # API-Routen
│   ├── customers.tsx    # Kundenverwaltung
│   ├── invoices.tsx     # Rechnungen
│   └── ...
├── db/                  # Datenbank-Schema
├── lib/                 # Hilfsfunktionen
└── styles/              # Globale Styles
```

---

## 📜 Verfügbare Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet den Entwicklungsserver |
| `npm run build` | Erstellt den Produktions-Build |
| `npm start` | Startet den Produktionsserver |
| `npm run lint` | Führt ESLint aus |
| `npm run db:push` | Synchronisiert das Datenbankschema |
| `npm run db:studio` | Öffnet Drizzle Studio |

---

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte erstelle einen Fork des Repositories und reiche einen Pull Request ein.

1. Fork erstellen
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

<div align="center">

**Entwickelt mit ❤️ für effizientes Finanzmanagement**

</div>