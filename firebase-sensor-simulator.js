/**
 * FootGuard Pro — Firebase Sensor Simulator
 * ------------------------------------------
 * Pushes realistic pressure/temperature/humidity/battery readings to a
 * real Firebase Realtime Database, standing in for the ESP32 hardware.
 * Run this in a terminal during your demo and your dashboard.html (once
 * wired to real Firebase) will show truly "live" data updating.
 *
 * SETUP
 *   npm install firebase-admin
 *   1. Firebase Console -> Project Settings -> Service Accounts
 *      -> Generate new private key -> save as serviceAccountKey.json
 *      in the same folder as this script.
 *   2. Update DATABASE_URL below.
 *   3. node firebase-sensor-simulator.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const DATABASE_URL = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com"; // <-- change this

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});

const db = admin.database();

// Same patient seed as the dashboard demo, so IDs line up if you wire both.
const patients = [
  { id: "P-1042", name: "Meena R.", escalate: true, baseline: { pressure: 32, temp: 33.2, humidity: 45 } },
  { id: "P-1043", name: "Suresh K.", escalate: false, baseline: { pressure: 28, temp: 32.8, humidity: 40 } },
  { id: "P-1044", name: "Lakshmi V.", escalate: false, baseline: { pressure: 25, temp: 32.5, humidity: 42 } },
  { id: "P-1045", name: "Ibrahim S.", escalate: false, baseline: { pressure: 30, temp: 33.0, humidity: 44 } },
];

const lastReading = {};
patients.forEach((p) => (lastReading[p.id] = { ...p.baseline, battery: 92 }));

function rand(a, b) {
  return a + Math.random() * (b - a);
}

function nextReading(patient) {
  const last = lastReading[patient.id];
  let pressure, temp, humidity;

  if (patient.escalate) {
    // Slow escalation so the risk engine visibly climbs during a demo.
    pressure = Math.min(58, last.pressure + rand(0.6, 2.2));
    temp = Math.min(patient.baseline.temp + 3.4, last.temp + rand(0.02, 0.12));
    humidity = last.humidity + rand(-1, 1);
  } else {
    pressure = patient.baseline.pressure + rand(-2.5, 2.5);
    temp = patient.baseline.temp + rand(-0.25, 0.25);
    humidity = patient.baseline.humidity + rand(-2, 2);
  }

  const battery = Math.max(15, last.battery - 0.05);
  const reading = {
    pressure: Number(pressure.toFixed(2)),
    temperature: Number(temp.toFixed(2)),
    humidity: Number(humidity.toFixed(1)),
    battery: Number(battery.toFixed(1)),
    wifiSignal: Math.round(rand(-70, -40)), // dBm
    timestamp: Date.now(),
  };
  lastReading[patient.id] = { pressure, temp, humidity, battery };
  return reading;
}

async function pushAll() {
  const updates = {};
  for (const patient of patients) {
    const reading = nextReading(patient);
    updates[`SensorData/${patient.id}/latest`] = reading;
    updates[`SensorData/${patient.id}/history/${reading.timestamp}`] = reading;
  }
  await db.ref().update(updates);
  console.log(`[${new Date().toLocaleTimeString()}] Pushed readings for ${patients.length} patients`);
}

console.log("FootGuard sensor simulator started. Pushing every 2.5s. Ctrl+C to stop.");
setInterval(pushAll, 2500);
pushAll();
