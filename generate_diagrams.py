"""Generate deterministic, instruction-matched exercise diagrams.

These use solid mannequin forms rather than generative anatomy so each joint,
anchor, and motion path can be checked against exercises.js.
"""

from pathlib import Path

OUT = Path(__file__).parent / "diagrams"
OUT.mkdir(exist_ok=True)

BG = "#071827"
PANEL = "#102536"
BORDER = "#315064"
TEXT = "#f5f1e8"
MUTED = "#a8bdc9"
TEAL = "#3da99c"
TEAL_DARK = "#287c74"
SKIN = "#e8aa7d"
SKIN_EDGE = "#754d3b"
SHORTS = "#303946"
HAIR = "#172635"
EQUIP = "#7c8d98"
RED = "#e56b62"


def esc(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def svg(title, panels, footer=""):
    count = len(panels)
    if count == 2:
        positions = [(24, 558), (618, 558)]
    else:
        positions = [(20, 373), (414, 373), (808, 373)]

    body = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img">',
        f"<title>{esc(title)}</title>",
        "<defs>",
        f'<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="{TEAL}"/></marker>',
        f'<filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".28"/></filter>',
        "</defs>",
        f'<rect width="1200" height="675" fill="{BG}"/>',
    ]
    for (x, width), (label, content) in zip(positions, panels):
        body += [
            f'<g transform="translate({x},0)">',
            f'<rect x="0" y="28" width="{width}" height="596" rx="22" fill="{PANEL}" stroke="{BORDER}" stroke-width="2"/>',
            f'<text x="28" y="76" fill="{TEXT}" font-family="system-ui,sans-serif" font-size="24" font-weight="750" letter-spacing="1">{esc(label)}</text>',
            content,
            "</g>",
        ]
    if footer:
        body.append(
            f'<text x="600" y="657" text-anchor="middle" fill="{MUTED}" font-family="system-ui,sans-serif" font-size="18">{esc(footer)}</text>'
        )
    body.append("</svg>")
    return "\n".join(body)


def limb(x1, y1, x2, y2, width=28, color=SKIN, opacity=1):
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke="{SKIN_EDGE}" stroke-width="{width + 5}" stroke-linecap="round" opacity="{opacity}"/>'
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke="{color}" stroke-width="{width}" stroke-linecap="round" opacity="{opacity}"/>'
    )


def joint(x, y, r=15, opacity=1):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SKIN}" stroke="{SKIN_EDGE}" stroke-width="3" opacity="{opacity}"/>'


def head(x, y, r=30, tilt=0, profile=False):
    face = (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SKIN}" stroke="{SKIN_EDGE}" stroke-width="3"/>'
        f'<path d="M{x-r+3} {y-7} Q{x-r+5} {y-r-8} {x+12} {y-r+1} Q{x+r+5} {y-r+10} {x+r-2} {y-3}" fill="{HAIR}"/>'
    )
    if profile:
        face += f'<path d="M{x+r-2} {y-4} l10 5 -10 5" fill="{SKIN}" stroke="{SKIN_EDGE}" stroke-width="2"/>'
    if tilt:
        return f'<g transform="rotate({tilt} {x} {y})">{face}</g>'
    return face


def torso(cx, top, width=104, height=160, angle=0):
    x = cx - width / 2
    shape = (
        f'<rect x="{x}" y="{top}" width="{width}" height="{height}" rx="34" '
        f'fill="{TEAL_DARK}" stroke="{BORDER}" stroke-width="3"/>'
        f'<path d="M{x+16} {top+28} Q{cx} {top+12} {x+width-16} {top+28}" fill="none" stroke="{TEAL}" stroke-width="7" opacity=".65"/>'
    )
    if angle:
        return f'<g transform="rotate({angle} {cx} {top+height/2})">{shape}</g>'
    return shape


def shorts(cx, top, width=108, height=72, angle=0):
    x = cx - width / 2
    shape = f'<rect x="{x}" y="{top}" width="{width}" height="{height}" rx="16" fill="{SHORTS}" stroke="{BORDER}" stroke-width="3"/>'
    if angle:
        return f'<g transform="rotate({angle} {cx} {top+height/2})">{shape}</g>'
    return shape


