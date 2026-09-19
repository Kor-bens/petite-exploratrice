
let worldKey = "espace";
let mode = "explore";
let qi = 0;
let stars = Number(localStorage.getItem("pe_stars") || 0);
let locked = false;
document.getElementById("starCount").textContent = stars;

function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.92;
    const voices = speechSynthesis.getVoices();
    const fr = voices.find(v => v.lang.startsWith("fr") && /female|femme|Google français|Amel|Thomas|Audrey/i.test(v.name))
            || voices.find(v => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    speechSynthesis.speak(u);
  } catch(e) {}
}
window.speechSynthesis && speechSynthesis.getVoices();
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();

function goHome() {
  speechSynthesis.cancel();
  stopSolar3D();
  document.getElementById("home").classList.add("on");
  document.getElementById("world").classList.remove("on");
}
function openWorld(key) {
  worldKey = key;
  qi = 0;
  document.getElementById("home").classList.remove("on");
  document.getElementById("world").classList.add("on");
  document.getElementById("world").classList.toggle("space-on", key === "espace");
  document.getElementById("world").classList.toggle("geo-on", key === "geo");
  document.getElementById("worldTitle").textContent = DATA[key].title;
  setMode(key === "espace" ? "solar" : key === "geo" ? "map" : "explore");
  speak(key === "espace"
    ? "Voici le système solaire en trois D. Glisse pour tourner. Pince pour zoomer. Tape une planète."
    : key === "geo"
    ? "Voici la carte du monde. Tape un continent ou un pays."
    : DATA[key].welcome);
}
function speakWelcome() {
  speak(mode === "solar"
    ? "Glisse avec un doigt pour tourner. Deux doigts pour zoomer ou te déplacer. Tape une planète pour l’écouter."
    : mode === "map"
    ? "Tape un continent coloré ou un petit drapeau pour entendre le nom du pays."
    : DATA[worldKey].welcome);
}
function setMode(m) {
  if (mode === "solar" && m !== "solar") stopSolar3D();
  mode = m;
  qi = 0;
  document.getElementById("modeExplore").classList.toggle("active", m === "explore");
  document.getElementById("modeQuiz").classList.toggle("active", m === "quiz");
  document.getElementById("modeSolar").classList.toggle("active", m === "solar");
  document.getElementById("modeMap").classList.toggle("active", m === "map");
  document.getElementById("worldCard").classList.toggle("solar-card", m === "solar");
  render();
}
function render() {
  locked = false;
  const w = DATA[worldKey];
  const box = document.getElementById("content");
  const prog = document.getElementById("prog");
  const qnum = document.getElementById("qnum");
  if (mode === "solar") {
    prog.style.width = "100%";
    qnum.textContent = "";
    box.innerHTML = `
      <p class="solar-hint">Glisse pour tourner · pince pour zoomer · ou tape une planète en bas</p>
      <div class="solar3d" id="solar3d">
        <div class="cam-btns">
          <button type="button" onclick="solarZoom(0.72)" aria-label="Zoomer">＋</button>
          <button type="button" onclick="solarZoom(1.38)" aria-label="Dézoomer">－</button>
          <button type="button" onclick="solarReset()" aria-label="Recentrer">↻</button>
        </div>
      </div>
      <div class="travel-bar">
        <button type="button" class="on" id="tv-solaire" onclick="goSpace('solaire')">☀️ Notre système</button>
        <button type="button" id="tv-autre" onclick="goSpace('autre')">✨ Autre étoile</button>
        <button type="button" id="tv-galaxie" onclick="goSpace('galaxie')">🌌 Voie lactée</button>
        <button type="button" id="tv-andromede" onclick="goSpace('andromede')">🌀 Andromède</button>
      </div>
      <div class="planet-bar">
        <button type="button" onclick="tapPlanet('soleil')"><span>☀️</span>Soleil</button>
        <button type="button" onclick="tapPlanet('mercure')"><span>🪨</span>Mercure</button>
        <button type="button" onclick="tapPlanet('venus')"><span>🟡</span>Vénus</button>
        <button type="button" onclick="tapPlanet('terre')"><span>🌍</span>Terre</button>
        <button type="button" onclick="tapPlanet('lune')"><span>🌙</span>Lune</button>
        <button type="button" onclick="tapPlanet('mars')"><span>🔴</span>Mars</button>
        <button type="button" onclick="tapPlanet('jupiter')"><span>🟠</span>Jupiter</button>
        <button type="button" onclick="tapPlanet('saturne')"><span>🪐</span>Saturne</button>
        <button type="button" onclick="tapPlanet('uranus')"><span>🟢</span>Uranus</button>
        <button type="button" onclick="tapPlanet('neptune')"><span>🔵</span>Neptune</button>
      </div>
      <div class="solar-fact" id="fact">Le Soleil est au milieu. Tape une planète ci-dessous pour l’écouter.</div>`;
    requestAnimationFrame(startSolar3D);
    return;
  }
  if (mode === "map") {
    prog.style.width = "100%";
    qnum.textContent = "";
    box.innerHTML = worldMapHTML();
    return;
  }
  if (mode === "explore") {
    prog.style.width = "100%";
    qnum.textContent = "";
    box.innerHTML = `
      <p class="say">Tape une image. J’écoute l’histoire.</p>
      <div class="explore-grid">
        ${w.items.map((it,i)=>`<button class="tile" onclick="showFact(${i})"><span class="e">${it.e}</span>${it.n}</button>`).join("")}
      </div>
      <div class="fact" id="fact">Choisis une image 👆</div>`;
  } else {
    showQuiz();
  }
}
function worldMapHTML() {
  return `
    <p class="map-title">LA CARTE DU MONDE</p>
    <svg class="world-map" viewBox="0 0 1000 560" xmlns="http://www.w3.org/2000/svg">
      <rect width="1000" height="560" fill="#1e90ff"/>
      <g fill="#7ec8ff" opacity=".55">
        <ellipse cx="120" cy="210" rx="10" ry="5"/><ellipse cx="360" cy="250" rx="12" ry="5"/>
        <ellipse cx="620" cy="300" rx="11" ry="5"/><ellipse cx="740" cy="240" rx="9" ry="4"/>
        <ellipse cx="880" cy="210" rx="10" ry="4"/>
      </g>

      <path class="land" data-k="amerique-n" onclick="tapGeo('amerique-n')" fill="#ef7a22" d="
        M48,95 C78,58 118,48 148,62 C175,40 220,38 258,58
        C300,32 355,36 398,62 C430,52 455,72 452,108
        C438,138 400,148 368,138 C348,168 312,182 272,172
        C248,198 214,210 178,188 C150,214 122,198 112,168
        C82,162 58,138 48,112 C36,108 34,98 48,95Z
        M155,205 C178,196 198,212 196,232 C176,250 152,238 155,205Z"/>

      <path class="land" data-k="amerique-s" onclick="tapGeo('amerique-s')" fill="#f48fb1" d="
        M198,248 C236,232 278,242 298,278 C314,318 308,362 292,404
        C276,444 252,472 228,478 C210,462 208,428 218,392
        C206,356 190,318 186,286 C182,262 186,252 198,248Z"/>

      <path class="land" data-k="europe" onclick="tapGeo('europe')" fill="#e53935" d="
        M455,68 C482,42 528,40 552,62 C572,48 598,58 594,82
        C618,90 628,112 608,128 C590,152 552,162 518,152
        C492,164 468,154 456,132 C444,110 440,86 455,68Z
        M428,118 C440,110 452,122 446,134 C434,138 422,126 428,118Z"/>

      <path class="land" data-k="afrique" onclick="tapGeo('afrique')" fill="#43a047" d="
        M458,168 C508,152 558,162 582,198 C604,234 608,278 592,322
        C574,366 538,398 502,408 C464,400 442,372 436,336
        C422,300 428,254 436,220 C442,190 448,174 458,168Z
        M528,412 C546,408 558,424 546,438 C528,444 516,426 528,412Z"/>

      <path class="land" data-k="asie" onclick="tapGeo('asie')" fill="#ffb300" d="
        M598,48 C678,22 778,28 858,62 C908,86 942,118 928,152
        C892,172 848,162 808,176 C772,208 738,222 698,208
        C668,242 632,254 602,228 C574,204 558,168 568,132
        C562,98 568,66 598,48Z
        M655,218 C686,206 718,230 706,258 C682,278 646,258 655,218Z
        M868,128 C892,120 916,134 912,154 C894,164 868,150 868,128Z"/>

      <path class="land" data-k="oceanie" onclick="tapGeo('oceanie')" fill="#6d4c41" d="
        M778,300 C838,278 908,288 932,328 C938,360 900,382 852,374
        C808,368 772,344 776,316 C776,306 776,302 778,300Z
        M918,392 C942,384 960,404 946,418 C924,426 910,404 918,392Z"/>

      <path class="land" data-k="antarctique" onclick="tapGeo('antarctique')" fill="#eceff1" d="
        M40,508 C180,472 400,458 500,462 C720,456 900,478 980,512
        L980,560 L40,560Z"/>

      <text class="map-label" x="175" y="128" text-anchor="middle">AMÉRIQUE</text>
      <text class="map-label" x="175" y="146" text-anchor="middle">DU NORD</text>
      <text class="map-label" x="238" y="340" text-anchor="middle">AMÉRIQUE</text>
      <text class="map-label" x="238" y="358" text-anchor="middle">DU SUD</text>
      <text class="map-label" x="525" y="108" text-anchor="middle">EUROPE</text>
      <text class="map-label" x="512" y="268" text-anchor="middle">AFRIQUE</text>
      <text class="map-label" x="760" y="118" text-anchor="middle">ASIE</text>
      <text class="map-label" x="848" y="342" text-anchor="middle">OCÉANIE</text>
      <text class="map-label" x="500" y="538" text-anchor="middle" style="fill:#37474f;stroke:rgba(255,255,255,.5)">ANTARCTIQUE</text>

      <text class="map-animal" x="118" y="88">🐻</text>
      <text class="map-animal" x="210" y="78">🦬</text>
      <text class="map-animal" x="248" y="318">🐆</text>
      <text class="map-animal" x="498" y="198">🦒</text>
      <text class="map-animal" x="468" y="318">🐘</text>
      <text class="map-animal" x="720" y="88">🐎</text>
      <text class="map-animal" x="820" y="98">🐼</text>
      <text class="map-animal" x="820" y="328">🦘</text>
      <text class="map-animal" x="430" y="528">🐧</text>
      <text class="map-animal" x="360" y="198">🐋</text>

      ${pin(208,158,"🇺🇸","usa")}
      ${pin(158,108,"🇨🇦","canada")}
      ${pin(168,218,"🇲🇽","mexique")}
      ${pin(258,328,"🇧🇷","bresil")}
      ${pin(508,128,"🇫🇷","france",true)}
      ${pin(486,150,"🇪🇸","espagne")}
      ${pin(534,148,"🇮🇹","italie")}
      ${pin(548,112,"🇩🇪","allemagne")}
      ${pin(492,98,"🇬🇧","uk")}
      ${pin(538,218,"🇪🇬","egypte")}
      ${pin(508,292,"🇰🇪","kenya")}
      ${pin(698,232,"🇮🇳","inde")}
      ${pin(778,148,"🇨🇳","chine")}
      ${pin(888,138,"🇯🇵","japon")}
      ${pin(848,338,"🇦🇺","australie")}
    </svg>
    <div class="map-fact" id="fact">Tape un continent coloré ou un drapeau. La France est le rond jaune. 👆</div>`;
}
function pin(x,y,flag,key,home){
  return `<g class="pin${home?" home":""}" onclick="event.stopPropagation();tapGeo('${key}')" transform="translate(${x},${y})">
    <circle r="15"/><text text-anchor="middle" dy="5">${flag}</text>
  </g>`;
}
function tapGeo(key){
  const g = GEO[key];
  if(!g) return;
  document.querySelectorAll(".world-map .land").forEach(el=>el.classList.toggle("on", el.dataset.k===key));
  const el = document.getElementById("fact");
  if(el) el.innerHTML = `<strong>${g.n}</strong><br>${g.t}`;
  speak(`${g.n}. ${g.t}`);
  addStar(1);
}

