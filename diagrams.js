/* Stick-figure SVG diagrams for each exercise id. Stroke-only, offline-safe. */
(() => {
  const S = {
    stroke: "currentColor",
    muted: "currentColor",
    accent: "#3d9a8b",
    warn: "#c4a35a"
  };

  function svg(inner, opts = {}) {
    const w = opts.w || 320;
    const h = opts.h || 180;
    return `<svg class="ex-diagram-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="${S.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${inner}
      </g>
    </svg>`;
  }

  function floor(y = 160, x1 = 20, x2 = 300) {
    return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke-opacity="0.35" />`;
  }

  function head(cx, cy, r = 10) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
  }

  function line(x1, y1, x2, y2, extra = "") {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra} />`;
  }

  function label(text, x, y) {
    return `<text x="${x}" y="${y}" fill="currentColor" stroke="none" font-size="11" font-family="system-ui,sans-serif" opacity="0.55">${text}</text>`;
  }

  function dumbbell(cx, cy, len = 14) {
    return `
      ${line(cx - len, cy, cx + len, cy)}
      ${line(cx - len, cy - 5, cx - len, cy + 5)}
      ${line(cx + len, cy - 5, cx + len, cy + 5)}
    `;
  }

  function band(x1, y1, x2, y2) {
    return line(x1, y1, x2, y2, `stroke="${S.accent}" stroke-dasharray="4 3" stroke-width="2"`);
  }

  function panel(x, title, body) {
    return `
      ${label(title, x + 8, 18)}
      <g transform="translate(${x},0)">${body}</g>
    `;
  }

  // --- Daily ---

  function doorwayPec() {
    // Standing, forearm on door frame, step through
    return svg(`
      ${floor()}
      ${line(70, 30, 70, 160, 'stroke-opacity="0.4"')}
      ${line(70, 30, 95, 30, 'stroke-opacity="0.4"')}
      ${head(130, 48)}
      ${line(130, 58, 130, 105)}
      ${line(130, 70, 78, 78)}
      ${line(78, 78, 78, 105)}
      ${line(130, 70, 155, 95)}
      ${line(130, 105, 118, 160)}
      ${line(130, 105, 148, 160)}
      ${label("forearm on frame", 160, 90)}
    `);
  }

  function thoracicExtension() {
    // Supine over towel roll
    return svg(`
      ${floor(155)}
      ${head(70, 95)}
      ${line(80, 95, 200, 95)}
      ${line(200, 95, 230, 130)}
      ${line(230, 130, 250, 155)}
      ${line(140, 95, 140, 125)}
      ${line(160, 95, 160, 125)}
      <ellipse cx="145" cy="118" rx="28" ry="10" stroke-opacity="0.7" />
      ${label("towel roll", 175, 140)}
    `);
  }

  function chinTucks() {
    // Side view head: neutral vs tucked
    return svg(`
      ${floor(155)}
      ${panel(0, "nod (wrong)", `
        ${head(70, 55)}
        ${line(70, 65, 70, 110)}
        ${line(70, 80, 55, 95)}
        ${line(70, 80, 90, 95)}
        ${line(70, 110, 55, 150)}
        ${line(70, 110, 90, 150)}
        ${line(62, 52, 78, 62, 'stroke-opacity="0.5"')}
      `)}
      ${panel(160, "tuck (right)", `
        ${head(70, 55)}
        ${line(70, 65, 70, 110)}
        ${line(70, 80, 55, 95)}
        ${line(70, 80, 90, 95)}
        ${line(70, 110, 55, 150)}
        ${line(70, 110, 90, 150)}
        ${line(55, 55, 70, 55, `stroke="${S.accent}"`)}
        ${label("chin back", 78, 50)}
      `)}
    `);
  }

  function upperTrapLevator() {
    // Seated, ear to shoulder + looking to armpit panels
    return svg(`
      ${floor(155)}
      ${panel(0, "ear → shoulder", `
        ${head(75, 48)}
        ${line(75, 58, 75, 100)}
        ${line(75, 70, 55, 85)}
        ${line(75, 70, 100, 70)}
        ${line(100, 70, 110, 100)}
        ${line(75, 100, 60, 140)}
        ${line(75, 100, 95, 140)}
        ${line(55, 140, 115, 140, 'stroke-opacity="0.35"')}
        ${line(68, 42, 55, 55, `stroke="${S.accent}"`)}
      `)}
      ${panel(160, "look to armpit", `
        ${head(80, 52)}
        ${line(80, 62, 80, 100)}
        ${line(80, 75, 60, 90)}
        ${line(80, 75, 105, 75)}
        ${line(105, 75, 115, 100)}
        ${line(80, 100, 65, 140)}
        ${line(80, 100, 100, 140)}
        ${line(55, 140, 120, 140, 'stroke-opacity="0.35"')}
        ${line(80, 48, 95, 62, `stroke="${S.accent}"`)}
      `)}
    `);
  }

  function crossBody() {
    return svg(`
      ${floor()}
      ${head(140, 45)}
      ${line(140, 55, 140, 105)}
      ${line(140, 70, 100, 95)}
      ${line(140, 70, 185, 85)}
      ${line(185, 85, 115, 95)}
      ${line(140, 105, 125, 160)}
      ${line(140, 105, 160, 160)}
      ${label("arm across chest", 175, 120)}
    `);
  }

  function bandEr() {
    // Two panels: start (forearm across belly) and finish (forearm vertical)
    return svg(`
      ${floor(155)}
      ${panel(0, "start", `
        ${head(70, 50)}
        ${line(70, 60, 70, 105)}
        ${line(70, 75, 55, 90)}
        ${line(70, 75, 95, 75)}
        ${line(95, 75, 115, 95)}
        ${line(70, 105, 55, 150)}
        ${line(70, 105, 90, 150)}
        ${band(140, 75, 115, 95)}
        ${dumbbell(118, 98, 8)}
      `)}
      ${panel(160, "finish", `
        ${head(70, 50)}
        ${line(70, 60, 70, 105)}
        ${line(70, 75, 55, 90)}
        ${line(70, 75, 95, 75)}
        ${line(95, 75, 95, 50)}
        ${line(70, 105, 55, 150)}
        ${line(70, 105, 90, 150)}
        ${band(140, 75, 95, 50)}
        ${dumbbell(95, 45, 8)}
        ${label("to vertical", 100, 35)}
      `)}
    `);
  }

  function floorSlides() {
    // Supine, arms in goal-post, arrows up
    return svg(`
      ${floor(150)}
      ${head(55, 95)}
      ${line(65, 95, 200, 95)}
      ${line(200, 95, 230, 130)}
      ${line(230, 130, 245, 150)}
      ${line(100, 95, 100, 70)}
      ${line(100, 70, 70, 70)}
      ${line(160, 95, 160, 70)}
      ${line(160, 70, 190, 70)}
      ${line(70, 70, 70, 45, `stroke="${S.accent}"`)}
      ${line(190, 70, 190, 45, `stroke="${S.accent}"`)}
      ${label("slide up", 200, 50)}
    `);
  }

  // --- Gym ---

  function sidelyingEr() {
    return svg(`
      ${floor(150)}
      ${panel(0, "start", `
        ${head(50, 100)}
        ${line(60, 100, 130, 100)}
        ${line(90, 100, 90, 130)}
        ${line(130, 100, 145, 120)}
        ${line(100, 100, 130, 115)}
        ${dumbbell(135, 118, 7)}
      `)}
      ${panel(160, "finish", `
        ${head(50, 100)}
        ${line(60, 100, 130, 100)}
        ${line(90, 100, 90, 130)}
        ${line(130, 100, 145, 120)}
        ${line(100, 100, 100, 70)}
        ${dumbbell(100, 65, 7)}
        ${label("forearm ↑", 108, 55)}
      `)}
    `);
  }

  function kneelingSaRow() {
    // Half kneeling, cable row
    return svg(`
      ${floor()}
      ${line(280, 40, 280, 160, 'stroke-opacity="0.35"')}
      ${head(150, 48)}
      ${line(150, 58, 150, 100)}
      ${line(150, 100, 130, 160)}
      ${line(150, 100, 175, 130)}
      ${line(175, 130, 175, 160)}
      ${line(150, 72, 200, 78)}
      ${line(150, 72, 115, 85)}
      ${band(200, 78, 275, 70)}
      ${label("cable", 230, 55)}
      ${label("knee down", 100, 150)}
    `);
  }

  function proneT() {
    return svg(`
      ${floor(145)}
      ${line(80, 100, 240, 100, 'stroke-opacity="0.3"')}
      ${head(90, 95)}
      ${line(100, 100, 220, 100)}
      ${line(140, 100, 110, 75)}
      ${line(180, 100, 210, 75)}
      ${dumbbell(108, 72, 7)}
      ${dumbbell(214, 72, 7)}
      ${label("T · thumbs up", 200, 130)}
    `);
  }

  function facePull() {
    return svg(`
      ${floor()}
      ${panel(0, "pull", `
        ${head(90, 50)}
        ${line(90, 60, 90, 110)}
        ${line(90, 75, 130, 70)}
        ${line(90, 75, 130, 80)}
        ${line(90, 110, 75, 155)}
        ${line(90, 110, 110, 155)}
        ${band(130, 70, 155, 55)}
        ${band(130, 80, 155, 60)}
      `)}
      ${panel(160, "finish", `
        ${head(80, 50)}
        ${line(80, 60, 80, 110)}
        ${line(80, 72, 60, 55)}
        ${line(80, 72, 100, 55)}
        ${line(80, 110, 65, 155)}
        ${line(80, 110, 100, 155)}
        ${label("hands @ ears", 55, 40)}
      `)}
    `);
  }

  function pushupPlus() {
    return svg(`
      ${floor(150)}
      ${panel(0, "push-up", `
        ${head(55, 85)}
        ${line(65, 90, 150, 100)}
        ${line(150, 100, 200, 105)}
        ${line(80, 95, 70, 130)}
        ${line(170, 102, 175, 130)}
        ${line(200, 105, 210, 130)}
      `)}
      ${panel(160, "plus", `
        ${head(55, 80)}
        ${line(65, 85, 155, 88)}
        ${line(155, 88, 205, 90)}
        ${line(80, 88, 70, 130)}
        ${line(170, 90, 175, 130)}
        ${line(205, 90, 215, 130)}
        ${line(110, 70, 110, 55, `stroke="${S.accent}"`)}
        ${label("push floor away", 95, 48)}
      `)}
    `);
  }

  function farmerCarry() {
    return svg(`
      ${floor()}
      ${head(160, 40)}
      ${line(160, 50, 160, 105)}
      ${line(160, 70, 130, 110)}
      ${line(160, 70, 190, 110)}
      ${line(160, 105, 145, 160)}
      ${line(160, 105, 175, 160)}
      ${dumbbell(128, 115, 10)}
      ${dumbbell(192, 115, 10)}
      ${label("both hands", 200, 140)}
    `);
  }

  // --- Optional / later ---

  function floorPress() {
    return svg(`
      ${floor(150)}
      ${head(55, 100)}
      ${line(65, 100, 200, 100)}
      ${line(200, 100, 230, 130)}
      ${line(230, 130, 245, 150)}
      ${line(120, 100, 120, 70)}
      ${line(170, 100, 170, 70)}
      ${dumbbell(120, 62, 10)}
      ${dumbbell(170, 62, 10)}
      ${label("triceps on floor", 175, 135)}
    `);
  }

  function cableRow() {
    return svg(`
      ${floor()}
      ${line(40, 70, 40, 160, 'stroke-opacity="0.35"')}
      ${head(160, 55)}
      ${line(160, 65, 160, 110)}
      ${line(160, 80, 110, 85)}
      ${line(160, 80, 120, 90)}
      ${line(160, 110, 145, 160)}
      ${line(160, 110, 180, 160)}
      ${band(110, 85, 45, 80)}
      ${label("seated / chest-supported", 170, 130)}
    `);
  }

  function suitcaseCarry() {
    return svg(`
      ${floor()}
      ${head(160, 40)}
      ${line(160, 50, 160, 105)}
      ${line(160, 70, 130, 100)}
      ${line(160, 70, 185, 95)}
      ${line(160, 105, 145, 160)}
      ${line(160, 105, 175, 160)}
      ${dumbbell(188, 100, 10)}
      ${label("one side only", 200, 130)}
    `);
  }

  function bandLowRow() {
    return svg(`
      ${floor()}
      ${line(40, 80, 40, 160, 'stroke-opacity="0.35"')}
      ${head(160, 50)}
      ${line(160, 60, 160, 110)}
      ${line(160, 75, 115, 85)}
      ${line(160, 75, 125, 90)}
      ${line(160, 110, 145, 160)}
      ${line(160, 110, 180, 160)}
      ${band(115, 85, 45, 90)}
      ${label("blades down & back", 175, 130)}
    `);
  }

  function wallSlides() {
    return svg(`
      ${floor()}
      ${line(60, 25, 60, 160, 'stroke-opacity="0.4"')}
      ${head(95, 50)}
      ${line(95, 60, 95, 110)}
      ${line(95, 75, 70, 55)}
      ${line(95, 75, 70, 70)}
      ${line(95, 110, 80, 160)}
      ${line(95, 110, 115, 160)}
      ${line(70, 55, 70, 35, `stroke="${S.accent}"`)}
      ${label("slide up wall", 120, 45)}
    `);
  }

  function proneY() {
    return svg(`
      ${floor(145)}
      ${line(80, 105, 240, 105, 'stroke-opacity="0.3"')}
      ${head(95, 100)}
      ${line(105, 105, 220, 105)}
      ${line(145, 105, 115, 65)}
      ${line(175, 105, 205, 65)}
      ${dumbbell(112, 62, 7)}
      ${dumbbell(208, 62, 7)}
      ${label("Y · later", 210, 130)}
    `);
  }

  function scaption() {
    return svg(`
      ${floor()}
      ${head(140, 45)}
      ${line(140, 55, 140, 110)}
      ${line(140, 75, 105, 55)}
      ${line(140, 75, 175, 55)}
      ${line(140, 110, 125, 160)}
      ${line(140, 110, 160, 160)}
      ${dumbbell(102, 52, 7)}
      ${dumbbell(178, 52, 7)}
      ${label("~30° forward", 185, 90)}
    `);
  }

  function closedChain() {
    return svg(`
      ${floor(150)}
      ${head(70, 70)}
      ${line(80, 75, 160, 95)}
      ${line(160, 95, 220, 100)}
      ${line(95, 85, 85, 130)}
      ${line(180, 98, 185, 130)}
      ${line(220, 100, 230, 130)}
      ${label("plank hold", 200, 145)}
    `);
  }

  window.DIAGRAMS = {
    "doorway-pec": doorwayPec,
    "thoracic-extension": thoracicExtension,
    "chin-tucks": chinTucks,
    "upper-trap-levator": upperTrapLevator,
    "cross-body": crossBody,
    "band-er": bandEr,
    "floor-slides": floorSlides,
    "sidelying-er": sidelyingEr,
    "kneeling-sa-row": kneelingSaRow,
    "prone-t": proneT,
    "face-pull": facePull,
    "pushup-plus": pushupPlus,
    "farmer-carry": farmerCarry,
    "floor-press": floorPress,
    "cable-row": cableRow,
    "suitcase-carry": suitcaseCarry,
    "band-low-row": bandLowRow,
    "wall-slides": wallSlides,
    "prone-y": proneY,
    scaption: scaption,
    "closed-chain": closedChain
  };
})();
