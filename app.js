(() => {
  "use strict";

  const STORAGE_KEY = "multiTimerChessPwaState.v1";
  const LONG_PRESS_MS = 5000;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const makeId = () => {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const makeTimer = (title, duration, color, sound = "bell") => ({
    id: makeId(),
    title,
    duration,
    remaining: duration,
    color,
    sound,
    running: false,
    endsAt: null,
    alarming: false
  });

  const DEFAULT_TIMER_DEFS = [
    ["Runde 1", 300, "#0ea5e9", "bell"],
    ["Spielzug", 120, "#22c55e", "ping"],
    ["Pause", 600, "#f97316", "soft"],
    ["Aufbau", 900, "#a855f7", "alarm"],
    ["Zauberphase", 180, "#06b6d4", "bell"],
    ["Bewegung", 240, "#84cc16", "ping"],
    ["Nahkampf", 360, "#ef4444", "alarm"],
    ["Reserve", 60, "#64748b", "soft"]
  ];

  const defaultTimers = () => DEFAULT_TIMER_DEFS.map(([title, duration, color, sound]) => makeTimer(title, duration, color, sound));

  const defaultChess = () => ({
    title: "Schachuhr",
    active: null,
    running: false,
    lastTick: null,
    sound: "alarm",
    alarming: false,
    expired: false,
    alarmUntil: null,
    players: [
      { name: "Spieler 1", color: "#0ea5e9", limit: 600, remaining: 600, used: 0, turns: 0 },
      { name: "Spieler 2", color: "#ef4444", limit: 600, remaining: 600, used: 0, turns: 0 }
    ]
  });

  let state = loadState();
  let audioContext = null;
  let alarmInterval = null;
  let longPressTimer = null;
  let longPressTriggered = false;

  const elements = {
    timerGrid: document.getElementById("timerGrid"),
    boardName: document.getElementById("boardName"),
    timerModal: document.getElementById("timerModal"),
    boardsModal: document.getElementById("boardsModal"),
    chessModal: document.getElementById("chessModal"),
    chessPlayers: document.getElementById("chessPlayers"),
    mainTitle: document.getElementById("mainTitle"),
    timerActions: document.getElementById("timerActions"),
    timerView: document.getElementById("timerView"),
    chessView: document.getElementById("chessView"),
    timerTab: document.getElementById("timerTab"),
    chessTab: document.getElementById("chessTab")
  };

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return normalizeState(parsed);
      } catch {
        // Fall through to default state.
      }
    }

    const boardId = makeId();
    return {
      activeView: "timers",
      activeBoardId: boardId,
      boards: [{ id: boardId, name: "Tabletop Abend", timers: defaultTimers() }],
      chess: defaultChess()
    };
  }

  function normalizeState(parsed) {
    if (!parsed || typeof parsed !== "object") {
      const boardId = makeId();
      return {
        activeView: "timers",
        activeBoardId: boardId,
        boards: [{ id: boardId, name: "Tabletop Abend", timers: defaultTimers() }],
        chess: defaultChess()
      };
    }
    if (!parsed.activeView) parsed.activeView = "timers";
    if (!Array.isArray(parsed.boards) || parsed.boards.length === 0) {
      const boardId = makeId();
      parsed.activeBoardId = boardId;
      parsed.boards = [{ id: boardId, name: "Tabletop Abend", timers: defaultTimers() }];
    }
    parsed.boards.forEach((board) => {
      if (!board.id) board.id = makeId();
      if (!board.name) board.name = "Board";
      if (!Array.isArray(board.timers)) board.timers = defaultTimers();
      board.timers.forEach((timer) => {
        if (!timer.id) timer.id = makeId();
        if (!timer.title) timer.title = "Timer";
        if (!Number.isFinite(timer.duration) || timer.duration < 1) timer.duration = 300;
        if (!Number.isFinite(timer.remaining) || timer.remaining < 0) timer.remaining = timer.duration;
        if (!timer.color) timer.color = "#0ea5e9";
        if (!timer.sound) timer.sound = "bell";
        timer.running = Boolean(timer.running);
        timer.alarming = Boolean(timer.alarming);
        if (timer.running && !timer.endsAt) timer.endsAt = Date.now() + timer.remaining * 1000;
      });
    });

    if (!parsed.activeBoardId || !parsed.boards.some((b) => b.id === parsed.activeBoardId)) {
      parsed.activeBoardId = parsed.boards[0].id;
    }

    if (!parsed.chess) parsed.chess = defaultChess();
    const freshChess = defaultChess();
    parsed.chess = { ...freshChess, ...parsed.chess };
    if (!Array.isArray(parsed.chess.players) || parsed.chess.players.length !== 2) {
      parsed.chess.players = freshChess.players;
    }
    parsed.chess.players.forEach((player, index) => {
      const fallback = freshChess.players[index];
      player.name = player.name || fallback.name;
      player.color = player.color || fallback.color;
      if (!Number.isFinite(player.limit) || player.limit < 1) player.limit = fallback.limit;
      if (!Number.isFinite(player.remaining) || player.remaining < 0) player.remaining = player.limit;
      if (!Number.isFinite(player.used) || player.used < 0) player.used = 0;
      if (!Number.isFinite(player.turns) || player.turns < 0) player.turns = 0;
    });
    parsed.chess.running = Boolean(parsed.chess.running);
    parsed.chess.alarming = Boolean(parsed.chess.alarming);
    parsed.chess.expired = Boolean(parsed.chess.expired);
    if (![0, 1, null].includes(parsed.chess.active)) parsed.chess.active = null;
    if (typeof parsed.chess.alarmUntil === "undefined") parsed.chess.alarmUntil = null;

    return parsed;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function activeBoard() {
    return state.boards.find((board) => board.id === state.activeBoardId) || state.boards[0];
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setView(view) {
    state.activeView = view;

    const isTimer = view === "timers";
    elements.timerView.classList.toggle("active", isTimer);
    elements.chessView.classList.toggle("active", !isTimer);
    elements.timerTab.classList.toggle("active", isTimer);
    elements.chessTab.classList.toggle("active", !isTimer);
    elements.mainTitle.textContent = isTimer ? "Multi Timer" : "Schachuhr";
    elements.timerActions.style.visibility = isTimer ? "visible" : "hidden";

    render();
  }

  function render() {
    renderViewShell();
    renderTimers();
    renderChess();
    renderBoards();
    saveState();
  }

  function renderViewShell() {
    const board = activeBoard();
    elements.boardName.textContent = state.activeView === "timers"
      ? `Board: ${board.name}`
      : `Modus: ${state.chess.title}`;
  }

  function renderTimers() {
    const board = activeBoard();
    elements.timerGrid.innerHTML = "";

    board.timers.forEach((timer) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `timer-card ${timer.running ? "running" : ""} ${timer.alarming ? "alarming" : ""}`;
      card.style.background = `linear-gradient(145deg, ${timer.color}, ${shade(timer.color, -32)})`;
      card.innerHTML = `
        <div class="timer-title">${escapeHtml(timer.title)}</div>
        <div class="timer-time">${formatTime(timer.remaining)}</div>
        <div class="timer-meta">
          <span>${timer.running ? "läuft" : timer.alarming ? "abgelaufen" : "bereit"}</span>
          <span class="edit-hint">halten</span>
        </div>
      `;

      card.addEventListener("click", () => {
        if (longPressTriggered) {
          longPressTriggered = false;
          return;
        }
        toggleTimer(timer.id);
      });
      card.addEventListener("pointerdown", () => startLongPress(() => openTimerSettings(timer.id)));
      card.addEventListener("pointerup", cancelLongPress);
      card.addEventListener("pointercancel", cancelLongPress);
      card.addEventListener("pointerleave", cancelLongPress);
      card.addEventListener("contextmenu", (event) => event.preventDefault());

      elements.timerGrid.appendChild(card);
    });
  }

  function renderChess() {
    const chess = state.chess;
    document.getElementById("chessTitle").textContent = chess.title;
    document.getElementById("chessStatus").textContent = chess.expired
      ? "Zeit abgelaufen"
      : chess.running
        ? `${chess.players[chess.active]?.name || ""} aktiv`
        : "pausiert / bereit";

    elements.chessPlayers.innerHTML = "";

    chess.players.forEach((player, index) => {
      const panel = document.createElement("button");
      panel.type = "button";
      panel.className = `chess-player ${index === 0 ? "flipped" : ""} ${chess.active === index && chess.running ? "active-player" : ""} ${chess.alarming && chess.active === index ? "alarming" : ""}`;
      panel.style.background = `linear-gradient(145deg, ${player.color}, ${shade(player.color, -34)})`;
      panel.innerHTML = `
        <div class="chess-name">${escapeHtml(player.name)}</div>
        <div class="chess-remaining">${formatTime(player.remaining)}</div>
        <div class="chess-info-grid">
          <div class="chess-info"><div class="chess-label">Aktiv</div><div class="chess-value">${formatTime(player.used)}</div></div>
          <div class="chess-info"><div class="chess-label">Züge</div><div class="chess-value">${Math.floor(player.turns)}</div></div>
          <div class="chess-info"><div class="chess-label">Status</div><div class="chess-value">${chess.active === index && chess.running ? "läuft" : "wartet"}</div></div>
        </div>
      `;

      panel.addEventListener("click", () => {
        if (longPressTriggered) {
          longPressTriggered = false;
          return;
        }
        pressChessPlayer(index);
      });
      panel.addEventListener("pointerdown", () => startLongPress(openChessSettings));
      panel.addEventListener("pointerup", cancelLongPress);
      panel.addEventListener("pointercancel", cancelLongPress);
      panel.addEventListener("pointerleave", cancelLongPress);
      panel.addEventListener("contextmenu", (event) => event.preventDefault());

      elements.chessPlayers.appendChild(panel);
    });
  }

  function tick() {
    const now = Date.now();

    tickTimers(now);
    tickChess(now);

    const timerAlarm = activeBoard().timers.some((timer) => timer.alarming);
    const chessAlarm = state.chess.alarming;

    if (timerAlarm || chessAlarm) startAlarmLoop();
    else stopAlarmLoop();

    render();
  }

  function tickTimers(now) {
    activeBoard().timers.forEach((timer) => {
      if (timer.running && timer.endsAt) {
        timer.remaining = Math.max(0, Math.ceil((timer.endsAt - now) / 1000));
        if (timer.remaining <= 0) {
          timer.running = false;
          timer.endsAt = null;
          timer.alarming = true;
        }
      }
    });
  }

  function tickChess(now) {
    const chess = state.chess;

    if (chess.alarming && chess.alarmUntil && now >= chess.alarmUntil) {
      chess.alarming = false;
      chess.alarmUntil = null;
    }

    if (!chess.running || chess.active === null) return;
    if (!chess.lastTick) chess.lastTick = now;

    const elapsed = Math.max(0, (now - chess.lastTick) / 1000);
    chess.lastTick = now;

    const player = chess.players[chess.active];
    player.remaining = Math.max(0, player.remaining - elapsed);
    player.used += elapsed;

    if (player.remaining <= 0) {
      player.remaining = 0;
      chess.running = false;
      chess.expired = true;
      chess.alarming = true;
      chess.alarmUntil = now + 10000;
    }
  }

  function toggleTimer(id) {
    ensureAudio();

    const timer = activeBoard().timers.find((entry) => entry.id === id);
    if (!timer) return;

    if (timer.alarming) {
      timer.alarming = false;
      timer.remaining = timer.duration;
      stopAlarmLoop();
    } else if (timer.running) {
      timer.running = false;
      timer.endsAt = null;
    } else {
      timer.running = true;
      timer.endsAt = Date.now() + timer.remaining * 1000;
    }

    render();
  }

  function resetTimer(timer) {
    timer.running = false;
    timer.alarming = false;
    timer.remaining = timer.duration;
    timer.endsAt = null;
  }

  function pressChessPlayer(index) {
    ensureAudio();

    const chess = state.chess;

    if (chess.expired) {
      chess.alarming = false;
      chess.alarmUntil = null;
      return render();
    }

    if (!chess.running) {
      chess.active = index;
      chess.running = true;
      chess.lastTick = Date.now();
      return render();
    }

    if (chess.active === index) {
      chess.players[index].turns += 1;
      chess.active = index === 0 ? 1 : 0;
      chess.lastTick = Date.now();
    }

    render();
  }

  function pauseChess() {
    const chess = state.chess;
    if (chess.alarming) chess.alarming = false;
    chess.alarmUntil = null;
    chess.running = false;
    chess.lastTick = null;
    render();
  }

  function resetChess(fullStats = true) {
    const chess = state.chess;
    chess.running = false;
    chess.active = null;
    chess.lastTick = null;
    chess.alarming = false;
    chess.expired = false;
    chess.alarmUntil = null;
    chess.players.forEach((player) => {
      player.remaining = player.limit;
      if (fullStats) {
        player.used = 0;
        player.turns = 0;
      }
    });
    render();
  }

  function openTimerSettings(id) {
    const timer = activeBoard().timers.find((entry) => entry.id === id);
    if (!timer) return;

    document.getElementById("timerId").value = timer.id;
    document.getElementById("timerTitle").value = timer.title;
    document.getElementById("timerHours").value = Math.floor(timer.duration / 3600);
    document.getElementById("timerMinutes").value = Math.floor((timer.duration % 3600) / 60);
    document.getElementById("timerSeconds").value = timer.duration % 60;
    document.getElementById("timerColor").value = timer.color;
    document.getElementById("timerSound").value = timer.sound;
    elements.timerModal.classList.add("open");
    elements.timerModal.setAttribute("aria-hidden", "false");
  }

  function closeTimerSettings() {
    elements.timerModal.classList.remove("open");
    elements.timerModal.setAttribute("aria-hidden", "true");
  }

  function saveTimerSettings() {
    const timer = activeBoard().timers.find((entry) => entry.id === document.getElementById("timerId").value);
    if (!timer) return;

    const duration = readDuration("timerHours", "timerMinutes", "timerSeconds");
    timer.title = document.getElementById("timerTitle").value.trim() || "Timer";
    timer.duration = duration;
    timer.remaining = duration;
    timer.color = document.getElementById("timerColor").value;
    timer.sound = document.getElementById("timerSound").value;
    timer.running = false;
    timer.alarming = false;
    timer.endsAt = null;

    closeTimerSettings();
    render();
  }

  function deleteCurrentTimer() {
    const id = document.getElementById("timerId").value;
    const board = activeBoard();
    board.timers = board.timers.filter((timer) => timer.id !== id);
    closeTimerSettings();
    render();
  }

  function addTimer() {
    activeBoard().timers.push(makeTimer("Neuer Timer", 300, "#0ea5e9", "bell"));
    render();
  }

  function resetAll() {
    activeBoard().timers.forEach(resetTimer);
    stopAlarmLoop();
    render();
  }

  function openBoards() {
    elements.boardsModal.classList.add("open");
    elements.boardsModal.setAttribute("aria-hidden", "false");
    renderBoards();
  }

  function closeBoards() {
    elements.boardsModal.classList.remove("open");
    elements.boardsModal.setAttribute("aria-hidden", "true");
  }

  function renderBoards() {
    const list = document.getElementById("boardList");
    if (!list) return;
    list.innerHTML = "";

    state.boards.forEach((board) => {
      const item = document.createElement("div");
      item.className = "board-item";
      item.innerHTML = `
        <div>
          <div class="board-title">${escapeHtml(board.name)}</div>
          <div class="board-sub">${board.timers.length} Timer ${board.id === state.activeBoardId ? "· aktiv" : ""}</div>
        </div>
        <div class="board-buttons">
          <button type="button" data-action="load">Laden</button>
          <button type="button" data-action="copy">Kopie</button>
          <button type="button" data-action="delete">Löschen</button>
        </div>
      `;

      item.querySelector('[data-action="load"]').onclick = () => {
        state.activeBoardId = board.id;
        closeBoards();
        setView("timers");
      };
      item.querySelector('[data-action="copy"]').onclick = () => duplicateBoard(board.id);
      item.querySelector('[data-action="delete"]').onclick = () => deleteBoard(board.id);

      list.appendChild(item);
    });
  }

  function createBoard() {
    const nameInput = document.getElementById("newBoardName");
    const name = nameInput.value.trim() || "Neues Board";
    const board = { id: makeId(), name, timers: defaultTimers() };
    state.boards.push(board);
    state.activeBoardId = board.id;
    nameInput.value = "";
    closeBoards();
    setView("timers");
  }

  function duplicateBoard(id = state.activeBoardId) {
    const source = state.boards.find((board) => board.id === id);
    if (!source) return;

    const copy = {
      id: makeId(),
      name: `${source.name} Kopie`,
      timers: clone(source.timers).map((timer) => ({
        ...timer,
        id: makeId(),
        running: false,
        alarming: false,
        endsAt: null
      }))
    };

    state.boards.push(copy);
    state.activeBoardId = copy.id;
    render();
  }

  function deleteBoard(id) {
    if (state.boards.length <= 1) return;
    state.boards = state.boards.filter((board) => board.id !== id);
    if (state.activeBoardId === id) state.activeBoardId = state.boards[0].id;
    render();
  }

  function openChessSettings() {
    const chess = state.chess;
    const limit = chess.players[0].limit;

    document.getElementById("chessConfigTitle").value = chess.title;
    document.getElementById("chessHours").value = Math.floor(limit / 3600);
    document.getElementById("chessMinutes").value = Math.floor((limit % 3600) / 60);
    document.getElementById("chessSeconds").value = limit % 60;
    document.getElementById("playerOneName").value = chess.players[0].name;
    document.getElementById("playerTwoName").value = chess.players[1].name;
    document.getElementById("playerOneColor").value = chess.players[0].color;
    document.getElementById("playerTwoColor").value = chess.players[1].color;
    document.getElementById("chessSound").value = chess.sound;

    elements.chessModal.classList.add("open");
    elements.chessModal.setAttribute("aria-hidden", "false");
  }

  function closeChessSettings() {
    elements.chessModal.classList.remove("open");
    elements.chessModal.setAttribute("aria-hidden", "true");
  }

  function saveChessSettings() {
    const limit = readDuration("chessHours", "chessMinutes", "chessSeconds");
    const chess = state.chess;

    chess.title = document.getElementById("chessConfigTitle").value.trim() || "Schachuhr";
    chess.sound = document.getElementById("chessSound").value;
    chess.players[0].name = document.getElementById("playerOneName").value.trim() || "Spieler 1";
    chess.players[1].name = document.getElementById("playerTwoName").value.trim() || "Spieler 2";
    chess.players[0].color = document.getElementById("playerOneColor").value;
    chess.players[1].color = document.getElementById("playerTwoColor").value;

    chess.players.forEach((player) => {
      player.limit = limit;
      player.remaining = limit;
      player.used = 0;
      player.turns = 0;
    });

    chess.active = null;
    chess.running = false;
    chess.lastTick = null;
    chess.alarming = false;
    chess.expired = false;
    chess.alarmUntil = null;

    closeChessSettings();
    render();
  }

  function readDuration(hoursId, minutesId, secondsId) {
    const h = clampNumber(document.getElementById(hoursId).value, 0, 99);
    const m = clampNumber(document.getElementById(minutesId).value, 0, 59);
    const s = clampNumber(document.getElementById(secondsId).value, 0, 59);
    return Math.max(1, h * 3600 + m * 60 + s);
  }

  function clampNumber(value, min, max) {
    const number = Number(value || 0);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, Math.floor(number)));
  }

  function startLongPress(callback) {
    longPressTriggered = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      callback();
    }, LONG_PRESS_MS);
  }

  function cancelLongPress() {
    clearTimeout(longPressTimer);
  }

  function ensureAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function playTone(type = "bell") {
    ensureAudio();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const patterns = {
      bell: [[880, 0], [660, 0.16]],
      ping: [[1040, 0]],
      alarm: [[660, 0], [880, 0.12], [660, 0.24]],
      soft: [[523, 0], [659, 0.18]]
    };
    const notes = patterns[type] || patterns.bell;

    notes.forEach(([freq, offset]) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.frequency.value = freq;
      osc.type = type === "soft" ? "sine" : "triangle";

      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.22);

      osc.connect(gain).connect(audioContext.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.24);
    });
  }

  function startAlarmLoop() {
    if (alarmInterval) return;

    alarmInterval = setInterval(() => {
      const timer = activeBoard().timers.find((entry) => entry.alarming);
      if (timer) {
        playTone(timer.sound);
        return;
      }

      const chess = state.chess;
      if (chess.alarming && (!chess.alarmUntil || Date.now() < chess.alarmUntil)) {
        playTone(chess.sound);
      }
    }, 1100);
  }

  function stopAlarmLoop() {
    if (alarmInterval) clearInterval(alarmInterval);
    alarmInterval = null;
  }

  function shade(hex, percent) {
    const fallback = "#334155";
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) hex = fallback;

    const f = parseInt(hex.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent) / 100;
    const r = f >> 16;
    const g = (f >> 8) & 0x00FF;
    const b = f & 0x0000FF;

    return "#" + (
      0x1000000 +
      (Math.round((t - r) * p) + r) * 0x10000 +
      (Math.round((t - g) * p) + g) * 0x100 +
      (Math.round((t - b) * p) + b)
    ).toString(16).slice(1);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    })[char]);
  }

  document.getElementById("addTimerBtn").onclick = addTimer;
  document.getElementById("resetAllBtn").onclick = resetAll;
  document.getElementById("duplicateBoardBtn").onclick = () => duplicateBoard();
  document.getElementById("boardsBtn").onclick = openBoards;
  document.getElementById("enableSoundBtn").onclick = () => playTone("bell");
  document.getElementById("timerTab").onclick = () => setView("timers");
  document.getElementById("chessTab").onclick = () => setView("chess");

  document.getElementById("cancelTimerBtn").onclick = closeTimerSettings;
  document.getElementById("saveTimerBtn").onclick = saveTimerSettings;
  document.getElementById("deleteTimerBtn").onclick = deleteCurrentTimer;
  document.getElementById("testSoundBtn").onclick = () => playTone(document.getElementById("timerSound").value);

  document.getElementById("createBoardBtn").onclick = createBoard;
  document.getElementById("closeBoardsBtn").onclick = closeBoards;

  document.getElementById("pauseChessBtn").onclick = pauseChess;
  document.getElementById("resetChessBtn").onclick = () => resetChess(true);
  document.getElementById("cancelChessSettingsBtn").onclick = closeChessSettings;
  document.getElementById("saveChessSettingsBtn").onclick = saveChessSettings;
  document.getElementById("resetChessStatsBtn").onclick = () => resetChess(true);
  document.getElementById("testChessSoundBtn").onclick = () => playTone(document.getElementById("chessSound").value);

  elements.timerModal.addEventListener("click", (event) => {
    if (event.target === elements.timerModal) closeTimerSettings();
  });
  elements.boardsModal.addEventListener("click", (event) => {
    if (event.target === elements.boardsModal) closeBoards();
  });
  elements.chessModal.addEventListener("click", (event) => {
    if (event.target === elements.chessModal) closeChessSettings();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // The app still works online if service worker registration fails.
      });
    });
  }

  setInterval(tick, 250);
  setView(state.activeView || "timers");
})();
