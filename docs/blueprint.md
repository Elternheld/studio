# **App Name**: ElternHeld - parenting simplified

## Core Features:

- Activity Generator: Generate activity ideas based on child's age, location (indoor/outdoor), weather, and available time using a LLM tool.
- Structured Activity Display: Display generated activity with title, description, step-by-step instructions, material list, estimated costs, safety tips, educational benefits, and a generated image.
- Voice-to-Text Brainstorming: Implement a voice-to-text interface for brainstorming activity ideas with an LLM tool, allowing parents to ask questions and receive suggestions.
- Activity Log: Allow parents to view a log of completed activities, connected to their user profile and child's data.

## Style Guidelines:

- Primary color: Soft Green (#A7D1AB) for a calm and nurturing feel.
- Secondary color: Light Yellow (#F9E79F) for highlighting important elements.
- Accent: Coral (#FF7F50) for interactive elements and calls to action.
- Clear and readable typography suitable for parents.
- Use playful and intuitive icons to represent activity types and categories.
- Clean and structured layout for easy navigation and content consumption.

## Original User Request:

🎯 Ziel der App:
ElternHeld hilft Eltern, kreative, altersgerechte und bedeutungsvolle Aktivitäten für ihre Kinder zu entdecken und umzusetzen – unterstützt durch künstliche Intelligenz (LLMs), Community-Erfahrung und visuelle Inspiration.

🧩 Hauptfunktionen:
1. 🔍 Aktivitäts-Konfigurator
Eltern geben ein:

Alter des Kindes

Ort (drinnen/draußen)

Wetter

verfügbare Zeit

👉 Die App generiert mit einem LLM (z. B. GPT-4o, Claude, Mistral) eine passende Aktivität.

2. 📝 Vorschläge mit Struktur
Jede Aktivität enthält:

Titel & Beschreibung

Schritt-für-Schritt-Anleitung

benötigte Materialien + geschätzte Kosten

Sicherheitshinweise

pädagogische Förderung (kognitiv, motorisch etc.)

passendes Bild (z. B. via DALL·E 3)

3. 🧠 Voice-to-Voice Sprachbot
Brainstorming-Sessions mit einem LLM (gesprochen, transkribiert)

Eltern können dem Bot Fragen stellen („Was kann ich mit einem 4-jährigen bei Regen machen?“)

4. 🌟 Community-Bereich
Eltern posten ihre Erfahrungen

Sternebewertungen, Kommentare, Bilder

Like/Antwort-Funktionen

5. 📊 Fortschritt & Dashboard
Eltern sehen, welche Aktivitäten sie abgeschlossen haben

Verknüpft mit dem Nutzerprofil & Kinddaten

6. ⚙️ Modellwahl & API-Management (Advanced)
User können zwischen mehreren LLMs wählen (OpenAI, Anthropic, etc.)

API-Key-Verwaltung (mehrere Modelle testen / vergleichen)

🎨 Design & Branding
Zielgruppe: Eltern von Kindern (0–10 Jahre), digital-affin

Look & Feel: freundlich, vertrauensvoll, kindgerecht, professionell

Stil: klare Struktur, verspielte Illustrationen, Icons & Farben

🚀 Was die App besonders macht:
AI-gestützt und trotzdem warm & menschlich

personalisiert nach Familiensituation

modular, zukunftssicher (mehr Produkte möglich)

auf Elternalltag optimiert (schnell, mobil, hilfreich)

/////

Für das backend:
Erstelle ein skalierbares Backend mit Firebase (Firestore, Cloud Functions, Auth und optional Cloud Storage) für eine App namens „ElternHeld“.

### 🔧 Allgemeines Setup:

- Nutze Firebase Cloud Functions (TypeScript)
- Verwende Firestore als Datenbank (im Native-Modus)
- Authentifizierung über Firebase Auth (JWT basiert)
- Jeder Nutzer erhält eine eigene API-Key-Verwaltung (Key-Rotation möglich)
- Medienuploads erfolgen optional über Cloud Storage
- Voice-Transkription & LLM-Aufrufe laufen über externe APIs (OpenAI, Anthropic, etc.)

### 📂 Firestore Collections (mit Feldern):

#### users
- id (string, UID von Firebase Auth)
- name (string)
- email (string)
- selectedLLM (string)
- activeApiKey (reference → api_keys)
- children (array of map: { name: string, age: number })
- createdAt (timestamp)

#### api_keys
- id (string)
- provider (string)
- model (string)
- key (string) → nicht in Firestore speichern, sondern sicher z. B. in Secret Manager oder Cloud Function Env
- userId (reference → users)
- isActive (boolean)
- createdAt (timestamp)

#### activities
- id (string)
- title (string)
- description (string)
- instructions (string)
- materials (array of string)
- costEstimate (number)
- safetyTips (string)
- benefits (array of string)
- imageUrl (string)
- createdBy (reference → users)
- generatedBy (string, Modellname)
- createdAt (timestamp)

#### activity_configs
- id (string)
- ageGroup (string)
- indoorOutdoor (string)
- weather (string)
- timeAvailable (number)
- llmModel (string)
- userId (reference → users)
- usedAt (timestamp)

#### activity_feedback
- id (string)
- activityId (reference → activities)
- userId (reference → users)
- rating (number)
- comment (string)
- timestamp (timestamp)

#### community_posts
- id (string)
- content (string)
- authorId (reference → users)
- imageUrl (string)
- timestamp (timestamp)

#### progress_tracking
- id (string)
- userId (reference → users)
- activityId (reference → activities)
- status (string: started, completed)
- notes (string)
- timestamp (timestamp)

#### voice_sessions
- id (string)
- userId (reference → users)
- transcription (string)
- summary (string, generated)
- modelUsed (string)
- createdAt (timestamp)

#### media_uploads (optional)
- id (string)
- url (string)
- type (string: image/audio)
- linkedTo (reference → activities | community_posts)
- userId (reference → users)
- timestamp (timestamp)

### 🔐 Firestore Security Rules:

- Nur authentifizierte Nutzer dürfen schreiben
- Nutzer dürfen nur auf eigene `api_keys`, `progress_tracking`, `voice_sessions` und `activity_feedback` schreiben/lesen
- Alle `activities` und `community_posts` sind öffentlich lesbar
- Admin-Funktionalitäten sollen über Rolle realisiert werden (z. B. `customClaims.admin == true`)

### 🛠 Bereitgestellte API-Funktionen (Cloud Functions Endpunkte):

- `/users` [GET, PATCH]
- `/api_keys` [POST, PATCH]
- `/activities` [GET, POST (generieren via LLM)]
- `/activity_configs` [POST]
- `/activity_feedback` [POST, GET?activityId=]
- `/progress_tracking` [POST, GET?userId=]
- `/community_posts` [POST, GET]
- `/voice_sessions` [POST (Whisper Transkript starten), GET]
- `/media_uploads` [POST, GET]

### 💡 Zusatzfeatures:

- REST-API-Endpunkte via Express.js in Firebase Functions
- Authentifizierung über Middleware (`verifyIdToken`)
- Modularer LLM-Service: Aufruf an OpenAI, Anthropic, Mistral per Model-Name + API-Key des Users
- Key-Rotation: User kann aktive API-Key ändern
- Alle Medien-Dateien (Bilder, Audios) werden in Firebase Storage gespeichert
- Unterstütze Whisper (Transkription) und DALL·E (Bildgenerierung) optional als Cloud Function Hooks

Erzeuge die Projektstruktur, API-Endpunkte, Beispiel-Funktionen (z. B. `generateActivity()` via LLM), passende Firestore-Abfragen sowie sichere Zugriffskontrollen. 
Berücksichtige Skalierbarkeit, Clean Code, Wiederverwendbarkeit und Trennung von Logik (Routing, Services, Middleware).

/////
Für das Frontend:
wird in v0.dev erstellt und gehostet - bitte im backend berücksichtigen
  
  