def arrow(path, dashed=False):
    dash = ' stroke-dasharray="10 8"' if dashed else ""
    return f'<path d="{path}" fill="none" stroke="{TEAL}" stroke-width="8" stroke-linecap="round" marker-end="url(#arrow)"{dash}/>'


def label(text, x, y, anchor="middle", color=MUTED, size=17):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{color}" font-family="system-ui,sans-serif" font-size="{size}" font-weight="650">{esc(text)}</text>'


def floor(y=574, x1=45, x2=515):
    return f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{BORDER}" stroke-width="4"/>'


def dumbbell(x, y, angle=0):
    shape = (
        f'<g transform="rotate({angle} {x} {y})">'
        f'<line x1="{x-23}" y1="{y}" x2="{x+23}" y2="{y}" stroke="{EQUIP}" stroke-width="10"/>'
        f'<rect x="{x-34}" y="{y-18}" width="15" height="36" rx="5" fill="{EQUIP}"/>'
        f'<rect x="{x+19}" y="{y-18}" width="15" height="36" rx="5" fill="{EQUIP}"/>'
        "</g>"
    )
    return shape


def standing_front(cx=279, top=175, walking=False):
    parts = [head(cx, top - 42), torso(cx, top), shorts(cx, top + 148)]
    shoulder_y = top + 38
    hip_y = top + 213
    if walking:
        parts += [
            limb(cx - 22, hip_y, cx - 62, hip_y + 130, 38),
            limb(cx + 22, hip_y, cx + 65, hip_y + 118, 38),
            limb(cx - 62, hip_y + 130, cx - 110, hip_y + 152, 27),
            limb(cx + 65, hip_y + 118, cx + 100, hip_y + 148, 27),
        ]
    else:
        parts += [
            limb(cx - 25, hip_y, cx - 35, hip_y + 142, 38),
            limb(cx + 25, hip_y, cx + 35, hip_y + 142, 38),
        ]
    parts += [joint(cx - 50, shoulder_y), joint(cx + 50, shoulder_y)]
    return "".join(parts)


def doorway():
    start = [
        floor(),
        '<rect x="405" y="95" width="18" height="480" rx="5" fill="#80909a"/>',
        head(210, 152, profile=True),
        torso(210, 190),
        shorts(210, 342),
        limb(190, 408, 175, 555, 39),
        limb(230, 408, 255, 555, 39),
        limb(260, 225, 388, 225, 34),
        joint(388, 225, 18),
        limb(388, 225, 388, 125, 30),
        joint(388, 125, 13),
        limb(162, 225, 150, 355, 30),
        label("FOREARM FLAT ON JAMB", 352, 605),
    ]
    end = [
        floor(),
        '<rect x="235" y="95" width="18" height="480" rx="5" fill="#80909a"/>',
        head(385, 152, profile=True),
        torso(385, 190),
        shorts(385, 342),
        limb(365, 408, 315, 555, 39),
        limb(405, 408, 475, 545, 39),
        limb(335, 225, 220, 225, 34),
        joint(220, 225, 18),
        limb(220, 225, 220, 125, 30),
        joint(220, 125, 13),
        limb(435, 225, 445, 355, 30),
        arrow("M270 475 C320 475 360 475 405 475"),
        label("BODY STEPS PAST FIXED ARM", 310, 605),
    ]
    return svg("Doorway pec stretch", [("START", "".join(start)), ("OPEN CHEST", "".join(end))], "Elbow stays at shoulder height; the body moves through the doorway.")


