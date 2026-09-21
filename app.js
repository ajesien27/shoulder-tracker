(() => {
  const DATA = window.EXERCISE_DATA;
  const STORAGE_KEY = "shoulder-tracker-v1";
  const FIRST_RUN_KEY = "shoulder-tracker-first-run-seen";

  const state = {
    view: "today",
    session: null, // { type: 'daily'|'gym', index: number }
    detailId: null,
    detailFrom: "library"
  };

  function todayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function startOfWeek(d = new Date()) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (x.getDay() + 6) % 7; // Mon=0
    x.setDate(x.getDate() - day);
    return x;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { days: {} };
      const parsed = JSON.parse(raw);
      if (!parsed.days) parsed.days = {};
      return parsed;
    } catch {
      return { days: {} };
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function dayRecord(store, key = todayKey()) {
    if (!store.days[key]) {
      store.days[key] = { daily: {}, gym: {}, gymComplete: false };
    }
    if (!store.days[key].daily) store.days[key].daily = {};
    if (!store.days[key].gym) store.days[key].gym = {};
    return store.days[key];
  }

  function allExercises() {
    return [...DATA.daily, ...DATA.gym, ...DATA.optional, ...DATA.later];
  }

  function findExercise(id) {
    return allExercises().find((e) => e.id === id);
  }

  function dailyDoneCount(rec) {
    return DATA.daily.filter((e) => rec.daily[e.id]).length;
  }

  function gymDoneCount(rec) {
    return DATA.gym.filter((e) => rec.gym[e.id]).length;
  }

  function isDailyComplete(rec) {
    return dailyDoneCount(rec) >= DATA.daily.length;
  }

  function isGymComplete(rec) {
    return gymDoneCount(rec) >= DATA.gym.length || !!rec.gymComplete;
  }

  function gymSessionsThisWeek(store, ref = new Date()) {
    const start = startOfWeek(ref);
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = todayKey(d);
      const rec = store.days[key];
      if (rec && isGymComplete(rec)) count += 1;
    }
    return count;
  }

  function stretchStreak(store, ref = new Date()) {
    let streak = 0;
    const cursor = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    // If today incomplete, start counting from yesterday
    const todayRec = store.days[todayKey(cursor)];
    if (!todayRec || !isDailyComplete(todayRec)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (true) {
      const key = todayKey(cursor);
      const rec = store.days[key];
      if (rec && isDailyComplete(rec)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function weekStrip(store, ref = new Date()) {
    const start = startOfWeek(ref);
    const today = todayKey(ref);
    const days = [];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = todayKey(d);
      const rec = store.days[key] || { daily: {}, gym: {} };
      days.push({
        key,
        label: labels[i],
        isToday: key === today,
        daily: isDailyComplete(rec),
        gym: isGymComplete(rec)
      });
    }
    return days;
  }

  function setDailyDone(id, done) {
    const store = loadStore();
    const rec = dayRecord(store);
    if (done) rec.daily[id] = true;
    else delete rec.daily[id];
    saveStore(store);
  }

  function setGymDone(id, done) {
    const store = loadStore();
    const rec = dayRecord(store);
    if (done) rec.gym[id] = true;
    else delete rec.gym[id];
    if (gymDoneCount(rec) >= DATA.gym.length) rec.gymComplete = true;
    else rec.gymComplete = false;
    saveStore(store);
  }

  function toggleDone(type, id) {
    const store = loadStore();
    const rec = dayRecord(store);
    if (type === "daily") {
      setDailyDone(id, !rec.daily[id]);
    } else {
      setGymDone(id, !rec.gym[id]);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function listHtml(items) {
    return `<ol class="steps">${items.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`;
  }

  function exerciseBody(ex) {
    return `
      <span class="dose-pill">${escapeHtml(ex.dose)}</span>
      <div class="section-label">Setup</div>
      ${listHtml(ex.setup)}
      <div class="section-label">Steps</div>
      ${listHtml(ex.steps)}
      <div class="why-box"><strong>Why this matters for you</strong>${escapeHtml(ex.why)}</div>
      <div class="cue-box"><strong>Form cue</strong>${escapeHtml(ex.cue)}</div>
      ${ex.skipIf ? `<div class="warn-box"><strong>Skip / regress if</strong>${escapeHtml(ex.skipIf)}</div>` : ""}
    `;
  }

  function renderNav(active) {
    const items = [
      { id: "today", label: "Today" },
      { id: "library", label: "Library" },
      { id: "week", label: "Week" },
      { id: "safety", label: "Safety" }
    ];
    return `
      <nav class="nav">
        ${items
          .map(
            (i) =>
              `<button type="button" data-nav="${i.id}" class="${active === i.id ? "active" : ""}">${i.label}</button>`
          )
          .join("")}
      </nav>
    `;
  }

  function renderToday() {
    const store = loadStore();
    const rec = dayRecord(store);
    const dailyDone = dailyDoneCount(rec);
    const gymDone = gymDoneCount(rec);
    const gymWeek = gymSessionsThisWeek(store);
    const streak = stretchStreak(store);
    const strip = weekStrip(store);
    const firstRun = !localStorage.getItem(FIRST_RUN_KEY);
    const now = new Date();
    const dateLabel = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    return `
      <div class="screen">
        <div class="screen-header">
          <div>
            <h1>Today</h1>
            <p class="muted">${escapeHtml(dateLabel)}</p>
          </div>
        </div>

        ${
          firstRun
            ? `<div class="banner" id="install-banner">
                <strong>Add to Home Screen</strong>
                <ol class="install-steps">
                  <li>Open this page in Safari on your iPhone</li>
                  <li>Tap Share → <em>Add to Home Screen</em></li>
                </ol>
                <button type="button" class="btn btn-ghost" id="dismiss-install" style="margin-top:0.75rem;width:100%">Got it</button>
              </div>`
            : ""
        }

        <div class="status-row">
          <div class="stat">
            <div class="label">Stretches</div>
            <div class="value">${dailyDone}/${DATA.daily.length}</div>
            <div class="sub">${isDailyComplete(rec) ? "Done for today" : "Aim: every day"}</div>
          </div>
          <div class="stat">
            <div class="label">Gym week</div>
            <div class="value">${gymWeek}/${DATA.gymGoalPerWeek}</div>
            <div class="sub">${gymDone}/${DATA.gym.length} lifts today</div>
          </div>
        </div>

        <div class="stat" style="margin-bottom:1rem">
          <div class="label">Stretch streak</div>
          <div class="value">${streak} day${streak === 1 ? "" : "s"}</div>
          <div class="sub">Full daily checklist counts</div>
        </div>

        <div class="cta-stack">
          <button type="button" class="btn btn-primary" data-start="daily">
            ${isDailyComplete(rec) ? "Review stretches" : "Start stretches"}
          </button>
          <button type="button" class="btn btn-secondary" data-start="gym">
            ${isGymComplete(rec) ? "Review gym" : "Start gym"}
          </button>
        </div>

        <div class="card">
          <h2>This week</h2>
          <p class="muted">Teal = stretches done · Gold = gym session</p>
          <div class="week-strip">
            ${strip
              .map(
                (d) => `
              <div class="day-cell ${d.isToday ? "today" : ""}">
                <div class="dow">${d.label}</div>
                <div class="marks">
                  <span class="dot ${d.daily ? "on-daily" : ""}"></span>
                  <span class="dot ${d.gym ? "on-gym" : ""}"></span>
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>

        <p class="muted">${escapeHtml(DATA.safety.disclaimer)}</p>
      </div>
      ${renderNav("today")}
    `;
  }

  function renderSession() {
    const { type, index } = state.session;
    const list = type === "daily" ? DATA.daily : DATA.gym;
    const store = loadStore();
    const rec = dayRecord(store);
    const doneMap = type === "daily" ? rec.daily : rec.gym;
    const total = list.length;

    if (index >= total) {
      const completeDaily = type === "daily" && isDailyComplete(rec);
      const completeGym = type === "gym" && isGymComplete(rec);
      return `
        <div class="screen">
          <button type="button" class="back-btn" data-go="today">← Today</button>
          <div class="complete-toast card">
            <div class="big">${type === "daily" ? "Stretches" : "Gym"} wrapped</div>
            <p>${
              type === "daily"
                ? completeDaily
                  ? "All 8 done — streak updated."
                  : "Session closed. Finish unchecked items later for a full stretch day."
                : completeGym
                  ? "All 6 lifts done — counts toward this week’s 3."
                  : "Session closed. Check remaining lifts to count this as a gym day."
            }</p>
            <button type="button" class="btn btn-primary" data-go="today" style="width:100%">Back to Today</button>
          </div>
        </div>
      `;
    }

    const ex = list[index];
    const isDone = !!doneMap[ex.id];
    const pct = Math.round(((index + (isDone ? 1 : 0)) / total) * 100);

    return `
      <div class="screen">
        <button type="button" class="back-btn" data-go="today">← Today</button>
        <div class="session-top">
          <div class="session-meta">
            <span>${type === "daily" ? "Daily stretches" : "Gym session"}</span>
            <span>${index + 1} / ${total}</span>
          </div>
          <div class="progress-bar"><span style="width:${pct}%"></span></div>
          <h1>${escapeHtml(ex.name)}</h1>
        </div>
        ${exerciseBody(ex)}
        <div class="session-actions">
          <button type="button" class="done-btn ${isDone ? "done" : ""}" data-toggle-done="${type}:${ex.id}">
            ${isDone ? "✓ Done" : "Mark done"}
          </button>
          <div class="row-nav">
            <button type="button" class="btn btn-secondary" data-session-nav="prev" ${index === 0 ? "disabled" : ""}>Back</button>
            <button type="button" class="btn btn-primary" data-session-nav="next">${index === total - 1 ? "Finish" : "Next"}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderDetail() {
    const ex = findExercise(state.detailId);
    if (!ex) {
      state.view = "library";
      return renderLibrary();
    }
    const back = state.detailFrom === "week" ? "week" : "library";
    return `
      <div class="screen">
        <button type="button" class="back-btn" data-go="${back}">← Back</button>
        <h1>${escapeHtml(ex.name)}</h1>
        ${exerciseBody(ex)}
      </div>
      ${renderNav(back === "week" ? "week" : "library")}
    `;
  }

  function renderLibraryList(title, items, group) {
    const store = loadStore();
    const rec = dayRecord(store);
    const map = group === "daily" ? rec.daily : group === "gym" ? rec.gym : {};
    return `
      <h2 style="margin:1rem 0 0.5rem">${escapeHtml(title)}</h2>
      ${items
        .map((ex) => {
          const on = !!map[ex.id];
          return `
            <button type="button" class="card tap" data-detail="${ex.id}">
              <div class="list-item">
                <span class="check ${on ? "on" : ""}">${on ? "✓" : ""}</span>
                <div>
                  <div class="title">${escapeHtml(ex.name)}</div>
                  <div class="muted">${escapeHtml(ex.dose)}</div>
                </div>
              </div>
            </button>`;
        })
        .join("")}
    `;
  }

  function renderLibrary() {
    return `
      <div class="screen">
        <div class="screen-header"><div><h1>Library</h1><p class="muted">Tap any exercise for full instructions</p></div></div>
        ${renderLibraryList("Daily stretches", DATA.daily, "daily")}
        ${renderLibraryList("Gym (3× / week)", DATA.gym, "gym")}
        ${renderLibraryList("Optional", DATA.optional, "optional")}
        ${renderLibraryList("Later (Phase 2)", DATA.later, "later")}
      </div>
      ${renderNav("library")}
    `;
  }

  function renderWeek() {
    const store = loadStore();
    const strip = weekStrip(store);
    const gymWeek = gymSessionsThisWeek(store);
    const streak = stretchStreak(store);
    return `
      <div class="screen">
        <div class="screen-header"><div><h1>Week</h1><p class="muted">Monday–Sunday · gym goal ${DATA.gymGoalPerWeek}</p></div></div>
        <div class="status-row">
          <div class="stat">
            <div class="label">Gym sessions</div>
            <div class="value">${gymWeek}/${DATA.gymGoalPerWeek}</div>
          </div>
          <div class="stat">
            <div class="label">Stretch streak</div>
            <div class="value">${streak}</div>
          </div>
        </div>
        <div class="card">
          <div class="week-strip">
            ${strip
              .map(
                (d) => `
              <div class="day-cell ${d.isToday ? "today" : ""}">
                <div class="dow">${d.label}</div>
                <div class="marks">
                  <span class="dot ${d.daily ? "on-daily" : ""}"></span>
                  <span class="dot ${d.gym ? "on-gym" : ""}"></span>
                </div>
              </div>`
              )
              .join("")}
          </div>
          <p class="muted" style="margin-top:0.85rem;margin-bottom:0">Teal stretch · Gold gym</p>
        </div>
        <div class="card">
          <h2>How tracking works</h2>
          <ul class="ul-plain">
            <li>Mark all 8 daily items to count a stretch day and keep your streak.</li>
            <li>Mark all 6 gym lifts in one day to count 1 of ${DATA.gymGoalPerWeek} weekly sessions.</li>
            <li>Progress stays on this phone only (Safari data). No account.</li>
          </ul>
        </div>
      </div>
      ${renderNav("week")}
    `;
  }

  function renderSafety() {
    const s = DATA.safety;
    return `
      <div class="screen">
        <div class="screen-header"><div><h1>Safety</h1><p class="muted">Read once, revisit when unsure</p></div></div>
        <div class="card">
          <h2>Pain rule</h2>
          <p>${escapeHtml(s.painRule)}</p>
        </div>
        <div class="card">
          <h2>Avoid (especially left)</h2>
          <ul class="ul-plain">${s.avoid.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
        </div>
        <div class="card">
          <h2>Unlock Phase 2 when</h2>
          <ul class="ul-plain">${s.phase2Unlock.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
        </div>
        <div class="card warn-box" style="margin-top:0">
          <strong>Red flags — stop and get seen</strong>
          <ul class="ul-plain">${s.redFlags.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
        </div>
        <p class="muted">${escapeHtml(s.disclaimer)}</p>
      </div>
      ${renderNav("safety")}
    `;
  }

  function render() {
    const root = document.getElementById("app");
    let html;
    if (state.view === "session") html = renderSession();
    else if (state.view === "detail") html = renderDetail();
    else if (state.view === "library") html = renderLibrary();
    else if (state.view === "week") html = renderWeek();
    else if (state.view === "safety") html = renderSafety();
    else html = renderToday();
    root.innerHTML = html;
    bind();
  }

  function bind() {
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.getAttribute("data-nav");
        state.session = null;
        state.detailId = null;
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.getAttribute("data-go");
        state.session = null;
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-start]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = "session";
        state.session = { type: btn.getAttribute("data-start"), index: 0 };
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-session-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.session) return;
        const dir = btn.getAttribute("data-session-nav");
        if (dir === "prev") state.session.index = Math.max(0, state.session.index - 1);
        else state.session.index += 1;
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-toggle-done]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [type, id] = btn.getAttribute("data-toggle-done").split(":");
        toggleDone(type, id);
        // Auto-advance shortly after marking done if it was unchecked
        const store = loadStore();
        const rec = dayRecord(store);
        const map = type === "daily" ? rec.daily : rec.gym;
        render();
        if (map[id] && state.session) {
          // stay on same card so user sees the check; Next moves them
        }
      });
    });

    document.querySelectorAll("[data-detail]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.detailId = btn.getAttribute("data-detail");
        state.detailFrom = "library";
        state.view = "detail";
        render();
        window.scrollTo(0, 0);
      });
    });

    const dismiss = document.getElementById("dismiss-install");
    if (dismiss) {
      dismiss.addEventListener("click", () => {
        localStorage.setItem(FIRST_RUN_KEY, "1");
        render();
      });
    }

    // Swipe for session
    if (state.view === "session" && state.session && state.session.index < (state.session.type === "daily" ? DATA.daily.length : DATA.gym.length)) {
      let startX = null;
      const screen = document.querySelector(".screen");
      if (screen) {
        screen.addEventListener(
          "touchstart",
          (e) => {
            startX = e.changedTouches[0].screenX;
          },
          { passive: true }
        );
        screen.addEventListener(
          "touchend",
          (e) => {
            if (startX == null) return;
            const dx = e.changedTouches[0].screenX - startX;
            if (Math.abs(dx) < 60) return;
            if (dx < 0) state.session.index += 1;
            else state.session.index = Math.max(0, state.session.index - 1);
            render();
            window.scrollTo(0, 0);
          },
          { passive: true }
        );
      }
    }
  }

  if (!window.EXERCISE_DATA) {
    document.getElementById("app").innerHTML =
      '<div class="screen"><p>Failed to load exercise data.</p></div>';
    return;
  }

  render();
})();
