/* Exercise library for the shoulder & back phone tracker.
   Educational only — not medical advice. No clinic notes in this file. */

window.EXERCISE_DATA = {
  dailyGoal: 7,
  gymGoalPerWeek: 3,
  daily: [
    {
      id: "doorway-pec",
      group: "daily",
      name: "Doorway pec stretch",
      dose: "30 sec × 3–5 each side",
      setup: [
        "Stand in a doorway with one forearm on the frame, elbow about shoulder height.",
        "Feet staggered so you can step through the door.",
        "Keep your neck long — do not crane your chin forward."
      ],
      steps: [
        "Gently step forward until you feel a stretch across the front of the chest and shoulder.",
        "Breathe slowly. Hold 30 seconds.",
        "Switch sides. Repeat 3–5 holds per side."
      ],
      why: "Desk work and phone hunching shorten the pecs and pull your shoulders forward. Opening the chest was a big part of what helped your 2025 right-shoulder flare calm down. Loose front tissues make it easier for the mid-back and lower traps to do their job.",
      cue: "Left shoulder: stop if you feel a pinchy stretch in the front of the joint or a “coming out” sensation. Soften the step or drop the elbow slightly.",
      skipIf: "Sharp front-shoulder pain or apprehension on the left."
    },
    {
      id: "thoracic-extension",
      group: "daily",
      name: "Thoracic extension (towel)",
      dose: "8–10 slow breaths",
      setup: [
        "No foam roller needed. Roll a bath towel tightly into a firm cylinder about the size of a water bottle.",
        "Lie on your back on the floor. Place the towel roll across your mid-back, just below the shoulder blades (not under the low back).",
        "Bend your knees, feet flat. Interlace your fingers behind your head to support the neck, or rest your head on the floor if that feels fine.",
        "No towel? Sit tall in a chair, hands behind your head, and lean back gently over the top of the chair back instead."
      ],
      steps: [
        "Let your upper back open over the towel — a gentle “drape,” not a hard arch.",
        "Keep your ribs from flaring wildly. Breathe into the chest and sides for 8–10 slow breaths.",
        "If you want more, scoot so the towel sits an inch higher or lower and breathe again on the stiffest spot.",
        "Chair version: lean back a little, open the chest, take the same slow breaths, then sit tall again."
      ],
      why: "A stiff mid-back and slumped posture load the neck and upper traps — the pattern behind your quarterly “cricks” and upper-back ache. This is the posture reset that paired with your new chair in 2025, rewritten so a bath towel is enough.",
      cue: "Motion belongs in the mid-back. If your neck or low back does all the work, make the towel taller/firmer or use a smaller lean.",
      skipIf: "Dizziness, sharp neck pain, or arm tingling that gets worse and stays worse."
    },
    {
      id: "chin-tucks",
      group: "daily",
      name: "Chin tucks",
      dose: "2 × 10 holds of 5 sec",
      setup: [
        "Easiest: lie on your back on the floor, knees bent. Put a thin folded washcloth under your head if needed so your face is level (nose toward ceiling).",
        "Or sit tall in a chair, feet flat, looking straight ahead at eye level (not down at your phone).",
        "Relax your jaw — tongue resting on the roof of the mouth helps."
      ],
      steps: [
        "Imagine a string pulling the back of your skull straight back into the floor/chair — your chin slides back, not down.",
        "Check in a mirror or with a finger on your chin: the chin should move backward into a soft “double chin,” while your eyes stay looking forward. Do not nod like you’re saying yes.",
        "Hold that pulled-back position for 5 seconds while breathing normally. You should feel a gentle work in the front of the neck and a lengthening in the back.",
        "Relax fully for 2 seconds. Repeat 10 times. Rest, then do a second set of 10."
      ],
      why: "This trains the deep muscles in the front of the neck that hold your head over your shoulders. When they’re lazy, the upper traps and neck joints take over — linked to your arm tingling and desk posture.",
      cue: "If you’re nodding or looking at your toes, you’re doing a different exercise. Think “turtle pulling its head into its shell” — straight back.",
      skipIf: "Arm pain, numbness, or tingling increases and does not settle within a minute."
    },
    {
      id: "upper-trap-levator",
      group: "daily",
      name: "Neck side stretch (upper trap + levator)",
      dose: "30 sec × 2 each stretch, each side",
      setup: [
        "Sit tall on a chair. Plant both feet on the floor.",
        "To stretch the right side of the neck: hold the right edge of the seat with your right hand. That stops the right shoulder from hiking up.",
        "Keep looking forward with a long neck before you start."
      ],
      steps: [
        "Upper trap stretch (side bend): Slowly tip your left ear toward your left shoulder. Stop when you feel a mild pull from the right ear down into the right shoulder/neck. Optional: rest your left hand lightly on the right side of your head — no pulling hard. Hold 30 seconds. Switch sides.",
        "Levator stretch (look to armpit): Sit tall again, right hand still holding the seat. Turn your nose about halfway toward your left armpit, then gently nod as if looking into that armpit. You should feel the pull a bit deeper along the right neck into the shoulder blade. Hold 30 seconds. Switch sides.",
        "Do 2 holds of each stretch on each side. Breathe; never bounce."
      ],
      why: "You overuse the upper traps when the lower traps are weak — the imbalance your chiro linked to nerve pinching and finger tingling. These two stretches hit the tight side-neck muscles that shrug and hike when you desk-sit.",
      cue: "The stretching-side shoulder must stay down (that’s why you hold the chair). Mild pull = good. Zap down the arm = stop.",
      skipIf: "Radiating arm symptoms worsen or you feel dizzy."
    },
    {
      id: "cross-body",
      group: "daily",
      name: "Cross-body posterior stretch",
      dose: "30 sec × 3–5 each side",
      setup: [
        "Sit or stand tall. Bring one arm across the front of your chest.",
        "Use the other hand to support just above the elbow."
      ],
      steps: [
        "Gently pull the arm across until you feel a stretch in the back of the shoulder.",
        "Keep the shoulder blade from winging wildly; mild stretch only.",
        "Hold 30 seconds. Switch sides."
      ],
      why: "Posterior shoulder tightness is common in active people and can alter how the ball sits in the socket. For the right shoulder (post-surgery history), gentle posterior mobility helps. On the left, treat this as optional and light.",
      cue: "Left: shorten the stretch or skip if it feels unstable or “slides.” Prefer comfort over range.",
      skipIf: "Left-shoulder apprehension or a sense the joint is shifting."
    },
    {
      id: "band-er",
      group: "daily",
      name: "Band external rotation (at side)",
      dose: "2–3 × 12–15 each side",
      setup: [
        "Anchor a light band at elbow height. Stand sideways to the anchor.",
        "Working elbow bent 90°, glued to a rolled towel against your ribs.",
        "Wrist neutral. Soft knees."
      ],
      steps: [
        "Rotate the forearm outward against the band without letting the elbow drift off the towel.",
        "Pause briefly, then return with control.",
        "No shrugging. Complete all reps, then switch sides."
      ],
      why: "This is the highest-value early drill for infraspinatus and lower-trap balance below 90° elevation — exactly what a still-loose left shoulder needs before you load overhead or go into the “cocked” position.",
      cue: "Elbow stays glued. Left side: lighter band, stop if you feel slide or front-joint apprehension.",
      skipIf: "Pain >3/10 or instability sensation."
    },
    {
      id: "floor-slides",
      group: "daily",
      name: "Floor slides (wall-slide alternative)",
      dose: "2 × 8–10",
      setup: [
        "Lie on your back on the floor (carpet or a mat). Knees bent, feet flat.",
        "Press your low back gently toward the floor; ribs quiet.",
        "Bend your elbows and place the backs of your hands and forearms on the floor beside your head — like a goal-post or cactus shape. Wrists can stay slightly off the floor if needed."
      ],
      steps: [
        "Slowly slide both arms upward along the floor (toward overhead), only as far as the backs of the hands/forearms can stay near the floor without your shoulders shrugging toward your ears.",
        "Pause 1 second, then slide back down to the starting goal-post shape.",
        "If one side lifts or pinches first (often the left), stop at that height and work there — don’t force a full overhead reach."
      ],
      why: "Same job as wall slides — teach the shoulder blades to rotate up with serratus and lower trap — but you only need floor space, not a wide clear wall.",
      cue: "No shrug. Left: shorter range is fine. Quality over how high you reach.",
      skipIf: "Front-shoulder pinch, numbness, or forced shrug to get higher."
    }
  ],
  gym: [
    {
      id: "sidelying-er",
      group: "gym",
      name: "Side-lying external rotation",
      dose: "3 × 12–15 each side",
      setup: [
        "Lie on your non-working side. Put a light dumbbell in the top hand (start 2–5 lb / 1–2 kg — ego is useless here).",
        "Bend the top elbow to 90°. Rest that elbow on your ribs (or on a small towel against your side) so the upper arm stays glued to your body.",
        "Start with the forearm across your stomach — palm facing your belly. Head on your bottom arm or a pad. Hips stacked; don’t roll backward."
      ],
      steps: [
        "Keeping the elbow pinned to your side, rotate the forearm up until it points roughly at the ceiling (forearm vertical, about 90° of rotation from the start).",
        "That is the top — you do NOT need to go past vertical or flop the weight behind you. If the dumbbell wants to fall backward, you’ve gone too far; stop at vertical.",
        "Pause 1 second, then lower slowly in 2–3 seconds back to the belly-start position.",
        "If the last 3 reps are shaky or you roll your torso to cheat, the weight is too heavy. Finish the set, then switch sides. Use ~30% less on the left if it feels loose."
      ],
      why: "One of the best drills for posterior cuff + lower-trap balance without going overhead — high value for your trap imbalance and left-shoulder stability.",
      cue: "Elbow stays glued. Top = forearm vertical, not past it. No body roll.",
      skipIf: "Apprehension or sharp pain."
    },
    {
      id: "kneeling-sa-row",
      group: "gym",
      name: "Kneeling single-arm cable row",
      dose: "3 × 10–12 each side",
      setup: [
        "Set a cable handle at about mid-chest height (or slightly lower).",
        "Half-kneeling: one knee down (same side as the working arm often feels stable; either is fine), the other foot planted in front with the shin roughly vertical — the stance you already like.",
        "Hold the handle in the working hand, arm long toward the stack. Tall torso, soft ribs, eyes forward. Non-working hand can rest on the front thigh."
      ],
      steps: [
        "Row the handle to the lower ribs / hip pocket — elbow stays close to your side, not flared high.",
        "As you pull, draw that shoulder blade down and back (into the back pocket). Do not shrug toward the ear.",
        "Pause 1 second, then reach forward with control until the shoulder blade opens again — don’t let the cable yank you into a rounded, shrugged finish.",
        "Finish all reps, then switch legs and arms. Left side: lighter stack if it feels unstable."
      ],
      why: "Same mid-back job as a seated row, but your preferred half-kneeling stance adds trunk control and makes it harder to cheat with both arms. Safer horizontal pull than pull-ups for your history.",
      cue: "Pull to the hip/ribs, blade down-and-back, no ear-shrug. Tall through the crown of the head.",
      skipIf: "Neck cranking, front-shoulder “open” feeling, or joint slide."
    },
    {
      id: "prone-t",
      group: "gym",
      name: "Prone / chest-supported T",
      dose: "3 × 10–12",
      setup: [
        "Lie face-down on an incline bench or flat bench with light dumbbells (or no weight).",
        "Arms hang, thumbs pointing up (external rotation bias).",
        "Forehead supported or neck neutral."
      ],
      steps: [
        "Raise the arms out to the sides into a T shape at about shoulder height — not overhead.",
        "Lead with the thumbs; squeeze the mid-back.",
        "Lower slowly. Keep the upper traps quiet."
      ],
      why: "Hits middle and lower trap without going into the overhead Y yet — ideal while the left shoulder is usable but still feels loose.",
      cue: "Thumbs up. Stop at ~90°. If you shrug to lift, drop the weight.",
      skipIf: "Need to hike the shoulders to complete the set."
    },
    {
      id: "face-pull",
      group: "gym",
      name: "Face-pull to ear height",
      dose: "3 × 12",
      setup: [
        "Cable with a rope, set around face / upper-chest height. Grab the rope ends with thumbs pointing backward (or a neutral grip).",
        "Step back until arms are straight and there is light tension. Soft knees, tall posture.",
        "Mental picture of the finish: hands beside your ears, like you’re framing your face — elbows pointing down-ish or out at shoulder height, NOT up by your head in a “stick-up” / throwing cock."
      ],
      steps: [
        "Pull the rope toward your face by driving the elbows back.",
        "As the rope approaches your nose/forehead line, gently rotate the hands so the knuckles end near the ears (small external rotation). Think “show the wall your knuckles beside your ears.”",
        "Stop there. Do not keep pulling until elbows are high and the fronts of the shoulders feel stretched open — that 90/90 end range is the risky position after your dislocations.",
        "Pause 1 second, then straighten the arms forward with control. Reset and repeat."
      ],
      why: "Trains rear shoulders and mid-back for posture. We deliberately finish at ear height so you get the benefit without parking the arm in the apprehension position that can reload a loose left shoulder.",
      cue: "Finish = hands by ears, elbows not higher than shoulders. If it feels like a stretch across the front of the joint, you’ve gone too far — shorten the pull.",
      skipIf: "Any sense of the arm cocking into instability."
    },
    {
      id: "pushup-plus",
      group: "gym",
      name: "Push-up + (plus)",
      dose: "3 × 8–12",
      setup: [
        "Yes — full (toe) push-ups are fine if you can hold a solid plank and the left shoulder feels quiet.",
        "Hands under shoulders, body in one line from head to heels. If full push-ups break down (hips sag, shrug, or front-shoulder pinch), drop to knees or hands on a bench — same rules.",
        "Neck long; don’t crane looking forward."
      ],
      steps: [
        "Lower into a normal push-up, then press back to the top plank.",
        "Here is the important extra: at the top, push the floor away so your upper back rounds slightly and the shoulder blades slide apart around the ribcage — that is the “plus.” Hold 1 second.",
        "Do not shrug the shoulders into your ears during the plus. Then lower into the next rep.",
        "If full push-ups are easy but the plus disappears, slow down and cut reps until every rep has a clear plus."
      ],
      why: "Normal push-ups train the chest and triceps; the plus is what hits serratus — the scapular muscle that pairs with your lower trap. That’s the piece that matters for your shoulder-blade control.",
      cue: "Plus = push the floor away (shoulder blades spread), not hike the shoulders. Regress to knees/incline if form breaks.",
      skipIf: "Front-shoulder pain or inability to control the scapula."
    },
    {
      id: "farmer-carry",
      group: "gym",
      name: "Farmer carry (preferred)",
      dose: "3 × 30–40 m",
      setup: [
        "Default for you: farmer carry — one dumbbell or kettlebell in EACH hand, matched weights.",
        "Choose a load you can walk tall with: shoulders packed down, ribs quiet, eyes forward. If you shrug or lean, go lighter.",
        "Clear a walking path. Suitcase (one side only) is a harder variation — save it for later; see Optional."
      ],
      steps: [
        "Pick up both weights, stand tall, and walk 30–40 meters.",
        "Stay level — no hiking one shoulder, no side-bend, no looking down at your phone.",
        "Set both weights down with control. Rest, then repeat for 3 total carries."
      ],
      why: "Farmer (both hands) is the better default for your posture and upper-trap problem: it loads both sides evenly and rewards quiet shoulders. Suitcase carry is great for core anti-side-bend but asymmetrically loads one shoulder — less ideal as your main carry while the left still feels loose.",
      cue: "Tall and quiet. Two matching weights. If the neck tenses, use less load.",
      skipIf: "Pain, numbness, or inability to keep the shoulders packed."
    }
  ],
  optional: [
    {
      id: "floor-press",
      group: "optional",
      name: "Dumbbell floor press",
      dose: "3 × 8–12 (optional)",
      setup: [
        "Lie on your back on the floor with dumbbells.",
        "Knees bent. Upper arms rest on the floor at the bottom of each rep."
      ],
      steps: [
        "Press the bells up, then lower until triceps meet the floor.",
        "The floor stops the elbows from traveling behind the body — safer than a full bench for an anteriorly loose shoulder.",
        "Do not bounce off the floor."
      ],
      why: "Optional push volume that respects the anterior capsule. Not required for the weekly gym checklist.",
      cue: "Left lighter. No arching to get more range.",
      skipIf: "Apprehension or front-shoulder pain."
    },
    {
      id: "cable-row",
      group: "optional",
      name: "Chest-supported / seated cable row",
      dose: "3 × 10–12",
      setup: [
        "Chest-supported row machine, or seated cable with a neutral grip.",
        "Feet planted. Spine long."
      ],
      steps: [
        "Pull to the lower ribs. Shoulder blades down and back — no shrug.",
        "Return with control."
      ],
      why: "Alternate to your main kneeling single-arm row if the cable bay is taken or you want a bilateral version.",
      cue: "No shrug, no end-range yank.",
      skipIf: "Neck cranking or joint slide."
    },
    {
      id: "suitcase-carry",
      group: "optional",
      name: "Suitcase carry (one-sided)",
      dose: "3 × 30–40 m each side",
      setup: [
        "One dumbbell or kettlebell in one hand only. Other hand free.",
        "Only after farmer carries feel easy and tall."
      ],
      steps: [
        "Walk without leaning away from or into the weight — hips and shoulders level.",
        "Switch hands each carry."
      ],
      why: "Harder core challenge than farmer carries. Not your default while the left shoulder is still loose — farmer first.",
      cue: "Stay vertical. If you hike the loaded shoulder, go lighter.",
      skipIf: "Pain, numbness, or inability to stay level."
    },
    {
      id: "band-low-row",
      group: "optional",
      name: "Band low row (skipped from daily)",
      dose: "2–3 × 12",
      setup: [
        "Anchor the band in front of you at about mid-chest or slightly lower.",
        "Hold the ends, arms long, soft elbows.",
        "Stand tall — think “proud chest,” not arched low back."
      ],
      steps: [
        "Pull the elbows back near your sides while drawing the shoulder blades down and back.",
        "Imagine putting your shoulder blades into your back pockets — no upward shrug.",
        "Hold 1 second, then reach forward with control."
      ],
      why: "Removed from your daily checklist per your request. Still here if you want it later — gym rows already cover a lot of this pattern.",
      cue: "Down and back, never up. If the neck tenses, lighten the band.",
      skipIf: "Neck pain spikes or you cannot avoid shrugging."
    },
    {
      id: "wall-slides",
      group: "optional",
      name: "Wall slides (if you get wall space)",
      dose: "2 × 8–10",
      setup: [
        "Stand with your back, head, and butt lightly against a wall.",
        "Backs of hands and forearms on the wall in a goal-post or low W shape.",
        "Ribs quiet — do not flare the chest hard."
      ],
      steps: [
        "Slide the arms up the wall only as high as you can without shrugging.",
        "Pause, then slide back down with control."
      ],
      why: "Classic version of floor slides. Your daily program uses the floor version instead because you lack a wide clear wall.",
      cue: "Left: stay lower. Quality over height.",
      skipIf: "Front-shoulder pinch or forced shrug."
    }
  ],
  later: [
    {
      id: "prone-y",
      group: "later",
      name: "Prone / chest-supported Y",
      dose: "3 × 8–12 — unlock later",
      setup: [
        "Same setup as the T, but arms raise on a ~45° diagonal into a Y.",
        "Only after Phase 1 feels easy and the left shoulder is quiet for 1–2 weeks."
      ],
      steps: [
        "Raise into a Y without shrugging.",
        "Thumbs up. Lower slowly."
      ],
      why: "Gold-standard lower-trap drill, but it is overhead. Wait until the left side trusts you.",
      cue: "If you shrug or feel slide, go back to Ts and floor slides.",
      skipIf: "Any instability."
    },
    {
      id: "scaption",
      group: "later",
      name: "Standing scaption",
      dose: "3 × 10 — unlock later",
      setup: [
        "Light dumbbells, thumbs up, raise in the scapular plane (~30° forward of pure side raise)."
      ],
      steps: [
        "Raise to about 120° only if pain-free and shrug-free.",
        "Lower slowly."
      ],
      why: "MOON phase-2 cuff endurance. Not day one after a second left dislocation.",
      cue: "No hike. Stop below the height that forces compensation.",
      skipIf: "Pinch or apprehension."
    },
    {
      id: "closed-chain",
      group: "later",
      name: "Closed-chain holds",
      dose: "3 × 20–30 sec — unlock later",
      setup: [
        "Progress: wall plank → knee plank → side plank on the hand."
      ],
      steps: [
        "Hold a quiet shoulder position under body-weight compression.",
        "No sagging or shrugging."
      ],
      why: "Teaches the cuff to co-contract and center the ball — useful before return to sport.",
      cue: "Quality holds beat long shaky ones.",
      skipIf: "Pain or instability."
    }
  ],
  safety: {
    painRule:
      "Muscle burn and mild joint awareness (≤3/10) that is gone the next day is OK. Sharp anterior “it’s coming out,” radiating arm pain, or next-day stiffness that is worse means stop or regress.",
    avoid: [
      "Abduction + external rotation together (the throwing “cock” / apprehension position), including 90/90 face-pulls and upright rows",
      "Pull-ups, kipping, and dips — known trigger for your interscapular injuries and high anterior shear",
      "Bench, flyes, or pulldowns where elbows travel behind the body",
      "Behind-the-neck press or pulldown",
      "Heavy overhead press until Phase 1 is boringly easy",
      "Aggressive sleeper stretch on the left if it feels unstable"
    ],
    phase2Unlock: [
      "Daily routine feels easy for 1–2 weeks",
      "Gym loads are progressing without next-day flares",
      "Left shoulder does not feel like it will sublux on ER-at-side or rows"
    ],
    redFlags: [
      "Recurrent subluxation / dislocation, or a new “dead arm”",
      "Progressive numbness, weakness, or tingling that worsens after sessions",
      "Night pain getting worse, or new unexplained swelling",
      "Left shoulder still frankly loose after 6–8 weeks of consistent work — get imaging / sports-med follow-up, not just more exercise"
    ],
    disclaimer:
      "This app is an educational home program based on published rehab principles and your own history notes. It is not a diagnosis or a substitute for a physical therapist or orthopedist."
  }
};