def thoracic():
    def pose(opened=False):
        spine = (
            '<path d="M170 400 Q255 332 350 420 Q375 444 405 448" '
            f'fill="none" stroke="{TEAL_DARK}" stroke-width="92" stroke-linecap="round" stroke-linejoin="round"/>'
            if opened
            else '<path d="M170 405 Q260 402 350 425 Q375 442 405 448" '
            f'fill="none" stroke="{TEAL_DARK}" stroke-width="92" stroke-linecap="round"/>'
        )
        return "".join(
            [
                floor(520),
                '<rect x="260" y="468" width="82" height="34" rx="16" fill="#c7b69c" stroke="#776b5b" stroke-width="4"/>',
                spine,
                head(137, 392 if not opened else 410, profile=True),
                shorts(390, 397, 95, 64),
                limb(420, 452, 465, 340, 38),
                limb(465, 340, 500, 515, 34),
                limb(178, 380, 112, 355, 26),
                limb(112, 355, 95, 412, 24),
                label("TOWEL UNDER MID-BACK", 300, 552),
                arrow("M205 345 Q270 292 332 347") if opened else "",
            ]
        )

    return svg("Thoracic extension over towel", [("SET UP", pose(False)), ("GENTLE DRAPE", pose(True))], "Head supported; movement comes from the mid-back, not the low back.")


def chin_tuck():
    def bust(head_x, tucked=False):
        return "".join(
            [
                '<path d="M115 580 Q145 390 245 370 Q360 382 415 580 Z" fill="#303946"/>',
                '<path d="M190 580 Q208 410 290 397 Q357 410 375 580 Z" fill="#287c74"/>',
                '<rect x="250" y="282" width="62" height="135" rx="25" fill="#e8aa7d" stroke="#754d3b" stroke-width="3"/>',
                head(head_x, 255, 72, profile=True),
                label("EYES STAY LEVEL", 280, 110),
                arrow(f"M{head_x+84} 255 L{head_x-28} 255") if tucked else "",
                label("STRAIGHT BACK", 280, 530, color=TEAL) if tucked else label("NEUTRAL", 280, 530),
            ]
        )

    return svg("Chin tuck", [("START", bust(300, False)), ("TUCK", bust(260, True))], "The head glides backward as one unit; do not nod the chin down.")


def seated_neck(levator=False):
    hand_x = 392
    head_x = 235 if not levator else 245
    head_y = 178 if not levator else 194
    return "".join(
        [
            '<rect x="155" y="465" width="250" height="24" rx="8" fill="#6f7e89"/>',
            '<line x1="180" y1="489" x2="170" y2="575" stroke="#6f7e89" stroke-width="16"/>',
            '<line x1="380" y1="489" x2="390" y2="575" stroke="#6f7e89" stroke-width="16"/>',
            torso(280, 240, 118, 205),
            shorts(280, 430, 122, 62),
            limb(247, 492, 220, 575, 40),
            limb(313, 492, 340, 575, 40),
            limb(275, 245, head_x, head_y + 25, 22),
            head(head_x, head_y, 37, profile=levator),
            (
                f'<path d="M{head_x-35} {head_y-4} l-12 6 12 6" fill="{SKIN}" stroke="{SKIN_EDGE}" stroke-width="2"/>'
                if levator
                else ""
            ),
            limb(330, 280, 390, 460, 28),
            joint(hand_x, 462, 13),
            limb(230, 275, 190 if not levator else 205, 145, 28),
            limb(190 if not levator else 205, 145, head_x if not levator else head_x + 20, 145, 24),
            label("RIGHT HAND HOLDS SEAT", 345, 535),
            arrow("M300 135 Q275 190 250 220") if levator else arrow("M300 145 Q260 175 235 205"),
            label("RIGHT SHOULDER STAYS DOWN", 280, 605),
        ]
    )


def cross_body():
    def pose(farther=False):
        shoulder = (225, 250)
        elbow = (330 if not farther else 365, 250)
        hand = (440 if not farther else 485, 250)
        return "".join(
            [
                head(280, 160),
                torso(280, 205, 125, 260),
                shorts(280, 450, 130, 72),
                limb(*shoulder, *elbow, 32),
                limb(*elbow, *hand, 27),
                joint(*elbow, 17),
                limb(335, 280, elbow[0], elbow[1], 27),
                joint(elbow[0], elbow[1], 13),
                arrow("M300 330 L430 330") if farther else "",
                label("SUPPORT JUST ABOVE ELBOW", 330, 565),
            ]
        )

    return svg("Cross-body posterior stretch", [("START", pose(False)), ("GENTLE PULL", pose(True))], "Keep the torso and shoulder level; draw the arm farther across the chest.")


