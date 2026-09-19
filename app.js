
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
      <p class="solar-hint">1 doigt : tourner · 2 doigts : zoomer / bouger · tape une planète</p>
      <div class="solar3d" id="solar3d">
        <div class="cam-btns">
          <button type="button" onclick="solarZoom(0.75)">＋</button>
          <button type="button" onclick="solarZoom(1.35)">－</button>
          <button type="button" onclick="solarReset()">↻</button>
        </div>
      </div>
      <div class="solar-fact" id="fact">Le Soleil est au milieu. Approche-toi, tourne autour, visite les planètes.</div>`;
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
    <p class="say">Tape un continent ou un drapeau.</p>
    <svg class="world-map" viewBox="0 0 1000 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9ad8ff"/><stop offset="1" stop-color="#3d94d9"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="540" fill="url(#ocean)"/>
      <ellipse cx="90" cy="70" rx="26" ry="10" fill="#fff" opacity=".45"/>
      <ellipse cx="430" cy="45" rx="34" ry="12" fill="#fff" opacity=".35"/>
      <ellipse cx="780" cy="80" rx="22" ry="9" fill="#fff" opacity=".4"/>

      <!-- Amérique du Nord : Alaska, Canada, USA, Mexique -->
      <path class="land" data-k="amerique-n" onclick="tapGeo('amerique-n')" fill="#f4c430" d="
        M70,95 C95,70 130,62 155,78 C175,58 205,55 225,72
        C255,50 310,48 355,68 C395,58 430,78 438,108
        C428,138 400,148 372,142 C350,168 318,178 285,172
        C260,198 228,208 198,188 C170,210 145,198 138,172
        C112,168 88,148 78,128 C62,120 58,108 70,95Z
        M148,208 C168,200 188,214 186,232 C168,248 148,238 148,208Z"/>

      <!-- Amérique du Sud -->
      <path class="land" data-k="amerique-s" onclick="tapGeo('amerique-s')" fill="#e17055" d="
        M228,250 C258,238 292,248 308,278 C322,312 318,348 308,382
        C298,418 278,448 258,458 C242,448 238,422 246,392
        C236,360 222,328 218,298 C214,272 216,256 228,250Z"/>

      <!-- Europe : îles + Scandinavie + Europe de l'Ouest -->
      <path class="land" data-k="europe" onclick="tapGeo('europe')" fill="#a29bfe" d="
        M478,72 C498,52 528,50 548,68 C562,58 578,66 574,84
        C592,88 602,104 590,118 C578,138 548,146 522,140
        C500,152 478,146 468,128 C458,110 460,88 478,72Z
        M452,118 C462,112 472,122 466,132 C456,136 448,126 452,118Z"/>

      <!-- Afrique -->
      <path class="land" data-k="afrique" onclick="tapGeo('afrique')" fill="#e2b04a" d="
        M478,158 C518,148 558,158 578,188 C598,218 602,258 590,298
        C578,338 548,368 518,378 C488,372 468,348 462,318
        C448,288 452,248 458,218 C462,188 468,164 478,158Z
        M538,382 C552,378 562,392 552,404 C538,408 528,394 538,382Z"/>

      <!-- Asie : Russie, Chine, Inde, péninsule, Japon à part -->
      <path class="land" data-k="asie" onclick="tapGeo('asie')" fill="#3dcf9a" d="
        M598,58 C668,38 758,42 828,72 C878,92 908,118 900,148
        C872,168 832,162 798,172 C768,198 738,208 702,198
        C678,228 648,238 622,218 C598,198 582,168 588,138
        C580,108 582,78 598,58Z
        M668,208 C692,198 718,218 708,242 C688,262 658,248 668,208Z
        M848,128 C868,122 888,132 886,148 C872,158 850,148 848,128Z"/>

      <!-- Océanie : Australie + NZ -->
      <path class="land" data-k="oceanie" onclick="tapGeo('oceanie')" fill="#74b9ff" d="
        M798,292 C848,272 908,282 928,318 C932,348 900,368 858,362
        C818,358 788,338 792,312 C792,300 794,294 798,292Z
        M918,378 C938,372 952,388 940,400 C922,406 910,388 918,378Z"/>

      <!-- Antarctique -->
      <path class="land" data-k="antarctique" onclick="tapGeo('antarctique')" fill="#eef4f8" d="
        M80,492 C200,462 400,448 500,452 C700,448 880,468 960,498
        L960,540 L80,540Z"/>

      ${pin(210,150,"🇺🇸","usa")}
      ${pin(168,118,"🇨🇦","canada")}
      ${pin(168,220,"🇲🇽","mexique")}
      ${pin(268,320,"🇧🇷","bresil")}
      ${pin(508,128,"🇫🇷","france",true)}
      ${pin(488,148,"🇪🇸","espagne")}
      ${pin(532,146,"🇮🇹","italie")}
      ${pin(548,112,"🇩🇪","allemagne")}
      ${pin(498,102,"🇬🇧","uk")}
      ${pin(538,220,"🇪🇬","egypte")}
      ${pin(508,280,"🇰🇪","kenya")}
      ${pin(698,228,"🇮🇳","inde")}
      ${pin(778,148,"🇨🇳","chine")}
      ${pin(868,140,"🇯🇵","japon")}
      ${pin(848,328,"🇦🇺","australie")}
    </svg>
    <div class="map-fact" id="fact">Les continents sont les grandes terres. Les drapeaux sont des pays. La France est en jaune. 👆</div>`;
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

function showFact(i) {
  const it = DATA[worldKey].items[i];
  document.getElementById("fact").innerHTML = `<strong>${it.e} ${it.n}</strong><br>${it.t}`;
  speak(`${it.n}. ${it.t}`);
  addStar(1);
}
let solar = null;

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
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 400);
  camera.position.set(0, 18, 42);

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
        map: TEX[key],
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
    sun.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
    solar.raf = requestAnimationFrame(tick);
  }

  solar = { renderer, camera, controls, onResize, raf: 0 };
  window.addEventListener("resize", onResize);
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
  solar.camera.position.set(0, 18, 42);
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