function historyScene(name) {
  const scenes = {
    "Dinosaure": `<div class="scene sc-dino">
      <span class="actor volcan">🌋</span>
      <span class="actor d1">🦕</span>
      <span class="actor d2">🦖</span>
      <span class="actor d3">🥚</span>
    </div>`,
    "Château": `<div class="scene sc-castle">
      <span class="actor cloud" style="left:12%">☁️</span>
      <span class="actor cloud" style="left:70%;top:16%">☁️</span>
      <span class="actor keep">🏰</span>
      <span class="actor flag">🚩</span>
    </div>`,
    "Roi et reine": `<div class="scene sc-roi">
      <span class="actor c1">👸</span>
      <span class="actor trone">👑</span>
      <span class="actor c2">🤴</span>
    </div>`,
    "Chevalier": `<div class="scene sc-chevalier">
      <span class="actor tour">🏰</span>
      <span class="actor kni">🏇</span>
    </div>`,
    "Pot ancien": `<div class="scene sc-pot">
      <span class="actor p1">🪨</span>
      <span class="actor p2">🏺</span>
      <span class="actor p3">🪵</span>
    </div>`,
    "Statue": `<div class="scene sc-statue">
      <span class="actor s1">🗿</span>
      <span class="actor s2">🗿</span>
      <span class="actor s3">🗿</span>
    </div>`,
    "Bateau ancien": `<div class="scene sc-bateau">
      <span class="actor wave">🌊🌊🌊🌊🌊🌊</span>
      <span class="actor boat">🛶</span>
    </div>`,
    "Feu": `<div class="scene sc-feu">
      <span class="actor cave">🪨</span>
      <span class="actor fire">🔥</span>
      <span class="actor kid">🧒</span>
    </div>`
  };
  return scenes[name] || "";
}
function showFact(i) {
  const it = DATA[worldKey].items[i];
  const extra = worldKey === "histoire" ? historyScene(it.n) : "";
  document.getElementById("fact").innerHTML = `${extra}<strong>${it.e} ${it.n}</strong><br>${it.t}`;
  speak(`${it.n}. ${it.t}`);
  addStar(1);
}
let solar = null;
let spaceView = "solaire";