def band_er():
    def pose(out=False):
        elbow = (205, 330)
        hand = (105, 330) if out else (300, 330)
        return "".join(
            [
                '<circle cx="510" cy="330" r="13" fill="#7c8d98"/>',
                head(280, 145),
                torso(280, 185, 125, 250),
                shorts(280, 420, 130, 78),
                limb(230, 235, *elbow, 32),
                joint(*elbow, 18),
                '<rect x="188" y="300" width="24" height="58" rx="9" fill="#d6d1c5"/>',
                limb(*elbow, *hand, 28),
                joint(*hand, 13),
                f'<line x1="510" y1="330" x2="{hand[0]}" y2="{hand[1]}" stroke="{TEAL}" stroke-width="7"/>',
                arrow("M285 385 Q205 430 120 372") if out else "",
                label("ELBOW + TOWEL DO NOT MOVE", 280, 555),
            ]
        )

    return svg("Band external rotation at side", [("START — HAND AT BELLY", pose(False)), ("ROTATE OUT", pose(True))], "Anchor is across the body; the working hand moves away from it.")


def floor_slide():
    def pose(up=False):
        parts = [
            '<rect x="225" y="175" width="110" height="255" rx="42" fill="#287c74" stroke="#315064" stroke-width="3"/>',
            head(280, 140),
            shorts(280, 410, 116, 70),
            limb(255, 480, 205, 545, 38),
            limb(205, 545, 170, 485, 32),
            limb(305, 480, 355, 545, 38),
            limb(355, 545, 390, 485, 32),
            label("KNEES BENT • FEET FLAT", 280, 535),
        ]
        if up:
            parts += [
                limb(235, 225, 160, 155, 31),
                limb(160, 155, 135, 90, 27),
                limb(325, 225, 400, 155, 31),
                limb(400, 155, 425, 90, 27),
                arrow("M130 260 Q105 180 135 105"),
                arrow("M430 260 Q455 180 425 105"),
            ]
        else:
            parts += [
                limb(235, 230, 145, 230, 31),
                limb(145, 230, 145, 135, 27),
                limb(325, 230, 415, 230, 31),
                limb(415, 230, 415, 135, 27),
            ]
        parts.append(label("BACKS OF HANDS / FOREARMS NEAR FLOOR", 280, 590))
        return "".join(parts)

    return svg("Supine floor slides", [("GOALPOST START", floor_slide_pose := pose(False)), ("SLIDE TOWARD OVERHEAD", pose(True))], "Both arms move symmetrically; stop before shrugging or pinching.")


def sidelying_er():
    def pose(up=False):
        elbow = (290, 350)
        hand = (290, 205) if up else (205, 370)
        return "".join(
            [
                floor(520),
                head(95, 375),
                '<rect x="125" y="315" width="260" height="105" rx="45" fill="#287c74" stroke="#315064" stroke-width="3"/>',
                '<rect x="365" y="325" width="95" height="92" rx="20" fill="#303946"/>',
                limb(430, 350, 510, 375, 38),
                limb(430, 395, 510, 420, 38),
                limb(190, 330, *elbow, 31),
                joint(*elbow, 18),
                limb(*elbow, *hand, 28),
                dumbbell(*hand, 90 if up else -10),
                arrow("M215 390 Q245 255 290 215") if up else "",
                label("ELBOW STAYS ON RIBS", 280, 575),
            ]
        )

    return svg("Side-lying external rotation", [("FOREARM ACROSS BELLY", pose(False)), ("STOP AT VERTICAL", pose(True))], "Only the forearm rotates; do not roll the torso or let the elbow lift.")


