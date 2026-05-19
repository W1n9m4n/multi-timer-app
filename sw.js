:root {
  --bg: #111827;
  --panel: #1f2937;
  --panel-2: #263244;
  --text: #f9fafb;
  --muted: #9ca3af;
  --line: rgba(255,255,255,0.12);
  --accent: #38bdf8;
  --danger: #ef4444;
  --radius: 20px;
  --shadow: 0 18px 40px rgba(0,0,0,0.35);
}

* {
  box-sizing: border-box;
}

html,
body,
.phone,
button,
.timer-card,
.timer-card *,
.chess-player,
.chess-player *,
.nav-tab,
.edit-banner {
  -webkit-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
}

input,
select,
textarea,
input *,
select *,
textarea * {
  -webkit-user-select: text !important;
  user-select: text !important;
  -webkit-touch-callout: default !important;
}

html {
  height: 100%;
  overscroll-behavior: none;
}

body {
  margin: 0;
  min-height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #1e3a5f 0, #111827 42%, #0b1020 100%);
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  -webkit-tap-highlight-color: transparent;
}

.phone {
  width: min(390px, 100%);
  height: min(820px, calc(100vh - 24px));
  background: rgba(17,24,39,0.96);
  border: 1px solid var(--line);
  border-radius: 34px;
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

header {
  padding: 18px 16px 12px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
}

.topline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.title-area {
  min-width: 0;
}

h1 {
  font-size: 1.18rem;
  margin: 0;
  letter-spacing: -0.02em;
}


.version-badge {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(56,189,248,0.14);
  border: 1px solid rgba(56,189,248,0.22);
  color: #bae6fd;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.board-name {
  color: var(--muted);
  font-size: 0.78rem;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 165px;
}

.actions {
  display: flex;
  gap: 7px;
  align-items: center;
  flex-wrap: nowrap;
}

button {
  border: 0;
  border-radius: 14px;
  background: #334155;
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}

.pressable {
  touch-action: none;
}

button:active {
  transform: scale(0.98);
}

.small-btn {
  height: 36px;
  padding: 0 9px;
  font-size: 0.76rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  line-height: 1;
}

.hidden {
  display: none !important;
}

.nav-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  background: rgba(15,23,42,0.78);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 4px;
}

.nav-tab {
  height: 34px;
  background: transparent;
  color: var(--muted);
  border-radius: 12px;
  font-size: 0.8rem;
}

.nav-tab.active {
  background: #334155;
  color: var(--text);
}

.sound-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.sound-row button {
  width: 100%;
  height: 36px;
  background: rgba(56,189,248,0.16);
  color: #bae6fd;
  border: 1px solid rgba(56,189,248,0.25);
  font-size: 0.82rem;
}

main {
  flex: 1;
  overflow: hidden;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view {
  display: none;
  min-height: 0;
  flex: 1;
}

.view.active {
  display: flex;
  flex-direction: column;
}

.edit-banner {
  background: rgba(56,189,248,0.13);
  border: 1px solid rgba(56,189,248,0.25);
  color: #bae6fd;
  border-radius: 14px;
  padding: 9px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  overflow-y: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.timer-grid::-webkit-scrollbar {
  display: none;
}

.timer-card {
  min-height: 134px;
  border-radius: var(--radius);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 10px 18px rgba(0,0,0,0.22);
  text-align: left;
}

.timer-card::after,
.chess-player::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, rgba(255,255,255,0.18), transparent 45%);
  pointer-events: none;
}

.timer-card.running,
.chess-player.active-player {
  outline: 2px solid rgba(255,255,255,0.75);
}

.timer-card.editing {
  outline: 2px dashed rgba(255,255,255,0.78);
}

.timer-card.alarming {
  animation: timerPulse 0.8s infinite alternate;
}

.chess-player.alarming {
  animation: chessAlarmPulse 0.8s infinite alternate;
}

@keyframes timerPulse {
  from { filter: brightness(1); transform: scale(1); }
  to { filter: brightness(1.3); transform: scale(1.015); }
}

@keyframes chessAlarmPulse {
  from { filter: brightness(1); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0 12px 22px rgba(0,0,0,0.24); }
  to { filter: brightness(1.25); box-shadow: inset 0 0 0 3px rgba(255,255,255,0.66), 0 12px 22px rgba(0,0,0,0.24); }
}

.timer-title {
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.15;
  position: relative;
  z-index: 1;
}

.timer-time {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  position: relative;
  z-index: 1;
}

.timer-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  column-gap: 10px;
  color: rgba(255,255,255,0.82);
  font-size: 0.72rem;
  position: relative;
  z-index: 1;
}

.timer-meta span:first-child {
  text-align: left;
}

.timer-meta span:last-child {
  text-align: right;
}

.edit-hint {
  opacity: 0.9;
}

.edit-pill {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: rgba(15,23,42,0.38);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  padding: 3px 7px;
  font-size: 0.65rem;
  font-weight: 900;
}

.bottom-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
}

.bottom-bar button {
  height: 46px;
  background: var(--panel-2);
  border: 1px solid var(--line);
}

.chess-view {
  gap: 10px;
  padding: 0;
}

.chess-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  font-size: 0.8rem;
  min-height: 22px;
}

.chess-board-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chess-status {
  color: #bae6fd;
  font-weight: 800;
}

.chess-players {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.chess-player {
  border-radius: 26px;
  padding: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0 12px 22px rgba(0,0,0,0.24);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  min-height: 0;
}

.chess-player.flipped {
  transform: rotate(180deg);
}

.chess-name {
  position: relative;
  z-index: 1;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.chess-remaining {
  position: relative;
  z-index: 1;
  font-size: clamp(3rem, 15vw, 5.2rem);
  font-weight: 950;
  letter-spacing: -0.07em;
  line-height: 0.95;
}

.chess-info-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.chess-info {
  background: rgba(15,23,42,0.26);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 13px;
  padding: 8px;
}

.chess-label {
  color: rgba(255,255,255,0.72);
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.chess-value {
  margin-top: 2px;
  font-size: 0.86rem;
  font-weight: 900;
}

.chess-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.chess-controls button {
  height: 48px;
  background: var(--panel-2);
  border: 1px solid var(--line);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 20;
}

.modal-backdrop.open {
  display: flex;
}

.modal {
  width: min(420px, 100%);
  background: #111827;
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 18px;
  max-height: calc(100vh - 32px);
  overflow: auto;
}

.modal h2 {
  margin: 0 0 14px;
  font-size: 1.1rem;
}

label {
  display: block;
  margin: 12px 0 6px;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
}

input,
select {
  width: 100%;
  height: 44px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: #0f172a;
  color: var(--text);
  padding: 0 12px;
  font-size: 1rem;
}

input[type="color"] {
  padding: 4px;
}

.time-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.two-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.modal-actions button {
  height: 44px;
}

.primary { background: #0284c7; }
.secondary { background: #334155; }
.danger { background: var(--danger); }

.board-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.board-item {
  background: #0f172a;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.board-title {
  font-weight: 800;
}

.board-sub {
  color: var(--muted);
  font-size: 0.78rem;
  margin-top: 2px;
}

.board-buttons {
  display: flex;
  gap: 6px;
}

.board-buttons button {
  height: 34px;
  padding: 0 9px;
  font-size: 0.76rem;
}

.helper {
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.35;
  margin-top: 8px;
}
