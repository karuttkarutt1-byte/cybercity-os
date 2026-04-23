/* =========================================================
   MOONLIGHT CYBERCITY ENGINE v2.5 - FULL JS CORE
========================================================= */

/* =========================
   DOM SHORTCUTS
========================= */

const $ = (id) => document.getElementById(id);

/* =========================
   BACKGROUND CITY ENGINE
========================= */

const canvas = $("cityCanvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* skyline data */
let buildings = Array.from({length:90}, () => ({
  x: Math.random() * innerWidth,
  w: 20 + Math.random() * 60,
  h: 60 + Math.random() * 320
}));

function drawCity(){
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let b of buildings){
    ctx.fillStyle = "rgba(110,231,255,0.07)";
    ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h);

    // glow edges
    ctx.fillStyle = "rgba(167,139,250,0.03)";
    ctx.fillRect(b.x+2, canvas.height - b.h, b.w, b.h);
  }

  requestAnimationFrame(drawCity);
}
drawCity();

/* =========================
   SEARCH ENGINE
========================= */

const searchForm = document.querySelector(".search");
const searchInput = searchForm?.querySelector("input");

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if(!q) return;

  openBrowser(q);
});

/* =========================
   BROWSER SYSTEM
========================= */

const browser = $("browser");
const frame = $("frame");
const tabsEl = $("tabs");

let tabs = [];
let activeTab = null;

function openBrowser(url = "https://example.com"){

  browser.style.display = "flex";

  const tab = {
    id: Date.now(),
    url: normalizeURL(url)
  };

  tabs.push(tab);
  activeTab = tab.id;

  renderTabs();
  loadTab(tab);
}

/* normalize input */
function normalizeURL(input){
  try {
    return new URL(input).href;
  } catch {
    return "https://duckduckgo.com/?q=" + encodeURIComponent(input);
  }
}

/* load tab */
function loadTab(tab){
  frame.src = tab.url;
}

/* render tabs */
function renderTabs(){
  tabsEl.innerHTML = "";

  tabs.forEach(tab => {
    const el = document.createElement("div");
    el.className = "tab" + (tab.id === activeTab ? " active" : "");
    el.textContent = "tab";

    el.onclick = () => {
      activeTab = tab.id;
      loadTab(tab);
      renderTabs();
    };

    tabsEl.appendChild(el);
  });
}

/* =========================
   COMMAND SYSTEM (CTRL+K OS BAR)
========================= */

const cmd = $("cmd");
const cmdInput = $("cmdInput");

function cmdToggle(){
  cmd.style.display = "block";
  cmdInput.focus();
}

document.addEventListener("keydown", (e) => {
  if(e.ctrlKey && e.key.toLowerCase() === "k") cmdToggle();
  if(e.key === "Escape") cmd.style.display = "none";
});

cmdInput.addEventListener("keydown", (e) => {
  if(e.key !== "Enter") return;

  const value = cmdInput.value.toLowerCase().trim();

  runCommand(value);

  cmd.style.display = "none";
  cmdInput.value = "";
});

/* command router */
function runCommand(cmdText){

  const parts = cmdText.split(" ");
  const base = parts[0];

  switch(base){

    case "open":
      openBrowser(parts.slice(1).join(" "));
      break;

    case "search":
      openBrowser("https://duckduckgo.com/?q=" + encodeURIComponent(parts.slice(1).join(" ")));
      break;

    case "youtube":
      openBrowser("https://youtube.com/results?search_query=" + encodeURIComponent(parts.slice(1).join(" ")));
      break;

    case "clear":
      tabs = [];
      frame.src = "";
      renderTabs();
      break;

    default:
      openBrowser(cmdText);
  }
}

/* =========================
   QUICK UI SHORTCUTS
========================= */

window.openBrowser = openBrowser;
window.cmdToggle = cmdToggle;

/* =========================
   PERFORMANCE LOOP (LIGHT SYSTEM TICK)
========================= */

function systemTick(){
  // reserved for future:
  // - animations sync
  // - background effects
  // - system state updates

  requestAnimationFrame(systemTick);
}
systemTick();

/* =========================
   OPTIONAL: AUTO FOCUS FIX
========================= */

window.addEventListener("load", () => {
  searchInput?.focus();
});