def kneeling_row():
    def pose(pulled=False):
        hand = (320, 300) if pulled else (145, 300)
        elbow = (235, 300) if pulled else (205, 300)
        return "".join(
            [
                floor(),
                '<rect x="38" y="160" width="20" height="330" fill="#6f7e89"/>',
                '<circle cx="55" cy="300" r="13" fill="#7c8d98"/>',
                f'<line x1="55" y1="300" x2="{hand[0]}" y2="{hand[1]}" stroke="#9aa9b2" stroke-width="6"/>',
                head(335, 170, profile=True),
                torso(335, 205, 100, 190),
                shorts(335, 375, 112, 72),
                limb(310, 445, 250, 555, 39),
                limb(360, 445, 435, 510, 39),
                limb(435, 510, 495, 555, 32),
                limb(285, 250, *elbow, 31),
                limb(*elbow, *hand, 27),
                joint(*elbow, 17),
                arrow("M165 350 L300 350") if pulled else "",
                label("TORSO STAYS TALL + STILL", 300, 605),
            ]
        )

    return svg("Half-kneeling single-arm cable row", [("ARM LONG", kneeling_row_pose := pose(False)), ("HANDLE TO HIP / RIBS", pose(True))], "Pull the elbow close to the side; do not twist or shrug.")


def prone_raise(kind):
    is_y = kind == "y"

    def pose(raised=False):
        parts = [
            '<rect x="175" y="165" width="210" height="355" rx="22" fill="#4e5d68"/>',
            head(280, 130),
            '<rect x="222" y="170" width="116" height="250" rx="42" fill="#287c74" stroke="#315064" stroke-width="3"/>',
            shorts(280, 405, 118, 75),
            limb(255, 480, 245, 570, 38),
            limb(305, 480, 315, 570, 38),
        ]
        if raised:
            if is_y:
                parts += [
                    limb(235, 220, 140, 135, 31),
                    limb(140, 135, 105, 90, 26),
                    limb(325, 220, 420, 135, 31),
                    limb(420, 135, 455, 90, 26),
                    arrow("M170 260 Q120 190 105 110"),
                    arrow("M390 260 Q440 190 455 110"),
                ]
            else:
                parts += [
                    limb(235, 230, 135, 230, 31),
                    limb(135, 230, 70, 230, 26),
                    limb(325, 230, 425, 230, 31),
                    limb(425, 230, 490, 230, 26),
                    arrow("M150 305 L85 240"),
                    arrow("M410 305 L475 240"),
                ]
        else:
            parts += [
                limb(235, 230, 150, 285, 31, opacity=.9),
                limb(150, 285, 145, 410, 26, opacity=.9),
                limb(325, 230, 410, 285, 31, opacity=.9),
                limb(410, 285, 415, 410, 26, opacity=.9),
                arrow("M125 295 L125 395"),
                arrow("M435 295 L435 395"),
                label("ARMS HANG BELOW BENCH", 280, 570),
            ]
        return "".join(parts)

    name = "Prone Y raise" if is_y else "Prone T raise"
    end = "RAISE INTO Y" if is_y else "RAISE INTO T"
    footer_text = "Thumbs up; lift without shrugging." if is_y else "Thumbs up; stop at shoulder height without shrugging."
    return svg(name, [("START — ARMS HANG", pose(False)), (end, pose(True))], footer_text)


def face_pull():
    def pose(pulled=False):
        parts = [
            head(280, 170),
            torso(280, 210, 120, 230),
            shorts(280, 425, 125, 72),
            limb(255, 495, 240, 570, 38),
            limb(305, 495, 320, 570, 38),
        ]
        if pulled:
            parts += [
                limb(230, 250, 150, 285, 31),
                limb(150, 285, 230, 185, 27),
                limb(330, 250, 410, 285, 31),
                limb(410, 285, 330, 185, 27),
                f'<line x1="230" y1="185" x2="280" y2="110" stroke="{EQUIP}" stroke-width="6"/>',
                f'<line x1="330" y1="185" x2="280" y2="110" stroke="{EQUIP}" stroke-width="6"/>',
                arrow("M115 330 Q170 240 225 205"),
                arrow("M445 330 Q390 240 335 205"),
                label("HANDS BY EARS", 280, 540, color=TEAL),
                label("ELBOWS NOT ABOVE SHOULDERS", 280, 575),
            ]
        else:
            parts += [
                limb(230, 250, 255, 330, 31),
                limb(255, 330, 275, 360, 27),
                limb(330, 250, 305, 330, 31),
                limb(305, 330, 285, 360, 27),
                f'<line x1="275" y1="360" x2="280" y2="110" stroke="{EQUIP}" stroke-width="6"/>',
                f'<line x1="285" y1="360" x2="280" y2="110" stroke="{EQUIP}" stroke-width="6"/>',
                label("ARMS REACH FORWARD", 280, 555),
            ]
        return "".join(parts)

    return svg("Face pull to ear height", [("START", face_pull_pose := pose(False)), ("SAFE FINISH", pose(True))], "Hands finish beside the ears; never pull into a high 90/90 throwing position.")


