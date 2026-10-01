:root {
  font-family: Inter, system-ui, sans-serif;
  line-height: 1.5;
  color: #e5eefb;
  background: #0f172a;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* { box-sizing: border-box; }
html, body, #root { margin: 0; width: 100%; min-height: 100%; }
body { background: radial-gradient(circle at top, #172554 0%, #0f172a 45%, #020817 100%); }
button, input, textarea { font: inherit; }

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.card {
  width: min(720px, 100%);
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.55);
  padding: 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #7dd3fc;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
}

h1, h2 { margin: 0; }

.stack {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #dbeafe;
  font-weight: 600;
}

input, textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.8);
  color: #f8fafc;
  padding: 12px 14px;
}

textarea { min-height: 120px; resize: vertical; }

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #cbd5e1;
}

.checkbox-row input { width: 18px; height: 18px; margin-top: 3px; }

button {
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  background: rgba(148, 163, 184, 0.18);
  color: #f8fafc;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
button:hover { transform: translateY(-1px); }
button:disabled { opacity: 0.6; cursor: not-allowed; }
button.primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}
button.ghost {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.switcher button.active {
  background: rgba(96, 165, 250, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.5);
}

.alert {
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.alert.error {
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.status-line {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a7f3d0;
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #34d399;
  display: inline-block;
}

.result-image {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  object-fit: cover;
  max-height: 560px;
}
