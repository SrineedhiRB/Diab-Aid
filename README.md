# SmartSense FootGuard Pro — Hackathon Built demo

## What's in this folder

| File | What it is | Ready to demo now? |
|---|---|---|
| `footguard-dashboard.html` | The full dashboard UI — login, live sensor tiles, pressure heatmap, risk engine, AI clinical assistant, alert center. Runs entirely in the browser with simulated live data. | **Yes — open it and it works, no setup.** |
| `firebase-sensor-simulator.js` | Node script that pushes the same simulated readings to a *real* Firebase Realtime Database, standing in for the ESP32 hardware. | Needs a Firebase project + service account key |
| `gemini-integration.js` | Dropped in  real Gemini API call to replace the mocked AI summary in the dashboard. | Needs a Gemini API key |

## Fastest path: demo right now
Just open `footguard-dashboard.html` in a browser. Log in with the pre-filled demo credentials. Data starts flowing immediately — one patient (Meena R.) is scripted to slowly escalate from Low to Critical risk over the first couple of minutes, so the risk engine, heatmap, and alerts all visibly react while you're talking. This is enough for your demo script:

1. Log in as Dr.XX
2. Point out live sensor tiles updating
3. Select Meena R., show the heatmap heel zone turning orange → red
4. Show the Risk Engine card climbing with a real explanation (pressure delta, temp delta)
5. Click "Generate AI Summary" — streams a clinical explanation
6. Point at the Alert Center — it fires automatically once risk crosses High


## RISK FORMULA 
```
risk_score = pressure_score * 0.40 + temp_score * 0.35 + trend_score * 0.25

pressure_score = min(100, (current_pressure - baseline_pressure) / 25kPa * 100)
temp_score     = min(100, (current_temp - baseline_temp) / 3°C * 100)
trend_score    = slope of last 5 pressure readings, scaled

Low: 0-24%   Moderate: 25-49%   High: 50-74%   Critical: 75-100%
```
This is grounded in a real clinical signal: sustained plantar pressure combined with localized temperature asymmetry >2°C is a documented precursor to diabetic foot ulceration. It's a weighted formula, not a trained ML model — say so plainly if asked. Framing it as "evidence-based risk scoring, ML model as the next iteration" is honest and still lands well with judges.

## Updates in progress ( vaporware)
- Sarvam AI Tamil report generation
- Telegram / SMS / voice-call notifications
- Full patient CRUD, Appointments, Messages, Settings, Analytics suite


Keep a "Roadmap" slide in your pitch deck listing these — it shows scope awareness without costing build time.

##  script (~90 seconds)
Login → Dashboard overview → select escalating patient → heatmap turns red on heel → risk engine shows rising % with explanation → AI summary streams in → alert fires in Alert Center. That single flow demonstrates IoT (simulated), real-time updates, AI risk modeling, and clinical decision support — the core claims of your pitch — without needing the other 80% of the original spec.