def pushup_plus():
    def pose(plus=False):
        shoulder_y = 300 if not plus else 280
        back_path = "M145 300 Q260 290 370 300" if not plus else "M145 300 Q255 240 370 300"
        return "".join(
            [
                floor(525),
                f'<path d="{back_path}" fill="none" stroke="{TEAL_DARK}" stroke-width="78" stroke-linecap="round"/>',
                head(405, 285, profile=True),
                shorts(145, 265, 95, 68),
                limb(115, 315, 55, 500, 38),
                limb(175, 315, 125, 505, 38),
                limb(370, shoulder_y, 385, 500, 34),
                limb(385, 500, 430, 515, 22),
                arrow("M270 370 Q270 310 270 255") if plus else "",
                label("SHOULDER BLADES SPREAD", 280, 570, color=TEAL) if plus else label("TOP OF NORMAL PUSH-UP", 280, 570),
            ]
        )

    return svg("Push-up plus", [("TOP POSITION", pose(False)), ("THE PLUS", pose(True))], "Keep elbows straight and push the floor away so the upper back gently rounds.")


def carry(one_sided=False):
    def pose(walking=False):
        parts = [standing_front(280, 175, walking)]
        if one_sided:
            hand = (220, 360) if not walking else (205, 360)
            parts += [limb(230, 220, *hand, 28), dumbbell(*hand), limb(330, 220, 350, 360, 28)]
            parts.append(label("ONE WEIGHT ONLY", 280, 560, color=TEAL))
        else:
            left = (205, 365) if not walking else (190, 360)
            right = (355, 365) if not walking else (365, 350)
            parts += [
                limb(230, 220, *left, 28),
                limb(330, 220, *right, 28),
                dumbbell(*left),
                dumbbell(*right),
                label("MATCHED WEIGHTS", 280, 560, color=TEAL),
            ]
        if walking:
            parts.append(arrow("M150 115 L410 115"))
        parts.append(label("SHOULDERS + HIPS LEVEL", 280, 595))
        return "".join(parts)

    title = "Suitcase carry" if one_sided else "Farmer carry"
    footer_text = "Stay vertical; do not lean toward or away from the weight." if one_sided else "Walk tall with two matched weights and quiet shoulders."
    return svg(title, [("SET UP", pose(False)), ("WALK TALL", pose(True))], footer_text)


def floor_press():
    def pose(top=False):
        parts = [
            '<rect x="220" y="145" width="120" height="300" rx="45" fill="#287c74" stroke="#315064" stroke-width="3"/>',
            head(280, 120),
            shorts(280, 430, 120, 70),
            limb(255, 500, 235, 570, 38),
            limb(305, 500, 325, 570, 38),
        ]
        if top:
            parts += [
                limb(235, 225, 215, 125, 31),
                limb(215, 125, 215, 85, 27),
                limb(325, 225, 345, 125, 31),
                limb(345, 125, 345, 85, 27),
                dumbbell(215, 75),
                dumbbell(345, 75),
                arrow("M170 280 L205 120"),
                arrow("M390 280 L355 120"),
            ]
        else:
            parts += [
                limb(235, 225, 145, 260, 31),
                limb(145, 260, 190, 180, 27),
                limb(325, 225, 415, 260, 31),
                limb(415, 260, 370, 180, 27),
                dumbbell(190, 170, -20),
                dumbbell(370, 170, 20),
                label("TRICEPS / ELBOWS REST ON FLOOR", 280, 560),
            ]
        return "".join(parts)

    return svg("Dumbbell floor press", [("BOTTOM — FLOOR STOPS RANGE", pose(False)), ("PRESS UP", pose(True))], "Lower with control until both upper arms meet the floor; do not bounce.")


