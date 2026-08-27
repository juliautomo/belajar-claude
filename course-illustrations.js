// Shared hand-drawn course illustrations + matching background gradients — used by both
// index.html (marketing course-library grid, logged-in "Pilih apa yang ingin kamu
// pelajari" grid) and dashboard.html (the "Jelajahi Kursus" explore carousel), so both
// pages show identical artwork per course instead of drifting out of sync like the
// "coming soon" dimming rule did before course-card-shared.css was split out (see that
// file's own header comment for the precedent this follows).
//
// Usage: LIH_ILLUSTRATIONS[slug] gives the full <svg> markup (viewBox 400x100, draws in
// black-ink line art with purple #6C47FF accents), LIH_BG[slug] gives the matching pastel
// gradient to use behind it. Fall back to a plain icon/color when a slug isn't present —
// not every course (especially "coming soon" ones) has a custom illustration yet.
//
// The animated pieces inside these SVGs (running dog, blinking cursor, pulsing sparkle,
// etc.) rely on the .lih-illustration / @keyframes lih* / .lih-* animation rules defined
// in each page's own <style> block — this file only provides the markup and colors.

var LIH_BG = {
  'prompt-gratis':     'linear-gradient(135deg,#C7CBFF,#EEF0FF)',
  'mulai-claude':      'linear-gradient(135deg,#B7F0D6,#E6FBF0)',
  'produktivitas':     'linear-gradient(135deg,#FBD98A,#FDF0D5)',
  'content-marketing': 'linear-gradient(135deg,#FBC2D9,#FDE9F1)',
  'strategi-marketing':'linear-gradient(135deg,#A8D8FF,#E4F3FF)',
  'analisis-data':     'linear-gradient(135deg,#9FE8D8,#E3FBF5)',
  'claude-sehari-hari':'linear-gradient(135deg,#FFC9A8,#FFF0E4)',
  'bikin-website':     'linear-gradient(135deg,#D9CBFF,#F2ECFF)'
};
var LIH_ILLUSTRATIONS = {
  // This one's viewBox is tighter than the others (5 10 205 90, not 0 0 400 100) —
  // its drawn content (person + speech bubble + pen + sparkle) only ever occupied
  // roughly x:20-190 of the original 400-wide canvas, so the artwork rendered visibly
  // shifted left with empty space on the right. Cropped the viewBox to the actual
  // content's bounding box (with a little padding) so it fills and centers properly.
  'prompt-gratis': '<svg class="lih-illustration" viewBox="5 10 205 90" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="20" y1="82" x2="210" y2="82" stroke="#111" stroke-width="2.5" opacity="0.25"/>' +
    '<rect x="46" y="52" width="30" height="28" rx="10" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<circle cx="61" cy="38" r="13" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<path d="M52 34 Q61 22 70 34" fill="none" stroke="#111" stroke-width="2.5"/>' +
    '<g class="lih-pen" style="transform-origin:78px 62px"><line x1="78" y1="62" x2="112" y2="54" stroke="#111" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="54" r="3.5" fill="#6C47FF"/></g>' +
    '<rect x="100" y="42" width="72" height="46" rx="6" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<line class="lih-scribble" x1="110" y1="55" x2="152" y2="55" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.6"/>' +
    '<line class="lih-scribble-2" x1="110" y1="65" x2="160" y2="65" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.6"/>' +
    '<line class="lih-scribble-3" x1="110" y1="75" x2="144" y2="75" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.6"/>' +
    '<g class="lih-sparkle" style="transform-origin:180px 34px"><path d="M180 26 L183 33 L190 34 L183 35 L180 42 L177 35 L170 34 L177 33 Z" fill="#6C47FF"/></g>' +
    '</svg>',
  'mulai-claude': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line class="lih-ground" x1="0" y1="84" x2="400" y2="84" stroke="#111" stroke-width="3" stroke-dasharray="10 10" opacity="0.25"/>' +
    '<circle cx="368" cy="20" r="11" fill="#FBD98A" stroke="#111" stroke-width="2"/>' +
    '<g stroke="#111" stroke-width="2" opacity="0.5"><line x1="368" y1="4" x2="368" y2="10"/><line x1="384" y1="12" x2="379" y2="16"/><line x1="390" y1="26" x2="383" y2="24"/></g>' +
    '<rect x="24" y="58" width="6" height="24" fill="#111" opacity="0.3"/>' +
    '<circle cx="27" cy="46" r="17" fill="#BFEAD1" stroke="#111" stroke-width="2" opacity="0.9"/>' +
    '<g class="lih-run-a"><rect x="150" y="44" width="34" height="30" rx="8" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<line x1="167" y1="44" x2="167" y2="34" stroke="#111" stroke-width="2.5"/><circle cx="167" cy="31" r="3.5" fill="#6C47FF"/>' +
    '<circle cx="159" cy="58" r="2.5" fill="#111"/><circle cx="175" cy="58" r="2.5" fill="#111"/>' +
    '<g class="lih-leg-a" style="transform-origin:158px 74px"><line x1="158" y1="74" x2="158" y2="88" stroke="#111" stroke-width="4" stroke-linecap="round"/></g>' +
    '<g class="lih-leg-b" style="transform-origin:176px 74px"><line x1="176" y1="74" x2="176" y2="88" stroke="#111" stroke-width="4" stroke-linecap="round"/></g></g>' +
    '<g class="lih-run-b"><ellipse cx="240" cy="66" rx="24" ry="11" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<circle cx="265" cy="58" r="10" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<path d="M260 50 L264 40 L268 50 Z" fill="#fff" stroke="#111" stroke-width="2"/>' +
    '<rect x="255" y="63" width="10" height="5" rx="2" fill="#6C47FF" opacity="0.85"/>' +
    '<g class="lih-tail" style="transform-origin:218px 62px"><path d="M218 62 Q206 50 212 42" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/></g>' +
    '<g class="lih-leg-b" style="transform-origin:228px 76px"><line x1="228" y1="76" x2="228" y2="88" stroke="#111" stroke-width="4" stroke-linecap="round"/></g>' +
    '<g class="lih-leg-a" style="transform-origin:250px 76px"><line x1="250" y1="76" x2="250" y2="88" stroke="#111" stroke-width="4" stroke-linecap="round"/></g></g>' +
    '</svg>',
  'produktivitas': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="352" cy="22" r="10" fill="none" stroke="#111" stroke-width="2" opacity="0.4"/>' +
    '<line x1="352" y1="22" x2="352" y2="15" stroke="#111" stroke-width="2" opacity="0.4"/><line x1="352" y1="22" x2="357" y2="24" stroke="#111" stroke-width="2" opacity="0.4"/>' +
    '<rect x="120" y="66" width="150" height="10" rx="4" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<line x1="135" y1="76" x2="135" y2="88" stroke="#111" stroke-width="2.5" opacity="0.4"/><line x1="255" y1="76" x2="255" y2="88" stroke="#111" stroke-width="2.5" opacity="0.4"/>' +
    '<circle cx="140" cy="46" r="12" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M126 66 Q140 54 154 66" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<circle cx="195" cy="40" r="12" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M181 66 Q195 50 209 66" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="180" y="55" width="30" height="11" rx="2" fill="#fff" stroke="#111" stroke-width="2"/>' +
    '<line class="lih-cursor" x1="185" y1="60" x2="185" y2="66" stroke="#6C47FF" stroke-width="2"/><line x1="190" y1="60" x2="204" y2="60" stroke="#111" stroke-width="1.5" opacity="0.4"/>' +
    '<circle cx="250" cy="46" r="12" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M236 66 Q250 54 264 66" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<g class="lih-bubble" style="transform-origin:140px 20px"><rect x="118" y="10" width="44" height="20" rx="8" fill="#fff" stroke="#111" stroke-width="2"/>' +
    '<path d="M134 30 L130 37 L140 30 Z" fill="#fff" stroke="#111" stroke-width="2"/>' +
    '<circle class="lih-dot1" cx="130" cy="20" r="2.2" fill="#6C47FF"/><circle class="lih-dot2" cx="140" cy="20" r="2.2" fill="#6C47FF"/><circle class="lih-dot3" cx="150" cy="20" r="2.2" fill="#6C47FF"/></g>' +
    '</svg>',
  'content-marketing': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="60" y1="88" x2="320" y2="88" stroke="#111" stroke-width="2.5" opacity="0.2"/>' +
    '<g class="lih-sparkle" style="transform-origin:150px 24px"><path d="M150 17 L153 23 L159 24 L153 25 L150 31 L147 25 L141 24 L147 23 Z" fill="#6C47FF"/></g>' +
    '<circle cx="118" cy="38" r="12" fill="#fff" stroke="#111" stroke-width="3"/><path d="M107 33 Q118 20 129 33" fill="none" stroke="#111" stroke-width="2.5"/>' +
    '<path d="M100 86 Q100 54 118 50 Q136 54 136 86 Z" fill="#FBC2D9" stroke="#111" stroke-width="2.5"/>' +
    '<path d="M100 66 Q90 72 92 82" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="252" cy="42" r="12" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<path d="M243 88 Q243 60 252 56 Q261 60 261 88 Z" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<g class="lih-cam" style="transform-origin:280px 58px"><rect x="264" y="48" width="34" height="22" rx="4" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<rect x="274" y="42" width="10" height="7" rx="2" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<circle cx="281" cy="59" r="8" fill="none" stroke="#111" stroke-width="3"/><circle cx="281" cy="59" r="3.5" fill="#6C47FF"/></g>' +
    '<circle class="lih-flash" cx="281" cy="59" r="16" fill="#FFD84D" opacity="0"/>' +
    '</svg>',
  'strategi-marketing': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="60" y1="88" x2="320" y2="88" stroke="#111" stroke-width="2.5" opacity="0.2"/>' +
    '<polyline points="90,78 130,58 170,66 210,36 250,44 290,20" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="90" cy="78" r="4" fill="#6C47FF"/><circle cx="130" cy="58" r="4" fill="#6C47FF"/><circle cx="170" cy="66" r="4" fill="#6C47FF"/>' +
    '<circle cx="210" cy="36" r="4" fill="#6C47FF"/><circle cx="250" cy="44" r="4" fill="#6C47FF"/><circle cx="290" cy="20" r="4" fill="#6C47FF"/>' +
    '<rect x="300" y="46" width="26" height="42" rx="4" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<line x1="306" y1="54" x2="320" y2="54" stroke="#111" stroke-width="2" opacity="0.4"/><line x1="306" y1="62" x2="320" y2="62" stroke="#111" stroke-width="2" opacity="0.4"/><line x1="306" y1="70" x2="316" y2="70" stroke="#111" stroke-width="2" opacity="0.4"/>' +
    '</svg>',
  'analisis-data': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="100" y1="88" x2="290" y2="88" stroke="#111" stroke-width="2.5" opacity="0.2"/>' +
    '<rect x="120" y="68" width="22" height="20" rx="3" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="154" y="56" width="22" height="32" rx="3" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="188" y="44" width="22" height="44" rx="3" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="222" y="32" width="22" height="56" rx="3" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<circle class="lih-dot1" cx="131" cy="58" r="2.5" fill="#6C47FF"/>' +
    '<circle class="lih-dot2" cx="165" cy="46" r="2.5" fill="#6C47FF"/>' +
    '<circle class="lih-dot3" cx="199" cy="34" r="2.5" fill="#6C47FF"/>' +
    '<g class="lih-bubble" style="transform-origin:255px 46px"><circle cx="252" cy="44" r="15" fill="none" stroke="#111" stroke-width="3"/>' +
    '<circle cx="252" cy="44" r="4" fill="#6C47FF"/>' +
    '<line x1="263" y1="55" x2="272" y2="64" stroke="#111" stroke-width="3.5" stroke-linecap="round"/></g>' +
    '<g class="lih-sparkle" style="transform-origin:300px 24px"><path d="M300 16 L303 23 L310 24 L303 25 L300 32 L297 25 L290 24 L297 23 Z" fill="#6C47FF"/></g>' +
    '</svg>',
  // Home + person with coffee + chat bubble — reads as "daily life", not productivity.
  // Content was drawn in a 400x100 canvas but only occupies roughly x:15-240, which the
  // shared .lih-illustration 1.3x zoom (see each page's <style>) crops to a visible
  // window of about x:60-340 — so it was clipping most of the house on the left. Wrapped
  // everything in a translate(55,0) to shift the whole scene right into that window
  // (matches the fix already validated in illustration_preview.html).
  'claude-sehari-hari': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="translate(55,0)">' +
    '<line x1="15" y1="88" x2="330" y2="88" stroke="#111" stroke-width="2.5" opacity="0.2"/>' +
    '<path d="M22 58 L50 34 L78 58 Z" fill="#fff" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<rect x="28" y="58" width="44" height="30" rx="2" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="44" y="70" width="12" height="18" rx="1" fill="#6C47FF" opacity="0.85"/>' +
    '<circle cx="62" cy="68" r="5" fill="none" stroke="#111" stroke-width="2"/>' +
    '<line x1="62" y1="63" x2="62" y2="73" stroke="#111" stroke-width="1.2" opacity="0.5"/>' +
    '<line x1="57" y1="68" x2="67" y2="68" stroke="#111" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M132 88 Q132 62 152 58 Q172 62 172 88 Z" fill="#FFC9A8" stroke="#111" stroke-width="2.5"/>' +
    '<circle cx="152" cy="44" r="13" fill="#fff" stroke="#111" stroke-width="3"/>' +
    '<path d="M141 39 Q152 26 163 39" fill="none" stroke="#111" stroke-width="2.5"/>' +
    '<rect x="182" y="70" width="20" height="18" rx="3" fill="#fff" stroke="#111" stroke-width="2.3"/>' +
    '<path d="M202 75 Q212 75 212 82 Q212 89 202 87" fill="none" stroke="#111" stroke-width="2.2"/>' +
    '<path class="lih-scribble" d="M188 68 Q185 60 189 54" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>' +
    '<path class="lih-scribble-2" d="M196 68 Q193 60 197 54" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>' +
    '<g class="lih-bubble" style="transform-origin:152px 18px"><rect x="128" y="6" width="48" height="22" rx="9" fill="#fff" stroke="#111" stroke-width="2.2"/>' +
    '<path d="M146 28 L142 36 L154 28 Z" fill="#fff" stroke="#111" stroke-width="2.2"/>' +
    '<circle class="lih-dot1" cx="138" cy="17" r="2.4" fill="#6C47FF"/><circle class="lih-dot2" cx="152" cy="17" r="2.4" fill="#6C47FF"/><circle class="lih-dot3" cx="166" cy="17" r="2.4" fill="#6C47FF"/></g>' +
    '<g class="lih-sparkle" style="transform-origin:230px 20px"><path d="M230 12 L233 19 L240 20 L233 21 L230 28 L227 21 L220 20 L227 19 Z" fill="#6C47FF"/></g>' +
    '</g>' +
    '</svg>',
  // Sketchpad + pen sketching a layout, an arrow turning that sketch into a real browser
  // window with a hero block/text lines/button, a cursor clicking the button, a sparkle,
  // and a small globe — reads as "design it, then publish it live on the internet".
  'bikin-website': '<svg class="lih-illustration" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="70" y1="88" x2="330" y2="88" stroke="#111" stroke-width="2.5" opacity="0.2"/>' +
    '<rect x="75" y="38" width="34" height="42" rx="3" fill="#fff" stroke="#111" stroke-width="2.3"/>' +
    '<line x1="82" y1="48" x2="102" y2="48" stroke="#111" stroke-width="1.8" opacity="0.4"/>' +
    '<line x1="82" y1="56" x2="98" y2="56" stroke="#111" stroke-width="1.8" opacity="0.4"/>' +
    '<line x1="82" y1="64" x2="102" y2="64" stroke="#111" stroke-width="1.8" opacity="0.4"/>' +
    '<g class="lih-pen" style="transform-origin:98px 46px"><line x1="86" y1="54" x2="100" y2="40" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M98 42 L102 38 L100 36 Z" fill="#6C47FF"/></g>' +
    '<path d="M113 58 Q121 58 127 58" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M123 54 L129 58 L123 62" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="132" y="24" width="140" height="58" rx="6" fill="#fff" stroke="#111" stroke-width="2.5"/>' +
    '<line x1="132" y1="38" x2="272" y2="38" stroke="#111" stroke-width="2"/>' +
    '<circle cx="141" cy="31" r="2.2" fill="#111"/><circle cx="149" cy="31" r="2.2" fill="#111"/><circle cx="157" cy="31" r="2.2" fill="#111"/>' +
    '<rect x="140" y="46" width="46" height="28" rx="3" fill="#6C47FF" opacity="0.18" stroke="#111" stroke-width="2"/>' +
    '<path d="M142 70 L154 58 L162 66 L174 52 L184 70 Z" fill="#6C47FF" opacity="0.35"/><circle cx="152" cy="55" r="4" fill="#6C47FF" opacity="0.5"/>' +
    '<line x1="192" y1="50" x2="262" y2="50" stroke="#111" stroke-width="2.2" opacity="0.4"/>' +
    '<line x1="192" y1="58" x2="252" y2="58" stroke="#111" stroke-width="2.2" opacity="0.3"/>' +
    '<line x1="192" y1="66" x2="242" y2="66" stroke="#111" stroke-width="2.2" opacity="0.3"/>' +
    '<rect x="192" y="72" width="42" height="10" rx="5" fill="#6C47FF"/>' +
    '<path class="lih-cursor" d="M239 78 L239 96 L243.5 92 L247 99.5 L250.5 98 L247 90.5 L252 90 Z" fill="#111"/>' +
    '<g class="lih-sparkle" style="transform-origin:284px 26px"><path d="M284 18 L287 25 L294 26 L287 27 L284 34 L281 27 L274 26 L281 25 Z" fill="#6C47FF"/></g>' +
    '<g class="lih-bubble" style="transform-origin:308px 50px"><circle cx="308" cy="50" r="14" fill="none" stroke="#111" stroke-width="2.5"/>' +
    '<ellipse cx="308" cy="50" rx="6" ry="14" fill="none" stroke="#111" stroke-width="1.5" opacity="0.5"/>' +
    '<line x1="294" y1="50" x2="322" y2="50" stroke="#111" stroke-width="1.5" opacity="0.5"/>' +
    '<line x1="297" y1="42" x2="319" y2="42" stroke="#111" stroke-width="1.3" opacity="0.4"/>' +
    '<line x1="297" y1="58" x2="319" y2="58" stroke="#111" stroke-width="1.3" opacity="0.4"/></g>' +
    '</svg>'
};