function goSpace(view) {
  spaceView = view;
  document.querySelectorAll(".travel-bar button").forEach(b => b.classList.remove("on"));
  const id = { solaire:"tv-solaire", autre:"tv-autre", galaxie:"tv-galaxie", andromede:"tv-andromede" }[view];
  if (id) { const el = document.getElementById(id); if (el) el.classList.add("on"); }
  const texts = {
    solaire: "Nous voilà dans notre système solaire. Le Soleil est au milieu.",
    autre: "On voyage vers une autre étoile. Elle a aussi des planètes autour d’elle.",
    galaxie: "On s’éloigne. Voici notre galaxie, la Voie lactée. Des milliards d’étoiles.",
    andromede: "Encore plus loin : la galaxie d’Andromède. Une immense spirale d’étoiles."
  };
  const fact = document.getElementById("fact");
  if (fact) fact.textContent = texts[view];
  speak(texts[view]);
  startSolar3D();
}

function stopSolar3D() {
  if (!solar) return;
  cancelAnimationFrame(solar.raf);
  window.removeEventListener("resize", solar.onResize);
  if (solar.renderer) {
    solar.renderer.dispose();
    if (solar.renderer.domElement && solar.renderer.domElement.parentNode) {
      solar.renderer.domElement.parentNode.removeChild(solar.renderer.domElement);
    }
  }
  solar = null;
}