def cable_row():
    def pose(pulled=False):
        hand = (300, 300) if pulled else (135, 300)
        elbow = (220, 300) if pulled else (205, 300)
        return "".join(
            [
                '<rect x="50" y="120" width="22" height="390" fill="#6f7e89"/>',
                '<circle cx="62" cy="300" r="13" fill="#7c8d98"/>',
                f'<line x1="62" y1="300" x2="{hand[0]}" y2="{hand[1]}" stroke="#9aa9b2" stroke-width="6"/>',
                '<rect x="315" y="430" width="180" height="28" rx="8" fill="#6f7e89"/>',
                head(355, 175, profile=True),
                torso(355, 210, 100, 205),
                shorts(355, 400, 110, 65),
                limb(330, 465, 390, 555, 38),
                limb(380, 465, 455, 555, 38),
                limb(305, 250, *elbow, 31),
                limb(*elbow, *hand, 27),
                arrow("M145 350 L290 350") if pulled else "",
                label("CHEST TALL — NO SHRUG", 300, 605),
            ]
        )

    return svg("Seated cable row", [("ARMS LONG", cable_row_pose := pose(False)), ("HANDLE TO LOWER RIBS", pose(True))], "Return with control; do not yank into end range.")


def band_low_row():
    def pose(pulled=False):
        hand = (300, 300) if pulled else (150, 300)
        elbow = (225, 300) if pulled else (215, 300)
        return "".join(
            [
                '<circle cx="55" cy="300" r="13" fill="#7c8d98"/>',
                f'<line x1="55" y1="300" x2="{hand[0]}" y2="{hand[1]}" stroke="{TEAL}" stroke-width="7"/>',
                head(360, 170, profile=True),
                torso(360, 205, 100, 220),
                shorts(360, 410, 110, 72),
                limb(340, 482, 325, 565, 38),
                limb(380, 482, 405, 565, 38),
                limb(310, 250, *elbow, 31),
                limb(*elbow, *hand, 27),
                arrow("M150 350 L295 350") if pulled else "",
                label("STAND TALL — ELBOWS NEAR SIDES", 300, 605),
            ]
        )

    return svg("Band low row", [("ARMS LONG", band_low_row_pose := pose(False)), ("ELBOWS TO LOWER RIBS", pose(True))], "Anchor at mid-chest or slightly lower; draw shoulder blades down and back.")


def wall_slide():
    def pose(up=False):
        parts = [
            '<rect x="65" y="92" width="430" height="495" rx="8" fill="#233848" stroke="#617989" stroke-width="3"/>',
            head(280, 165),
            torso(280, 205, 120, 250),
            shorts(280, 440, 125, 72),
            limb(255, 512, 240, 575, 38),
            limb(305, 512, 320, 575, 38),
        ]
        if up:
            parts += [
                limb(230, 250, 180, 150, 31),
                limb(180, 150, 170, 100, 27),
                limb(330, 250, 380, 150, 31),
                limb(380, 150, 390, 100, 27),
                arrow("M140 315 Q125 205 168 120"),
                arrow("M420 315 Q435 205 392 120"),
            ]
        else:
            parts += [
                limb(230, 255, 155, 275, 31),
                limb(155, 275, 155, 190, 27),
                limb(330, 255, 405, 275, 31),
                limb(405, 275, 405, 190, 27),
            ]
        parts.append(label("BACK, HEAD + ARMS AGAINST WALL", 280, 605))
        return "".join(parts)

    return svg("Wall slides", [("LOW W / GOALPOST", wall_slide_pose := pose(False)), ("SLIDE UP", pose(True))], "Keep ribs quiet and stop before the shoulders shrug.")


