/**
 * FootGuard Pro — Real AI Clinical Assistant (Gemini)
 * -----------------------------------------------------
 * Drop-in replacement for the mocked generateSummary() function in
 * footguard-dashboard.html. Requires a Gemini API key.
 *
 * SETUP
 *   1. Get a key from https://aistudio.google.com/apikey
 *   2. Never put the key directly in frontend JS for a real deployment —
 *      route this through a tiny backend (Firebase Cloud Function / Express
 *      route) so the key isn't exposed in the browser. For a hackathon demo,
 *      calling directly from the browser is acceptable if you're aware of
 *      that tradeoff.
 */

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // move server-side for production
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function generateSummaryReal(patient, risk, latestReading) {
  const prompt = `
You are a clinical decision-support assistant for a diabetic foot ulcer monitoring platform.
Given the following patient sensor and risk data, produce a concise clinical summary.

Patient: ${patient.name} (${patient.id})
Current pressure: ${latestReading.pressure} kPa (baseline: ${patient.baseline.pressure} kPa)
Current temperature: ${latestReading.temp} °C (baseline: ${patient.baseline.temp} °C)
Risk score: ${risk.score}% (${risk.label})
Trend: ${risk.trendLabel}

Respond in this exact structure, in plain text, no markdown:
CLINICAL SUMMARY
Risk Level:
Findings:
Likely Cause:
Recommended Action:

Keep each section to 1-2 sentences. Be factual and clinically grounded, do not invent lab values not provided.
`.trim();

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini");
  return text;
}

/**
 * Usage inside the dashboard (replace the mock block in generateSummary()):
 *
 *   const text = await generateSummaryReal(patient, risk, latest);
 *   // then run the same typing-animation loop over `text` instead of the
 *   // hardcoded `summary` string.
 */