function startSolar3D() {
  stopSolar3D();
  if (typeof THREE === "undefined") {
    const el = document.getElementById("fact");
    if (el) el.textContent = "Le ciel 3D a besoin d’internet la première fois (Three.js).";
    return;
  }
  const holder = document.getElementById("solar3d");
  if (!holder) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050218);
  scene.fog = new THREE.FogExp2(0x050218, 0.012);

  const w = holder.clientWidth || 360;
  const h = holder.clientHeight || 400;
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 800);
  const startPos = {
    solaire: [0, 10, 26],
    autre: [0, 8, 22],
    galaxie: [0, 16, 48],
    andromede: [0, 12, 40]
  }[spaceView] || [0, 10, 26];
  camera.position.set(startPos[0], startPos[1], startPos[2]);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  holder.insertBefore(renderer.domElement, holder.firstChild);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.panSpeed = 0.7;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 1.1;
  controls.minDistance = 6;
  controls.maxDistance = 120;
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };
  controls.addEventListener("start", () => { controls.autoRotate = false; });

  scene.add(new THREE.AmbientLight(0x8899cc, 0.35));
  const sunLight = new THREE.PointLight(0xfff1c1, 3.4, 200, 2);
  scene.add(sunLight);
  const fill = new THREE.DirectionalLight(0x334466, 0.25);
  fill.position.set(-30, 10, 20);
  scene.add(fill);

  function texPlanet(draw) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const g = c.getContext("2d");
    draw(g, c);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
  }
  function noise(g, n, color, size) {
    g.fillStyle = color;
    for (let i = 0; i < n; i++) {
      g.globalAlpha = 0.15 + Math.random() * 0.45;
      g.beginPath();
      g.arc(Math.random()*512, Math.random()*256, size * Math.random(), 0, 7);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  const TEX = {
    soleil: texPlanet((g,c) => {
      const grd = g.createLinearGradient(0,0,0,256);
      grd.addColorStop(0,"#fff6c2"); grd.addColorStop(.4,"#ffcc33"); grd.addColorStop(1,"#ff7a00");
      g.fillStyle = grd; g.fillRect(0,0,512,256);
      noise(g, 80, "#ffef9a", 18); noise(g, 40, "#ff4d00", 12);
    }),
    mercure: texPlanet((g) => {
      g.fillStyle = "#8a7a6a"; g.fillRect(0,0,512,256);
      noise(g, 220, "#6b5d52", 7); noise(g, 80, "#cfc3b6", 4);
    }),
    venus: texPlanet((g) => {
      const grd = g.createLinearGradient(0,0,0,256);
      grd.addColorStop(0,"#f6e2b3"); grd.addColorStop(.5,"#e0b35a"); grd.addColorStop(1,"#c98a3a");
      g.fillStyle = grd; g.fillRect(0,0,512,256);
      g.globalAlpha = .35;
      for (let y=0;y<256;y+=8){ g.fillStyle = y%16? "#fff2cc":"#d49a3a"; g.fillRect(0,y,512,5); }
      g.globalAlpha = 1;
    }),
    terre: texPlanet((g) => {
      g.fillStyle = "#1b4f9c"; g.fillRect(0,0,512,256);
      g.fillStyle = "#2e9e4f";
      [[80,70,50,30],[200,90,70,40],[330,60,40,22],[420,140,55,28],[140,180,60,25],[280,160,80,30]].forEach(([x,y,w,h])=>{
        g.beginPath(); g.ellipse(x,y,w,h,0.2,0,7); g.fill();
      });
      g.fillStyle = "#eef6ff";
      g.beginPath(); g.ellipse(256,18,220,22,0,0,7); g.fill();
      g.beginPath(); g.ellipse(256,240,220,18,0,0,7); g.fill();
      noise(g, 40, "#87ceeb", 8);
    }),
    lune: texPlanet((g) => {
      g.fillStyle = "#cfcfd6"; g.fillRect(0,0,512,256);
      noise(g, 180, "#8e8e98", 6); noise(g, 40, "#ececf2", 10);
    }),
    mars: texPlanet((g) => {
      g.fillStyle = "#b34428"; g.fillRect(0,0,512,256);
      noise(g, 120, "#7a2a16", 8); noise(g, 50, "#e08a55", 6);
      g.fillStyle = "#f2f2f2"; g.beginPath(); g.ellipse(256,16,180,16,0,0,7); g.fill();
    }),
    jupiter: texPlanet((g) => {
      const cols = ["#e8d0a0","#c9934a","#f0d6a6","#a56b32","#ead8b0","#d4a056"];
      for (let y=0;y<256;y++){ g.fillStyle = cols[Math.floor(y/18)%cols.length]; g.fillRect(0,y,512,18); }
      g.fillStyle = "#c45c3e"; g.beginPath(); g.ellipse(340,150,38,22,0.2,0,7); g.fill();
    }),
    saturne: texPlanet((g) => {
      const cols = ["#f3e2b8","#e0c07a","#d4a84b","#f6e7c4"];
      for (let y=0;y<256;y++){ g.fillStyle = cols[Math.floor(y/20)%cols.length]; g.fillRect(0,y,512,20); }
    }),
    uranus: texPlanet((g) => {
      const grd = g.createLinearGradient(0,0,0,256);
      grd.addColorStop(0,"#d6f6ff"); grd.addColorStop(.5,"#7ed6df"); grd.addColorStop(1,"#4aa8b5");
      g.fillStyle = grd; g.fillRect(0,0,512,256);
    }),
    neptune: texPlanet((g) => {
      const grd = g.createLinearGradient(0,0,0,256);
      grd.addColorStop(0,"#7eb6ff"); grd.addColorStop(.5,"#1e3799"); grd.addColorStop(1,"#0b1d5c");
      g.fillStyle = grd; g.fillRect(0,0,512,256);
      g.fillStyle = "#9ad0ff"; g.beginPath(); g.ellipse(200,130,28,16,0,0,7); g.fill();
    })
  };
  function ringTex() {
    const c = document.createElement("canvas"); c.width=512; c.height=64;
    const g = c.getContext("2d");
    for (let x=0;x<512;x++){
      const a = (x>40 && x<470) ? (0.15 + 0.7*Math.abs(Math.sin(x*0.2))) : 0;
      const col = x%37<4 ? 80 : 210;
      g.fillStyle = `rgba(${col},${col-20},150,${a})`;
      g.fillRect(x,0,1,64);
    }
    const t = new THREE.CanvasTexture(c);
    return t;
  }

  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 900; i++) {
    starPos.push((Math.random() - 0.5) * 260, (Math.random() - 0.5) * 160, (Math.random() - 0.5) * 260);
  }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35 })));

  const pickables = [];
  const movers = [];

  function addOrbitRing(radius) {
    const pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: 0x8aa4ff, transparent: true, opacity: 0.28 }));
    scene.add(line);
  }

  function makePlanet(key, radius, distance, speed, extra) {
    const pivot = new THREE.Object3D();
    pivot.rotation.y = Math.random() * Math.PI * 2;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 48, 48),
      new THREE.MeshStandardMaterial({
        map: TEX[key] || TEX.mars,
        roughness: key === "venus" ? 0.85 : 0.5,
        metalness: 0.04,
        emissive: key === "soleil" ? 0xffaa00 : 0x000000
      })
    );
    mesh.position.x = distance;
    mesh.userData.key = key;
    pivot.add(mesh);
    scene.add(pivot);
    addOrbitRing(distance);
    pickables.push(mesh);
    movers.push({ pivot, speed, mesh });
    if (extra) extra(mesh, pivot, distance);
    return mesh;
  }

  if (spaceView === "galaxie" || spaceView === "andromede") {
    const gCount = spaceView === "galaxie" ? 1800 : 1400;
    const gPos = [];
    for (let i = 0; i < gCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const arm = Math.floor(Math.random() * 3);
      const r = Math.pow(Math.random(), .55) * (spaceView === "andromede" ? 28 : 34);
      const twist = a + r * 0.18 + arm * 2.1;
      gPos.push(Math.cos(twist) * r, (Math.random() - 0.5) * 3.2, Math.sin(twist) * r);
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.Float32BufferAttribute(gPos, 3));
    const gal = new THREE.Points(gg, new THREE.PointsMaterial({
      color: spaceView === "andromede" ? 0xc9b6ff : 0xffe9b0, size: 0.42
    }));
    gal.userData.key = spaceView === "andromede" ? "andromede" : "voie-lactee";
    scene.add(gal);
    pickables.push(gal);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 24, 24),
      new THREE.MeshBasicMaterial({ color: spaceView === "andromede" ? 0xddbbff : 0xfff3c4 })
    );
    core.userData.key = gal.userData.key;
    scene.add(core);
    pickables.push(core);
    movers.push({ pivot: gal, speed: 0.0012, mesh: gal });
  } else if (spaceView === "autre") {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xff8866 })
    );
    star.userData.key = "proxima";
    scene.add(star);
    pickables.push(star);
    makePlanet("exo1", 0.7, 7.2, 0.018);
    makePlanet("mars", 0.5, 11.4, 0.01);
    makePlanet("neptune", 0.85, 16.2, 0.006);
  } else {
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 48, 48),
    new THREE.MeshBasicMaterial({ map: TEX.soleil })
  );
  sun.userData.key = "soleil";
  scene.add(sun);
  pickables.push(sun);
  [3.4, 4.4, 5.4].forEach((r, i) => {
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(r, 24, 24),
      new THREE.MeshBasicMaterial({ color: i ? 0xff9900 : 0xffee88, transparent: true, opacity: 0.08 - i*0.02 })
    ));
  });

  makePlanet("mercure", 0.42, 5.4, 0.024);
  makePlanet("venus", 0.68, 7.4, 0.015);
  makePlanet("terre", 0.74, 9.6, 0.011, (earth) => {
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x7ec8ff, transparent: true, opacity: 0.18, side: THREE.BackSide })
    );
    earth.add(atmo);
    const moonPivot = new THREE.Object3D();
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 24),
      new THREE.MeshStandardMaterial({ map: TEX.lune, roughness: 0.9 })
    );
    moon.position.x = 1.45;
    moon.userData.key = "lune";
    moonPivot.add(moon);
    earth.add(moonPivot);
    pickables.push(moon);
    movers.push({ pivot: moonPivot, speed: 0.045, mesh: moon });
  });
  makePlanet("mars", 0.52, 11.8, 0.009);
  makePlanet("jupiter", 1.7, 15.6, 0.005);
  makePlanet("saturne", 1.38, 19.8, 0.0035, (sat) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.85, 80),
      new THREE.MeshBasicMaterial({
        map: ringTex(),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      })
    );
    ring.rotation.x = Math.PI / 2.12;
    ring.userData.key = "saturne";
    sat.add(ring);
    pickables.push(ring);
  });
  makePlanet("uranus", 0.95, 23.6, 0.0024);
  makePlanet("neptune", 0.92, 27.0, 0.0018);
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let tapX = 0, tapY = 0;

  function pick(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    const cx = (ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX);
    const cy = (ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY);
    if (Math.hypot(cx - tapX, cy - tapY) > 14) return;
    pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (hits.length) tapPlanet(hits[0].object.userData.key);
  }
  renderer.domElement.addEventListener("pointerdown", e => { tapX = e.clientX; tapY = e.clientY; });
  renderer.domElement.addEventListener("pointerup", pick);

  function onResize() {
    if (!holder || !solar) return;
    const ww = holder.clientWidth, hh = holder.clientHeight;
    camera.aspect = ww / Math.max(hh, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh);
  }

  function tick() {
    if (!solar) return;
    movers.forEach(m => { m.pivot.rotation.y += m.speed; if (m.mesh) m.mesh.rotation.y += 0.01; });
    if (typeof sun !== "undefined" && sun) sun.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
    solar.raf = requestAnimationFrame(tick);
  }

  solar = { renderer, camera, controls, onResize, raf: 0 };
  window.addEventListener("resize", onResize);
  requestAnimationFrame(onResize);
  solar.raf = requestAnimationFrame(tick);
}