def scaption():
    def pose(up=False):
        parts = [standing_front(280, 175, False)]
        if up:
            parts += [
                limb(230, 220, 145, 135, 31),
                limb(145, 135, 115, 80, 27),
                limb(330, 220, 415, 135, 31),
                limb(415, 135, 445, 80, 27),
                dumbbell(110, 70, 65),
                dumbbell(450, 70, -65),
                arrow("M140 330 Q85 220 110 95"),
                arrow("M420 330 Q475 220 450 95"),
                label("THUMBS UP — ABOUT 120°", 280, 560, color=TEAL),
                label("ARMS SLIGHTLY FORWARD OF A SIDE RAISE", 280, 592),
            ]
        else:
            parts += [
                limb(230, 220, 210, 360, 28),
                limb(330, 220, 350, 360, 28),
                dumbbell(210, 365),
                dumbbell(350, 365),
            ]
        return "".join(parts)

    return svg("Standing scaption", [("START", scaption_pose := pose(False)), ("RAISE IN SCAPULAR PLANE", pose(True))], "Stop below any pinch, shrug, or instability sensation.")


def closed_chain():
    wall = "".join(
        [
            '<rect x="40" y="160" width="25" height="350" fill="#6f7e89"/>',
            '<path d="M85 290 L250 390 L325 510" fill="none" stroke="#287c74" stroke-width="70" stroke-linecap="round"/>',
            head(250, 360, 25, profile=True),
            limb(205, 360, 65, 300, 25),
            limb(215, 385, 65, 345, 25),
            label("WALL PLANK", 186, 570),
        ]
    )
    knees = "".join(
        [
            floor(520, 30, 340),
            '<path d="M85 445 L220 325 L320 350" fill="none" stroke="#287c74" stroke-width="65" stroke-linecap="round"/>',
            head(338, 340, 24, profile=True),
            limb(300, 350, 315, 505, 25),
            limb(285, 370, 270, 505, 25),
            limb(105, 445, 70, 515, 34),
            label("KNEE PLANK", 186, 570),
        ]
    )
    side = "".join(
        [
            floor(520, 30, 340),
            '<path d="M80 430 L225 340 L310 350" fill="none" stroke="#287c74" stroke-width="65" stroke-linecap="round"/>',
            head(330, 340, 24, profile=True),
            limb(280, 355, 270, 505, 27),
            limb(210, 335, 210, 205, 25),
            limb(95, 430, 55, 505, 34),
            label("SIDE PLANK ON HAND", 186, 570),
        ]
    )
    return svg("Closed-chain shoulder hold progression", [("1 — EASIEST", wall), ("2 — PROGRESS", knees), ("3 — LATER", side)], "Hold a quiet, centered shoulder; no sagging or shrugging.")


DIAGRAMS = {
    "doorway-pec": doorway(),
    "thoracic-extension": thoracic(),
    "chin-tucks": chin_tuck(),
    "upper-trap-levator": svg(
        "Neck side stretch",
        [("UPPER TRAP", seated_neck(False)), ("LEVATOR", seated_neck(True))],
        "Stretch the right side shown: right hand anchors the shoulder down.",
    ),
    "cross-body": cross_body(),
    "band-er": band_er(),
    "floor-slides": floor_slide(),
    "sidelying-er": sidelying_er(),
    "kneeling-sa-row": kneeling_row(),
    "prone-t": prone_raise("t"),
    "face-pull": face_pull(),
    "pushup-plus": pushup_plus(),
    "farmer-carry": carry(False),
    "floor-press": floor_press(),
    "cable-row": cable_row(),
    "suitcase-carry": carry(True),
    "band-low-row": band_low_row(),
    "wall-slides": wall_slide(),
    "prone-y": prone_raise("y"),
    "scaption": scaption(),
    "closed-chain": closed_chain(),
}

for exercise_id, content in DIAGRAMS.items():
    (OUT / f"{exercise_id}.svg").write_text(content, encoding="utf-8")

print(f"Generated {len(DIAGRAMS)} checked SVG diagrams in {OUT}")
