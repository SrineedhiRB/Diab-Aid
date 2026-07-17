# SmartSense FootGuard Pro — Full Build Spec
Hackathon MVP version, customized from the original master prompt to match what's actually buildable and what's already built.

---

## 1. PROJECT IDENTITY

**Name:** SmartSense FootGuard Pro
**Tagline:** Monitor Every Step. Prevent Every Ulcer.
**One-liner:** AI-powered real-time diabetic foot ulcer risk monitoring, using simulated IoT pressure/temperature sensing and a clinical risk-scoring engine.
**Audience:** Doctors and clinical staff at a diabetes care center monitoring multiple patients remotely.

---

## 2. DESIGN SYSTEM

### Colors
| Token | Hex | Use |
|---|---|---|
| `--bg-0` | `#0B1220` | App base background |
| `--bg-1` | `#0F172A` | Login gradient base |
| `--bg-2` | `#111827` | Sidebar background |
| `--panel` | `#1E293B` | Card surfaces |
| `--blue` | `#3B82F6` | Primary actions, live status, links |
| `--green` | `#22C55E` | Low risk, healthy, connected states |
| `--orange` | `#F97316` | Moderate/elevated risk |
| `--red` | `#DC2626` | High/critical risk, alerts |
| `--purple` | `#A855F7` | AI features accent |

### Typography
- Font family: Inter / system-ui sans-serif throughout
- Headline weight: 700, tight letter-spacing (-0.02em)
- Body: 13-15px, `--text-mid: #94A3B8` for secondary text
- Never mix serif into this design — hospital software is functional, not editorial

### Visual language
- Glassmorphism cards: `rgba(30,41,59,0.55)` background + `blur(14-20px)` + 1px hairline border `rgba(148,163,184,0.14)`
- Border radius: 18px cards, 10-14px inputs/chips
- Motion: pulse animation on live indicators, blink on critical states only, smooth `transform: translateY` on card hover — nothing more elaborate. Restraint matters here; this is clinical software, not a marketing site.

---

## 3. PAGES & SECTIONS (build order = priority order)

### 3.1 Login Page — ✅ built
- Split layout: left = brand + headline + stats, right = login card
- Fields: email, password, remember me, forgot password link
- Demo credentials shown on card: `doctor@diabhelp.ai` / `Doctor@123`
- No real auth required for demo — hardcoded credential check is fine

### 3.2 Dashboard Home — ✅ built
- Top navbar: search bar, live connection pill, notification bell with count, doctor avatar
- Greeting: "Good Morning, Dr. [Name]" + one-line context
- 5 stat cards: Total Patients, Active Sensors, High Risk, Critical Cases, AI Engine status
- Patient strip: horizontally scrollable chips, each showing name, ID, age/gender, risk badge — click to select

### 3.3 Live Sensor Monitoring — ✅ built
- 4 sensor tiles: Pressure (kPa), Temperature (°C), Humidity (%), Battery (%)
- Live-updating line chart of pressure over last 60 seconds
- "Last updated" timestamp that visibly refreshes

### 3.4 Risk Engine panel — ✅ built
- Large risk % number, color-coded to category
- Risk badge: LOW / MODERATE / HIGH / CRITICAL
- Plain-language explanation sentence generated from the actual pressure/temp delta values (not static text)
- Confidence %, trend direction, estimated ulcer onset window

### 3.5 Pressure Heatmap — ✅ built
- Stylized SVG foot outline, left + right
- 4 zones per foot: toe, forefoot, midfoot, heel
- Color scales green → orange → red by load %
- Critical zones blink
- Hover tooltip shows zone name + load %

### 3.6 AI Clinical Assistant — ✅ built (mocked, real version provided separately)
- "Generate AI Summary" button
- Streams a structured clinical note: Risk Level / Findings / Likely Cause / Recommended Action
- Currently template-generated client-side; `gemini-integration.js` has the real Gemini API call to swap in

### 3.7 Alert Center — ✅ built
- Auto-populates when a patient crosses High or Critical risk
- Each alert: patient name, ID, risk category, pressure/temp snapshot, time-ago
- Critical alerts visually distinct (red border + tint)