function solarZoom(factor) {
  if (!solar) return;
  solar.camera.position.multiplyScalar(factor);
  const d = solar.camera.position.length();
  if (d < 6) solar.camera.position.setLength(6);
  if (d > 120) solar.camera.position.setLength(120);
}
function solarReset() {
  if (!solar) return;
  solar.camera.position.set(0, 10, 26);
  solar.controls.target.set(0, 0, 0);
  solar.controls.autoRotate = true;
}

function tapPlanet(key) {
  const p = PLANETS[key];
  if (!p) return;
  const el = document.getElementById("fact");
  if (el) el.innerHTML = `<strong>${p.n}</strong><br>${p.t}`;
  speak(`${p.n}. ${p.t}`);
  addStar(1);
}
function showQuiz() {
  const w = DATA[worldKey];
  const q = w.quiz[qi];
  document.getElementById("prog").style.width = ((qi) / w.quiz.length * 100) + "%";
  document.getElementById("qnum").textContent = (qi+1) + "/" + w.quiz.length;
  const opts = q.opts.map((o,i)=>({o, e:q.oe[i]})).sort(()=>Math.random()-.5);
  document.getElementById("content").innerHTML = `
    <div class="big">${q.e}</div>
    <p class="say">${q.q}</p>
    <div class="choices">
      ${opts.map(x=>`<button class="choice" data-ok="${x.o===q.ok}" onclick="answer(this,'${q.ok.replace(/'/g,"\\'")}')"><span class="e">${x.e}</span>${x.o}</button>`).join("")}
    </div>`;
  speak(q.q);
}
function answer(btn, ok) {
  if (locked) return;
  locked = true;
  const good = btn.dataset.ok === "true";
  document.querySelectorAll(".choice").forEach(b => {
    if (b.dataset.ok === "true") b.classList.add("good");
  });
  if (!good) btn.classList.add("bad");
  if (good) {
    speak("Bravo ! C’est juste.");
    addStar(2);
    burst();
  } else {
    speak("Presque. La bonne réponse est : " + ok);
  }
  setTimeout(() => {
    qi++;
    if (qi >= DATA[worldKey].quiz.length) {
      document.getElementById("prog").style.width = "100%";
      document.getElementById("winText").textContent = "Tu as fini le quiz " + DATA[worldKey].title + " !";
      document.getElementById("win").classList.add("on");
      speak("Bravo exploratrice ! Tu as fini le quiz.");
      burst();
    } else {
      showQuiz();
    }
  }, 1600);
}
function addStar(n) {
  stars += n;
  localStorage.setItem("pe_stars", stars);
  document.getElementById("starCount").textContent = stars;
}
function closeWin() {
  document.getElementById("win").classList.remove("on");
  setMode("explore");
}

/* confetti */
const cv = document.getElementById("confetti");
const ctx = cv.getContext("2d");
let bits = [];
function resize(){ cv.width = innerWidth; cv.height = innerHeight; }
addEventListener("resize", resize); resize();
function burst(){
  for(let i=0;i<80;i++){
    bits.push({x:innerWidth/2,y:innerHeight/3,vx:(Math.random()-0.5)*8,vy:Math.random()*-8-2,s:6+Math.random()*7,c:`hsl(${Math.random()*360},90%,60%)`,life:90});
  }
}
(function loop(){
  ctx.clearRect(0,0,cv.width,cv.height);
  bits.forEach(b=>{
    b.x+=b.vx; b.y+=b.vy; b.vy+=0.18; b.life--;
    ctx.fillStyle=b.c; ctx.fillRect(b.x,b.y,b.s,b.s);
  });
  bits = bits.filter(b=>b.life>0);
  requestAnimationFrame(loop);
})();
