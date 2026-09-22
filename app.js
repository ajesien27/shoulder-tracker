(() => {
  const DATA = window.EXERCISE_DATA;
  const STORAGE_KEY = "shoulder-tracker-v1";
  const CUSTOM_KEY = "shoulder-tracker-custom-v1";
  const FIRST_RUN_KEY = "shoulder-tracker-first-run-seen";

  const state = {
    view: "today",
    session: null,
    detailId: null,
    detailFrom: "library",
    editId: null,
    customizeFilter: "daily" // daily | gym | optional | later | removed
  };

  function todayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function startOfWeek(d = new Date()) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (x.getDay() + 6) % 7;
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

  function loadCustom() {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      if (!raw) return { disabled: {}, edits: {} };
      const parsed = JSON.parse(raw);
      return {
        disabled: parsed.disabled || {},
        edits: parsed.edits || {}
      };
    } catch {
      return { disabled: {}, edits: {} };
    }
  }

  function saveCustom(custom) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }

  function dayRecord(store, key = todayKey()) {
    if (!store.days[key]) {
      store.days[key] = { daily: {}, gym: {}, gymComplete: false };
    }
    if (!store.days[key].daily) store.days[key].daily = {};
    if (!store.days[key].gym) store.days[key].gym = {};
    return store.days[key];
  }

  function baseExercises() {
    return [...DATA.daily, ...DATA.gym, ...DATA.optional, ...DATA.later];
  }

  function findBase(id) {
    return baseExercises().find((e) => e.id === id);
  }

  function resolveExercise(base) {
    if (!base) return null;
    const custom = loadCustom();
    const edit = custom.edits[base.id] || {};
    return {
      ...base,
      name: edit.name != null ? edit.name : base.name,
      dose: edit.dose != null ? edit.dose : base.dose,
      setup: edit.setup != null ? edit.setup : base.setup,
      steps: edit.steps != null ? edit.steps : base.steps,
      why: edit.why != null ? edit.why : base.why,
      cue: edit.cue != null ? edit.cue : base.cue,
      skipIf: edit.skipIf != null ? edit.skipIf : base.skipIf,
      disabled: !!custom.disabled[base.id],
      isEdited: Object.keys(edit).length > 0
    };
  }

  function findExercise(id) {
    const base = findBase(id);
    return resolveExercise(base);
  }

  function listForGroup(group, { includeDisabled = false } = {}) {
    const source =
      group === "daily"
        ? DATA.daily
        : group === "gym"
          ? DATA.gym
          : group === "optional"
            ? DATA.optional
            : DATA.later;
    return source
      .map(resolveExercise)
      .filter((e) => includeDisabled || !e.disabled);
  }

  function activeDaily() {
    return listForGroup("daily");
  }

  function activeGym() {
    return listForGroup("gym");
  }

  function setDisabled(id, disabled) {
    const custom = loadCustom();
    if (disabled) custom.disabled[id] = true;
    else delete custom.disabled[id];
    saveCustom(custom);
  }

  function saveEdit(id, fields) {
    const custom = loadCustom();
    const base = findBase(id);
    if (!base) return;
    const next = {};
    const keys = ["name", "dose", "why", "cue", "skipIf", "setup", "steps"];
    keys.forEach((k) => {
      if (fields[k] == null) return;
      const baseVal = base[k];
      const same =
        Array.isArray(baseVal)
          ? JSON.stringify(baseVal) === JSON.stringify(fields[k])
          : String(baseVal || "") === String(fields[k] || "");
      if (!same) next[k] = fields[k];
    });
    if (Object.keys(next).length === 0) delete custom.edits[id];
    else custom.edits[id] = next;
    saveCustom(custom);
  }

  function resetEdit(id) {
    const custom = loadCustom();
    delete custom.edits[id];
    saveCustom(custom);
  }

  function resetAllCustom() {
    localStorage.removeItem(CUSTOM_KEY);
  }

  function linesToArray(text) {
    return String(text || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function dailyDoneCount(rec) {
    return activeDaily().filter((e) => rec.daily[e.id]).length;
  }

  function gymDoneCount(rec) {
    return activeGym().filter((e) => rec.gym[e.id]).length;
  }

  function isDailyComplete(rec) {
    const list = activeDaily();
    if (!list.length) return false;
    return dailyDoneCount(rec) >= list.length;
  }

  function isGymComplete(rec) {
    const list = activeGym();
    if (!list.length) return false;
    return gymDoneCount(rec) >= list.length || !!rec.gymComplete;
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
    const list = activeGym();
    rec.gymComplete = list.length > 0 && gymDoneCount(rec) >= list.length;
    saveStore(store);
  }

  function toggleDone(type, id) {
    const store = loadStore();
    const rec = dayRecord(store);
    if (type === "daily") setDailyDone(id, !rec.daily[id]);
    else setGymDone(id, !rec.gym[id]);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function listHtml(items) {
    return `<ol class="steps">${(items || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`;
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
      { id: "customize", label: "Edit" },
      { id: "week", label: "Week" },
      { id: "safety", label: "Safety" }
    ];
    return `
      <nav class="nav nav-5">
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
    const daily = activeDaily();
    const gym = activeGym();
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
            <div class="value">${dailyDone}/${daily.length}</div>
            <div class="sub">${
              !daily.length
                ? "None enabled — Edit tab"
                : isDailyComplete(rec)
                  ? "Done for today"
                  : "Aim: every day"
            }</div>
          </div>
          <div class="stat">
            <div class="label">Gym week</div>
            <div class="value">${gymWeek}/${DATA.gymGoalPerWeek}</div>
            <div class="sub">${
              !gym.length ? "None enabled — Edit tab" : `${gymDone}/${gym.length} lifts today`
            }</div>
          </div>
        </div>

        <div class="stat" style="margin-bottom:1rem">
          <div class="label">Stretch streak</div>
          <div class="value">${streak} day${streak === 1 ? "" : "s"}</div>
          <div class="sub">Full daily checklist counts</div>
        </div>

        <div class="cta-stack">
          <button type="button" class="btn btn-primary" data-start="daily" ${daily.length ? "" : "disabled"}>
            ${isDailyComplete(rec) ? "Review stretches" : "Start stretches"}
          </button>
          <button type="button" class="btn btn-secondary" data-start="gym" ${gym.length ? "" : "disabled"}>
            ${isGymComplete(rec) ? "Review gym" : "Start gym"}
          </button>
          <button type="button" class="btn btn-ghost" data-nav="customize">Edit / remove exercises</button>
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
    const list = type === "daily" ? activeDaily() : activeGym();
    const store = loadStore();
    const rec = dayRecord(store);
    const doneMap = type === "daily" ? rec.daily : rec.gym;
    const total = list.length;

    if (!total) {
      return `
        <div class="screen">
          <button type="button" class="back-btn" data-go="today">← Today</button>
          <div class="card">
            <h2>No exercises enabled</h2>
            <p class="muted">Turn some back on in Edit.</p>
            <button type="button" class="btn btn-primary" data-nav="customize" style="width:100%">Open Edit</button>
          </div>
        </div>
      `;
    }

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
                  ? `All ${total} done — streak updated.`
                  : "Session closed. Finish unchecked items later for a full stretch day."
                : completeGym
                  ? `All ${total} lifts done — counts toward this week’s ${DATA.gymGoalPerWeek}.`
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
    const back = state.detailFrom === "customize" ? "customize" : "library";
    return `
      <div class="screen">
        <button type="button" class="back-btn" data-go="${back}">← Back</button>
        <h1>${escapeHtml(ex.name)}</h1>
        ${ex.disabled ? `<p class="muted">Removed from sessions — restore in Edit.</p>` : ""}
        ${exerciseBody(ex)}
        <button type="button" class="btn btn-secondary" data-edit="${ex.id}" style="width:100%;margin-top:1rem">Edit this exercise</button>
      </div>
      ${renderNav(back === "customize" ? "customize" : "library")}
    `;
  }

  function renderLibraryList(title, items, group) {
    const store = loadStore();
    const rec = dayRecord(store);
    const map = group === "daily" ? rec.daily : group === "gym" ? rec.gym : {};
    if (!items.length) {
      return `
        <h2 style="margin:1rem 0 0.5rem">${escapeHtml(title)}</h2>
        <p class="muted">None enabled. Restore them in Edit.</p>
      `;
    }
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
                  <div class="title">${escapeHtml(ex.name)}${ex.isEdited ? ' <span class="tag">edited</span>' : ""}</div>
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
        <div class="screen-header"><div><h1>Library</h1><p class="muted">Enabled exercises only · Edit tab to change the list</p></div></div>
        ${renderLibraryList("Daily stretches", activeDaily(), "daily")}
        ${renderLibraryList("Gym (3× / week)", activeGym(), "gym")}
        ${renderLibraryList("Optional", listForGroup("optional"), "optional")}
        ${renderLibraryList("Later (Phase 2)", listForGroup("later"), "later")}
      </div>
      ${renderNav("library")}
    `;
  }

  function renderCustomize() {
    const filter = state.customizeFilter;
    const removed = baseExercises()
      .map(resolveExercise)
      .filter((e) => e.disabled);

    let items;
    let heading;
    if (filter === "removed") {
      items = removed;
      heading = "Removed";
    } else {
      items = listForGroup(filter, { includeDisabled: true });
      heading =
        filter === "daily"
          ? "Daily"
          : filter === "gym"
            ? "Gym"
            : filter === "optional"
              ? "Optional"
              : "Later";
    }

    const chips = [
      ["daily", "Daily"],
      ["gym", "Gym"],
      ["optional", "Optional"],
      ["later", "Later"],
      ["removed", `Removed (${removed.length})`]
    ];

    return `
      <div class="screen">
        <div class="screen-header">
          <div>
            <h1>Edit exercises</h1>
            <p class="muted">Remove ones you don’t want. Tap Edit to change the text. Changes stay on this phone.</p>
          </div>
        </div>

        <div class="chip-row">
          ${chips
            .map(
              ([id, label]) =>
                `<button type="button" class="chip ${filter === id ? "active" : ""}" data-filter="${id}">${label}</button>`
            )
            .join("")}
        </div>

        <h2 style="margin:0.75rem 0 0.5rem">${escapeHtml(heading)}</h2>
        ${
          !items.length
            ? `<p class="muted">${filter === "removed" ? "Nothing removed yet." : "No exercises in this group."}</p>`
            : items
                .map((ex) => {
                  const preview = (ex.why || "").slice(0, 110) + ((ex.why || "").length > 110 ? "…" : "");
                  return `
                  <div class="card customize-card ${ex.disabled ? "is-disabled" : ""}">
                    <div class="customize-head">
                      <div>
                        <div class="title">${escapeHtml(ex.name)}${ex.isEdited ? ' <span class="tag">edited</span>' : ""}</div>
                        <div class="muted">${escapeHtml(ex.dose)} · ${escapeHtml(ex.group)}</div>
                      </div>
                    </div>
                    <p class="preview muted">${escapeHtml(preview)}</p>
                    <div class="customize-actions">
                      <button type="button" class="btn btn-secondary btn-sm" data-detail-custom="${ex.id}">Read</button>
                      <button type="button" class="btn btn-secondary btn-sm" data-edit="${ex.id}">Edit</button>
                      <button type="button" class="btn ${ex.disabled ? "btn-primary" : "btn-danger"} btn-sm" data-toggle-enabled="${ex.id}">
                        ${ex.disabled ? "Restore" : "Remove"}
                      </button>
                    </div>
                  </div>`;
                })
                .join("")
        }

        <button type="button" class="btn btn-ghost" id="reset-custom" style="width:100%;margin-top:1rem">Reset all edits & removals</button>
      </div>
      ${renderNav("customize")}
    `;
  }

  function renderEditForm() {
    const ex = findExercise(state.editId);
    if (!ex) {
      state.view = "customize";
      return renderCustomize();
    }
    return `
      <div class="screen">
        <button type="button" class="back-btn" data-go="customize">← Edit list</button>
        <h1>Edit</h1>
        <p class="muted">${escapeHtml(ex.group)} · ${escapeHtml(ex.id)}</p>
        <form id="edit-form" class="edit-form" data-id="${ex.id}">
          <label>Name
            <input name="name" type="text" value="${escapeHtml(ex.name)}" required />
          </label>
          <label>Dose
            <input name="dose" type="text" value="${escapeHtml(ex.dose)}" required />
          </label>
          <label>Setup <span class="muted">(one step per line)</span>
            <textarea name="setup" rows="4">${escapeHtml((ex.setup || []).join("\n"))}</textarea>
          </label>
          <label>Steps <span class="muted">(one step per line)</span>
            <textarea name="steps" rows="5">${escapeHtml((ex.steps || []).join("\n"))}</textarea>
          </label>
          <label>Why this matters for you
            <textarea name="why" rows="5">${escapeHtml(ex.why || "")}</textarea>
          </label>
          <label>Form cue
            <textarea name="cue" rows="3">${escapeHtml(ex.cue || "")}</textarea>
          </label>
          <label>Skip / regress if
            <textarea name="skipIf" rows="2">${escapeHtml(ex.skipIf || "")}</textarea>
          </label>
          <button type="submit" class="btn btn-primary" style="width:100%">Save changes</button>
          <button type="button" class="btn btn-ghost" id="reset-one" style="width:100%">Restore original text</button>
        </form>
      </div>
    `;
  }

  function renderWeek() {
    const store = loadStore();
    const strip = weekStrip(store);
    const gymWeek = gymSessionsThisWeek(store);
    const streak = stretchStreak(store);
    const dailyN = activeDaily().length;
    const gymN = activeGym().length;
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
            <li>Mark all ${dailyN} enabled daily items to count a stretch day and keep your streak.</li>
            <li>Mark all ${gymN} enabled gym lifts in one day to count 1 of ${DATA.gymGoalPerWeek} weekly sessions.</li>
            <li>Use the Edit tab to remove or rewrite exercises. Changes stay on this phone.</li>
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
    else if (state.view === "edit") html = renderEditForm();
    else if (state.view === "customize") html = renderCustomize();
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
        state.editId = null;
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.getAttribute("data-go");
        state.session = null;
        state.editId = null;
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
        render();
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

    document.querySelectorAll("[data-detail-custom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.detailId = btn.getAttribute("data-detail-custom");
        state.detailFrom = "customize";
        state.view = "detail";
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.editId = btn.getAttribute("data-edit");
        state.view = "edit";
        render();
        window.scrollTo(0, 0);
      });
    });

    document.querySelectorAll("[data-toggle-enabled]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle-enabled");
        const ex = findExercise(id);
        setDisabled(id, !ex.disabled);
        render();
      });
    });

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.customizeFilter = btn.getAttribute("data-filter");
        render();
        window.scrollTo(0, 0);
      });
    });

    const form = document.getElementById("edit-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = form.getAttribute("data-id");
        const fd = new FormData(form);
        saveEdit(id, {
          name: String(fd.get("name") || "").trim(),
          dose: String(fd.get("dose") || "").trim(),
          setup: linesToArray(fd.get("setup")),
          steps: linesToArray(fd.get("steps")),
          why: String(fd.get("why") || "").trim(),
          cue: String(fd.get("cue") || "").trim(),
          skipIf: String(fd.get("skipIf") || "").trim()
        });
        state.view = "customize";
        state.editId = null;
        render();
        window.scrollTo(0, 0);
      });
    }

    const resetOne = document.getElementById("reset-one");
    if (resetOne) {
      resetOne.addEventListener("click", () => {
        resetEdit(state.editId);
        render();
      });
    }

    const resetAll = document.getElementById("reset-custom");
    if (resetAll) {
      resetAll.addEventListener("click", () => {
        if (confirm("Restore every exercise to the original list and text?")) {
          resetAllCustom();
          state.customizeFilter = "daily";
          render();
        }
      });
    }

    const dismiss = document.getElementById("dismiss-install");
    if (dismiss) {
      dismiss.addEventListener("click", () => {
        localStorage.setItem(FIRST_RUN_KEY, "1");
        render();
      });
    }

    if (state.view === "session" && state.session) {
      const list = state.session.type === "daily" ? activeDaily() : activeGym();
      if (state.session.index < list.length) {
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
  }

  if (!window.EXERCISE_DATA) {
    document.getElementById("app").innerHTML =
      '<div class="screen"><p>Failed to load exercise data.</p></div>';
    return;
  }

  render();
})();