### 3.8 Sidebar navigation — ✅ built (shell only)
Dashboard, Patients, Live Monitoring, AI Prediction, Heatmap, Alerts, Analytics, Reports, Messages, Appointments, Settings, Logout — only Dashboard is fully wired; the rest are visual placeholders for now (this is intentional — see roadmap).

---

## 4. NOT YET BUILT — do these next, in this order, only if time allows

1. **Patients page** — full list/grid view of all patients with filters (risk, ward, doctor) — reuses the patient-chip component, just needs a dedicated route and filter bar
2. **Patient Profile page** — full detail view: photo, vitals, HbA1c, medication, medical notes, appointment history
3. **Reports** — one downloadable PDF using the AI summary text as the report body (skip Excel/CSV, skip Tamil translation)
4. **Settings** — just a threshold-configuration form (pressure/temp cutoffs) — this doubles as a nice "clinician can tune the model" talking point for judges
5. Everything else in the original spec (Messages, Appointments, Analytics suite, multi-role auth, Sarvam AI, Telegram/SMS/voice) — **explicitly out of scope**, list as roadmap only

---

## 5. DATA MODEL

```
Patient {
  id: string            // e.g. "P-1042"
  name: string
  age: number
  gender: "M" | "F"
  ward: string
  baseline: { pressure: kPa, temp: °C, humidity: % }
  history: SensorReading[]  // rolling window, last ~40 readings
}

SensorReading {
  pressure: number (kPa)
  temperature: number (°C)
  humidity: number (%)
  battery: number (%)
  timestamp: number
}

RiskResult {
  score: 0-100
  category: "low" | "moderate" | "high" | "critical"
  confidence: %
  trendLabel: "Rising" | "Stable" | "Improving"
}

Alert {
  patientId, name, category, pressure, temp, timestamp
}
```

Firebase collections (when wired for real): `Doctors`, `Patients`, `SensorData/{patientId}/latest`, `SensorData/{patientId}/history/{timestamp}`, `Alerts`.

---

## 6. RISK FORMULA (the one clinical/technical claim to be ready to defend)

```
risk_score = pressure_score × 0.40 + temp_score × 0.35 + trend_score × 0.25

pressure_score = min(100, (current_pressure − baseline_pressure) / 25kPa × 100)
temp_score     = min(100, (current_temp − baseline_temp) / 3°C × 100)
trend_score    = slope of last 5 pressure readings, scaled

Low: 0–24%   Moderate: 25–49%   High: 50–74%   Critical: 75–100%
```
Rationale to state if asked: sustained plantar pressure combined with a localized temperature asymmetry above ~2°C is a documented clinical precursor to diabetic foot ulceration. This is a weighted rules-based score, not a trained ML model — be upfront about that, and frame a trained model as "next iteration."

---

## 7. FILES DELIVERED

| File | Purpose |
|---|---|
| `footguard-dashboard.html` | The full working demo — open and run, no setup |
| `firebase-sensor-simulator.js` | Real Firebase Realtime DB pusher, replaces in-browser simulation |
| `gemini-integration.js` | Real Gemini API call for AI Clinical Assistant |
| `README.md` | Setup instructions + demo script |
| This file | Full spec / reusable prompt for further customization or handing to another builder tool |

---

## 8. IF YOU PASTE THIS INTO ANOTHER AI BUILDER (v0, Lovable, Bolt, etc.)

Use this condensed version as the prompt:

> Build a dark-themed hospital dashboard called "SmartSense FootGuard Pro" for diabetic foot ulcer monitoring. Login page with split layout (brand+headline left, login card right). Dashboard with: top navbar (search, live status pill, notifications, avatar), 5 stat cards, horizontally scrollable patient chips with risk badges, live sensor tiles (pressure/temp/humidity/battery) with a live line chart, a risk engine card showing a color-coded % score with plain-language explanation, an SVG foot pressure heatmap with 4 zones per foot (toe/forefoot/midfoot/heel) color-coded green/orange/red, an AI clinical assistant panel with a "Generate Summary" button that streams a structured clinical note, and an alert center list that auto-populates on high/critical risk. Color palette: `#0F172A #111827 #1E293B #3B82F6 #22C55E #F97316 #DC2626 #A855F7`. Glassmorphism cards, rounded corners, Inter font, restrained motion (pulse on live indicators only). Simulate live data client-side — no backend required for the demo.
