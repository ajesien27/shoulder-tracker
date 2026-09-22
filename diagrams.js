/* Deterministic, instruction-matched exercise illustrations. */
(() => {
  const captions = {
    "doorway-pec": "Forearm on the frame. Step through until the chest opens.",
    "thoracic-extension": "Towel under the mid-back. Let the chest drape open.",
    "chin-tucks": "Chin glides straight back — do not nod down.",
    "upper-trap-levator": "Ear toward the shoulder, then nose toward the armpit.",
    "cross-body": "Arm across the chest. Gently pull at the elbow.",
    "band-er": "Elbow pinned to the side. Rotate the forearm outward.",
    "floor-slides": "On your back. Slide the arms up along the floor.",
    "sidelying-er": "Elbow on the ribs. Raise the forearm toward the ceiling.",
    "kneeling-sa-row": "Half-kneel. Pull the cable to the hip — torso still.",
    "prone-t": "Arms out to a T. Lift only to shoulder height.",
    "face-pull": "Pull to the face. Hands finish at ear height.",
    "pushup-plus": "Top of a push-up, then push the shoulder blades up.",
    "farmer-carry": "A weight in each hand. Walk tall with quiet shoulders.",
    "floor-press": "Press up, then lower until the elbows meet the floor.",
    "cable-row": "Chest tall. Pull the handle to the lower ribs.",
    "suitcase-carry": "One weight. Walk without leaning to the side.",
    "band-low-row": "Band low in front. Pull the elbows back to the hips.",
    "wall-slides": "Back and arms on the wall. Slide the arms up.",
    "prone-y": "Arms into a Y. Lift only as high as the shoulders allow.",
    scaption: "Raise slightly forward of a side raise, thumbs up, toward 120°.",
    "closed-chain": "Progress from wall plank to knee plank to side plank."
  };

  const map = {};
  Object.keys(captions).forEach((id) => {
    map[id] = {
      src: `./diagrams/${id}.svg`,
      caption: captions[id]
    };
  });

  window.DIAGRAMS = map;
})();
