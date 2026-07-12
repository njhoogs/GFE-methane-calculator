import React, { useState, useMemo, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  Green Fields Energy — Effluent Pond Methane Estimator
 *  Methodology: NZ Inventory / Pratt et al. (2012) Tier-2 approach
 *    CH4 = VS x B0 x 0.67 x MCF x (share of manure reaching effluent)
 *  Calibrated against DairyNZ effluent-energy tech note figures.
 * ------------------------------------------------------------------ */

const LOGO =
  "data:image/jpeg;base64,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";

// Region emission factors (m3 CH4 / kg VS) — measured from NZ dairy effluent
// ponds by NIWA. Heubeck et al. (2014) year-long study of three storage ponds:
// Southland 0.21, Waikato 0.22, Northland 0.29; Craggs et al. (2008) 0.21.
// These sit above the IPCC 2006 Oceania default of 0.17 (0.24 x 0.71).
const CLIMATES = {
  cool: { label: "Cool — Canterbury / Otago / Southland", ef: 0.21, src: "NIWA, Southland pond", tmean: 12, tamp: 7 },
  mild: { label: "Mild — Waikato / Taranaki / Manawatū", ef: 0.22, src: "NIWA, Waikato pond", tmean: 15, tamp: 6 },
  warm: { label: "Warm — Northland / Bay of Plenty", ef: 0.29, src: "NIWA, Northland pond", tmean: 17, tamp: 5 },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_START = MONTH_DAYS.reduce((a, d, i) => (a.push(i ? a[i - 1] + MONTH_DAYS[i - 1] : 0), a), []);
// warm half of the NZ year (Nov–Apr) for the summer/winter split
const WARM_MONTHS = [10, 11, 0, 1, 2, 3];

// "rel" = methane yield relative to a standing uncovered pond (the NIWA-measured
// reference). Applied to the regional NIWA emission factor above.
const SYSTEMS = {
  pond: {
    label: "Uncovered anaerobic pond",
    rel: 1.0,
    capture: 0,
    climate: true,
    note: "Single or two-pond system with no cover. The NIWA-measured reference and usually the largest single methane source on a dairy farm.",
  },
  lined: {
    label: "Lined pond — deferred irrigation",
    rel: 0.53,
    capture: 0,
    climate: true,
    note: "Emptied regularly for deferred irrigation. Shorter anaerobic retention means less methane than a standing pond.",
  },
  sump: {
    label: "Sump & immediate irrigation",
    rel: 0.015,
    capture: 0,
    climate: false,
    note: "Effluent is spread within a day or two, so there is little chance for anaerobic methane to build up.",
  },
  weeping: {
    label: "Weeping wall / solids separation + pond",
    rel: 0.68,
    capture: 0,
    climate: true,
    note: "Separated solids sit uncovered and can emit strongly; the liquid fraction still drains to a pond.",
  },
  covered: {
    label: "Covered pond / digester — energy capture",
    rel: 1.0,
    capture: 0.9,
    climate: true,
    note: "Same methane yield as an uncovered pond, but biogas is captured under a cover for heat, electricity or flaring — so most is recovered instead of released.",
  },
};

// Fixed model parameters (adjustable in Advanced)
const DEFAULTS = {
  herd: 700,
  system: "pond",
  climate: "cool",
  milkingDays: 270,
  yardHours: 2.0,
  padUsed: false,
  padDays: 90,
  padHours: 4,
  // advanced
  fdm: 2.47, // faecal dry matter, kg/cow/day (900 kg/yr, Ledgard & Brier 2004)
  ash: 0.08, // ash content of manure
  ef: 0.21, // NIWA measured emission factor, m3 CH4/kg VS (cool region default)
  captureEff: 0.9, // for covered systems
  gwp: 28, // AR5 GWP100 for methane
  price: 0.28, // $/kWh retail electricity
  // seasonal model
  tmean: 12, // annual mean pond temperature, °C (cool default)
  tamp: 7, // seasonal amplitude, °C (±)
  q10: 2.5, // methanogenesis temperature sensitivity
  calvingStart: 8, // milking/calving start month (1=Jan); Aug default
};

const DENSITY = 0.67; // kg CH4 per m3
const ENERGY_PER_M3 = 9.94; // kWh thermal per m3 CH4
const GEN_EFF = 0.35; // electrical conversion efficiency

/* ------------------------------------------------------------------ *
 *  STORAGE LAYER
 *  Farm records persist here. Default = localStorage (per-browser, no
 *  setup). To share records across devices / with GFE, replace the four
 *  methods below with a cloud backend — the rest of the app is unchanged.
 *
 *  Supabase example (after `npm i @supabase/supabase-js` or CDN):
 *    const db = supabase.createClient(URL, ANON_KEY);
 *    list:   async () => (await db.from('farms').select()).data
 *    save:   async (f) => db.from('farms').upsert(f)
 *    remove: async (id) => db.from('farms').delete().eq('id', id)
 *  (make the calling code `await` these — they're sync for localStorage.)
 * ------------------------------------------------------------------ */
const FARM_KEY = "gfe_farms_v1";
const farmStore = {
  list() {
    try { return JSON.parse(localStorage.getItem(FARM_KEY) || "[]"); }
    catch (e) { return []; }
  },
  save(farm) {
    const all = farmStore.list();
    const i = all.findIndex((f) => f.id === farm.id);
    if (i >= 0) all[i] = farm; else all.push(farm);
    try { localStorage.setItem(FARM_KEY, JSON.stringify(all)); } catch (e) {}
    return all;
  },
  remove(id) {
    const all = farmStore.list().filter((f) => f.id !== id);
    try { localStorage.setItem(FARM_KEY, JSON.stringify(all)); } catch (e) {}
    return all;
  },
};

/* ------------------------------------------------------------------ *
 *  CLOUD SYNC (Google Sheet via Apps Script)
 *  Paste your deployed Web App /exec URL into CLOUD_URL to turn on
 *  shared cloud storage. Leave blank to stay on-device (localStorage).
 *  Reads use JSONP and writes use a no-cors POST, which sidesteps all
 *  the cross-origin issues Apps Script otherwise runs into.
 * ------------------------------------------------------------------ */
// Config values are injected at deploy time from GitHub secrets (see the Actions
// workflow). Until injected, the placeholders read as empty, so the raw committed
// file just runs keyless + on-device.
const cfg = (v) => (/^__[A-Z_]+__$/.test(v) ? "" : v);

const CLOUD_URL = cfg("__CLOUD_URL__"); // injected from secret APPS_SCRIPT_URL
const CLOUD_TOKEN = cfg("__CLOUD_TOKEN__"); // injected from secret APPS_SCRIPT_SECRET

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = "__gfe_cb_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, 12000);
    function cleanup() { clearTimeout(timer); delete window[cb]; if (script.parentNode) script.parentNode.removeChild(script); }
    window[cb] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error("jsonp error")); };
    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + cb;
    document.body.appendChild(script);
  });
}

const cloud = {
  enabled: () => !!CLOUD_URL,
  list: () => jsonp(CLOUD_URL + "?action=list"),
  save: (farm, flat) =>
    fetch(CLOUD_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "save", farm, flat, token: CLOUD_TOKEN }),
    }),
  remove: (id) =>
    fetch(CLOUD_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "remove", id, token: CLOUD_TOKEN }),
    }),
};

/* ------------------------------------------------------------------ *
 *  MAP
 *  Paste your Google Maps API key into GMAPS_KEY to use Google Maps
 *  (hybrid satellite + Places autocomplete). Leave it blank to use the
 *  keyless OpenStreetMap / Esri map instead. The key needs the Maps
 *  JavaScript, Places and Geocoding APIs enabled, and should be HTTP-
 *  referrer restricted to your site (e.g. njhoogs.github.io/*).
 * ------------------------------------------------------------------ */
const GMAPS_KEY = cfg("__GMAPS_KEY__"); // injected from secret GOOGLE_MAPS_API_KEY

function loadGoogle(key) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);
    const cb = "__gfeGmapReady";
    window[cb] = () => resolve(window.google.maps);
    const sc = document.createElement("script");
    sc.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) +
      "&libraries=places&callback=" + cb + "&loading=async";
    sc.async = true;
    sc.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(sc);
  });
}

// crosshair icon for the "my location" control (both map engines)
const LOCATE_SVG =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';

/* ------------------------------------------------------------------ *
 *  ECan DAIRY EFFLUENT CONSENT LOOKUP
 *  Public ArcGIS REST service (no key). Active consented activities —
 *  effluent dairy discharge. Queried by the pinned point; three layers
 *  cover point / area / global (>10,000 ha) geometries.
 *  Fields are ECan's summary attributes, NOT the full legal conditions.
 * ------------------------------------------------------------------ */
const ECAN_BASE = "https://gis.ecan.govt.nz/arcgis/rest/services/Public/Resource_Consents_Active/MapServer/";
// Layer IDs (verified against the service):
//   5  = Effluent Dairy Discharge (Active)        — POINTS. Pre-2013 consents exist
//                                                   ONLY as points, so this layer is
//                                                   needed or older farms go missing.
//   37 = Effluent Dairy Discharge Area (Active)   — disposal areas < 10,000 ha
//   38 = Effluent Dairy Discharge Global (Active) — blanket areas > 10,000 ha
// Drawn on the map: 5 + 37. Layer 38 is deliberately NOT drawn (a >10,000 ha
// blanket would shade the entire screen); it's only a last-resort query fallback.
const ECAN_DRAW_LAYERS = "5,37";
const ECAN_LAYERS = [37, 5, 38];
const ECAN_FIELDS = [
  "ConsentNo", "ConsentStatus", "HolderName", "Location", "Expires", "toDateText",
  "ConsentedAnimalNumbers", "ActualAnimalNumbers", "CowsWintered", "WinterMilking",
  "MilkingFrequency", "StorageMethod", "StorageLiner", "StorageVolume_m3",
  "DisposalMethod", "FeedPad", "DairyHandstandAdequate", "EfluentSolidsContained",
  "NutrientLoading", "FarmNumber", "GIS_TerritorialAuthority", "LINK",
].join(",");

// WGS84 lat/lng -> NZTM2000 (EPSG:2193). Standard transverse Mercator forward.
function toNZTM(lat, lng) {
  const a = 6378137, f = 1 / 298.257222101;
  const phi = (lat * Math.PI) / 180, lam = (lng * Math.PI) / 180;
  const lam0 = (173 * Math.PI) / 180, phi0 = 0;
  const N0 = 10000000, E0 = 1600000, k0 = 0.9996;
  const e2 = 2 * f - f * f;
  const A0 = 1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 ** 3) / 256;
  const A2 = (3 / 8) * (e2 + e2 * e2 / 4 + (15 * e2 ** 3) / 128);
  const A4 = (15 / 256) * (e2 * e2 + (3 * e2 ** 3) / 4);
  const A6 = (35 * e2 ** 3) / 3072;
  const m = (p) => a * (A0 * p - A2 * Math.sin(2 * p) + A4 * Math.sin(4 * p) - A6 * Math.sin(6 * p));
  const rho = (p) => (a * (1 - e2)) / Math.pow(1 - e2 * Math.sin(p) ** 2, 1.5);
  const nu = (p) => a / Math.sqrt(1 - e2 * Math.sin(p) ** 2);
  const psi = nu(phi) / rho(phi);
  const t = Math.tan(phi), cs = Math.cos(phi), w = lam - lam0;
  const N = nu(phi);
  const T1 = (w ** 2 / 2) * N * Math.sin(phi) * cs;
  const T2 = (w ** 4 / 24) * N * Math.sin(phi) * cs ** 3 * (4 * psi ** 2 + psi - t ** 2);
  const T3 = (w ** 6 / 720) * N * Math.sin(phi) * cs ** 5 *
    (8 * psi ** 4 * (11 - 24 * t ** 2) - 28 * psi ** 3 * (1 - 6 * t ** 2) + psi ** 2 * (1 - 32 * t ** 2) - psi * 2 * t ** 2 + t ** 4);
  const northing = N0 + k0 * (m(phi) - m(phi0) + T1 + T2 + T3);
  const E1 = w * cs;
  const E2 = (w ** 3 / 6) * cs ** 3 * (psi - t ** 2);
  const E3 = (w ** 5 / 120) * cs ** 5 * (4 * psi ** 3 * (1 - 6 * t ** 2) + psi ** 2 * (1 + 8 * t ** 2) - psi * 2 * t ** 2 + t ** 4);
  const easting = E0 + k0 * N * (E1 + E2 + E3);
  return { x: easting, y: northing };
}

async function lookupConsent(lat, lng) {
  const p = toNZTM(lat, lng);
  const geom = encodeURIComponent(JSON.stringify({ x: p.x, y: p.y, spatialReference: { wkid: 2193 } }));

  const q = async (layer, dist) => {
    const d = dist > 0 ? "&distance=" + dist + "&units=esriSRUnit_Meter" : "";
    const url = ECAN_BASE + layer + "/query?f=json&geometry=" + geom +
      "&geometryType=esriGeometryPoint&inSR=2193&spatialRel=esriSpatialRelIntersects" +
      d + "&outFields=" + ECAN_FIELDS + "&returnGeometry=false&resultRecordCount=8";
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      if (j && j.features && j.features.length) {
        return j.features.map((ft) => Object.assign({ _radius: dist }, ft.attributes));
      }
    } catch (err) { /* ignore */ }
    return null;
  };

  // The consent polygon is the DISPOSAL AREA, not the shed — so a pin on the
  // cowshed often falls outside it. Widen the search on the real area/point
  // layers first. The >10,000 ha "global" blanket is only a last resort, since
  // it would otherwise match almost anything.
  for (const dist of [0, 500, 1500, 3000]) {
    for (const layer of [37, 5]) {
      const hit = await q(layer, dist);
      if (hit) return hit;
    }
  }
  return (await q(38, 0)) || [];
}

const blank = (v) => v === null || v === undefined || String(v).trim() === "" ||
  /^(n\/?a|unknown|not recorded|none)$/i.test(String(v).trim());

// Map ECan's StorageMethod / liner / disposal text onto our storage systems.
function systemFromConsent(c) {
  const sm = (c.StorageMethod || "").toLowerCase();
  const dm = (c.DisposalMethod || "").toLowerCase();
  const liner = (c.StorageLiner || "").toLowerCase();
  if (/cover|digest|biogas/.test(sm)) return "covered";
  if (/weeping|wall|separat|solids|screen|stone trap/.test(sm)) return "weeping";
  if (/sump|direct|immediate|no storage/.test(sm) || /daily|immediate/.test(dm)) return "sump";
  if (/pond|lagoon|tank|storage/.test(sm)) {
    // a lined pond emptied by deferred irrigation holds less than a standing pond
    if (/defer/.test(dm) || /line|synthetic|hdpe|concrete|seal/.test(liner)) return "lined";
    return "pond";
  }
  return null;
}

const yes = (v) => /^(y|yes|true|1)/i.test(String(v || "").trim());

// Consented disposal areas as a tile overlay, so the areas are VISIBLE on the map
// and can simply be tapped. Requested in Web Mercator (3857) so tiles line up
// exactly with Google's. Layers 36/37/38 = dairy effluent discharge point/area/global.
const MERC_MAX = 20037508.342789244;
function ecanTileUrl(coord, zoom, size) {
  const world = (2 * MERC_MAX) / Math.pow(2, zoom);
  const xmin = -MERC_MAX + coord.x * world;
  const xmax = xmin + world;
  const ymax = MERC_MAX - coord.y * world;
  const ymin = ymax - world;
  return ECAN_BASE.replace(/\/$/, "") + "/export?" +
    "bbox=" + [xmin, ymin, xmax, ymax].join(",") +
    "&bboxSR=3857&imageSR=3857&size=" + size + "," + size +
    "&layers=show:" + ECAN_DRAW_LAYERS + "&transparent=true&format=png32&dpi=96&f=image";
}

// Rough NZ region from latitude — sets the NIWA climate band; user can override.
function regionFromLat(lat) {
  if (lat > -38.2) return "warm"; // Northland / Auckland / BoP
  if (lat > -42) return "mild"; // Waikato / Taranaki / Manawatū / lower N. Is.
  return "cool"; // Canterbury / Otago / Southland
}

// OpenStreetMap Nominatim geocoding (keyless). NZ-restricted, light use.
async function geocode(q) {
  const url = "https://nominatim.openstreetmap.org/search?format=json&countrycodes=nz&limit=5&q=" + encodeURIComponent(q);
  const r = await fetch(url, { headers: { "Accept": "application/json" } });
  return r.ok ? r.json() : [];
}
async function reverseGeocode(lat, lng) {
  const url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lng;
  try { const r = await fetch(url); const d = await r.json(); return d.display_name || ""; }
  catch (e) { return ""; }
}

const nf = (n, d = 0) =>
  isFinite(n)
    ? n.toLocaleString("en-NZ", { maximumFractionDigits: d, minimumFractionDigits: d })
    : "—";

export default function GreenFieldsMethane() {
  const [s, setS] = useState(DEFAULTS);
  const [showAdv, setShowAdv] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

  // farm records + location
  const [farms, setFarms] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [loc, setLoc] = useState(null); // { lat, lng, address }
  const [geoQuery, setGeoQuery] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);
  const [savedNote, setSavedNote] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [consents, setConsents] = useState(null); // null = not looked up, [] = none found
  const [consentBusy, setConsentBusy] = useState(false);
  const [consentIdx, setConsentIdx] = useState(0);
  const [consentApplied, setConsentApplied] = useState("");
  const [showConsentLayer, setShowConsentLayer] = useState(true);
  const overlayRef = useRef(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapKind = useRef(null); // "google" | "leaflet"
  const googleRef = useRef(null);
  const searchInputRef = useRef(null);
  const hasL = typeof window !== "undefined" && !!window.L;

  const sys = SYSTEMS[s.system];
  const climate = CLIMATES[s.climate];

  const calc = useMemo(() => {
    const vsFrac = 1 - s.ash;
    const fdm = Number(s.fdm) || 0;
    const herd = Number(s.herd) || 0;

    // "cow-day equivalents" of manure landing on each sealed surface
    const yardCowDays = (s.yardHours / 24) * s.milkingDays;
    const padCowDays = s.padUsed ? (s.padHours / 24) * s.padDays : 0;
    const captureCowDays = yardCowDays + padCowDays;

    // Volatile solids reaching the effluent system (kg VS / yr)
    const vsToEffluent = herd * fdm * vsFrac * captureCowDays;

    // total annual VS excreted (for the fate bar)
    const vsTotal = herd * fdm * vsFrac * 365;
    const shareToEffluent = vsTotal > 0 ? vsToEffluent / vsTotal : 0;

    // Effective emission factor (m3 CH4 / kg VS): NIWA regional value x system.
    const effEf = (Number(s.ef) || 0) * sys.rel;

    const volProducedM3 = vsToEffluent * effEf; // m3 CH4 / yr
    const ch4Produced = volProducedM3 * DENSITY; // kg/yr
    const captureEff = s.system === "covered" ? s.captureEff : 0;
    const ch4Captured = ch4Produced * captureEff;
    const ch4Emitted = ch4Produced - ch4Captured;

    const co2e = (ch4Emitted * s.gwp) / 1000; // t CO2e / yr

    // Energy: total producible, and value if captured
    const volProduced = volProducedM3; // m3/yr
    const elecPotential = volProduced * ENERGY_PER_M3 * GEN_EFF; // kWh if all captured
    const valuePotential = elecPotential * s.price;

    const volCaptured = ch4Captured / DENSITY;
    const elecActual = volCaptured * ENERGY_PER_M3 * GEN_EFF;
    const valueActual = elecActual * s.price;

    // ---------- seasonal profile ----------
    // Split VS between yard (milking season) and pad (winter) loading, then run a
    // simple pond solids-store model where monthly methane release scales with
    // pond temperature (Q10). Emissions come from accumulated solids, so they lag
    // loading and peak in late summer as the pond warms. Normalised so the annual
    // sum equals the NIWA-anchored total above.
    const yardVS = herd * fdm * vsFrac * yardCowDays;
    const padVS = s.padUsed ? herd * fdm * vsFrac * padCowDays : 0;

    const spread = (totalVS, startMonth1, spanDays) => {
      const per = new Array(12).fill(0);
      const startDay = MONTH_START[(((startMonth1 - 1) % 12) + 12) % 12];
      for (let d = 0; d < Math.min(spanDays, 365); d++) {
        const day = (startDay + d) % 365;
        let m = 11;
        for (let i = 0; i < 12; i++) if (day < MONTH_START[i] + MONTH_DAYS[i]) { m = i; break; }
        per[m] += 1;
      }
      const tot = per.reduce((a, b) => a + b, 0) || 1;
      return per.map((x) => (totalVS * x) / tot);
    };

    const yardMonthly = spread(yardVS, s.calvingStart, s.milkingDays);
    const padMonthly = spread(padVS, 5, s.padDays); // standoff/feed pad weighted to winter (from May)
    const inputVS = yardMonthly.map((y, i) => y + padMonthly[i]);

    const pondTemp = MONTHS.map((_, m) => s.tmean + s.tamp * Math.cos((2 * Math.PI * (m - 1)) / 12));
    const rTemp = pondTemp.map((t) => Math.pow(s.q10, (t - s.tmean) / 10));

    // Standing sludge pool: fed by inputs and drawn down slowly by settling and
    // periodic removal — not by the methane flux itself, which is a small rate on
    // top of a large resident pool. Monthly release ∝ resident pool × temperature.
    const drain = 0.14; // monthly pool turnover (~7-month effective retention)
    const meanIn = inputVS.reduce((a, b) => a + b, 0) / 12;
    let store = meanIn * 3;
    let emit = new Array(12).fill(0);
    for (let cycle = 0; cycle < 6; cycle++) {
      for (let m = 0; m < 12; m++) {
        store = store * (1 - drain) + inputVS[m];
        emit[m] = store * rTemp[m];
      }
    }
    const emitSum = emit.reduce((a, b) => a + b, 0) || 1;
    const monthly = emit.map((e) => (ch4Emitted * e) / emitSum); // kg CH4 / month

    let peakIdx = 0, minIdx = 0;
    monthly.forEach((v, i) => {
      if (v > monthly[peakIdx]) peakIdx = i;
      if (v < monthly[minIdx]) minIdx = i;
    });
    const warmSum = WARM_MONTHS.reduce((a, i) => a + monthly[i], 0);
    const warmShare = ch4Emitted > 0 ? warmSum / ch4Emitted : 0;
    const peakRatio = monthly[minIdx] > 0 ? monthly[peakIdx] / monthly[minIdx] : 0;

    return {
      effEf,
      monthly,
      pondTemp,
      peakIdx,
      minIdx,
      warmShare,
      peakRatio,
      vsToEffluent,
      shareToEffluent,
      ch4Produced,
      ch4Captured,
      ch4Emitted,
      co2e,
      captureEff,
      volProduced,
      elecPotential,
      valuePotential,
      elecActual,
      valueActual,
      perCow: herd > 0 ? ch4Emitted / herd : 0,
    };
  }, [s, sys, climate]);

  // apply a NIWA climate band (shared by the region buttons and the map)
  const applyClimate = (k) =>
    setS((p) => ({ ...p, climate: k, ef: CLIMATES[k].ef, tmean: CLIMATES[k].tmean, tamp: CLIMATES[k].tamp }));

  // reverse geocode via whichever engine is active
  const doReverse = (lat, lng) =>
    new Promise((resolve) => {
      if (mapKind.current === "google" && googleRef.current) {
        googleRef.current.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          resolve(status === "OK" && results && results[0] ? results[0].formatted_address : "");
        });
      } else {
        reverseGeocode(lat, lng).then(resolve);
      }
    });

  // set a location, drop/move the marker, and infer the region
  const placeLocation = (lat, lng, address, recenter) => {
    setLoc({ lat, lng, address: address || "" });
    applyClimate(regionFromLat(lat));
    // look up ECan dairy effluent consents at this point
    setConsents(null); setConsentIdx(0); setConsentApplied(""); setConsentBusy(true);
    lookupConsent(lat, lng)
      .then((list) => setConsents(list))
      .catch(() => setConsents([]))
      .finally(() => setConsentBusy(false));
    const kind = mapKind.current;
    if (kind === "google" && mapRef.current && googleRef.current) {
      const g = googleRef.current.g;
      if (markerRef.current) markerRef.current.setPosition({ lat, lng });
      else {
        markerRef.current = new g.Marker({ position: { lat, lng }, map: mapRef.current, draggable: true });
        markerRef.current.addListener("dragend", (e) => {
          const la = e.latLng.lat(), ln = e.latLng.lng();
          doReverse(la, ln).then((a) => placeLocation(la, ln, a, false));
        });
      }
      if (recenter) { mapRef.current.setCenter({ lat, lng }); mapRef.current.setZoom(15); }
    } else if (kind === "leaflet" && mapRef.current && window.L) {
      const L = window.L;
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else {
        const LB = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/";
        const icon = L.icon({
          iconUrl: LB + "marker-icon.png", iconRetinaUrl: LB + "marker-icon-2x.png",
          shadowUrl: LB + "marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
        });
        markerRef.current = L.marker([lat, lng], { draggable: true, icon })
          .addTo(mapRef.current)
          .on("dragend", (e) => {
            const p = e.target.getLatLng();
            doReverse(p.lat, p.lng).then((a) => placeLocation(p.lat, p.lng, a, false));
          });
      }
      if (recenter) mapRef.current.setView([lat, lng], 14);
    }
    if (!address) doReverse(lat, lng).then((a) => setLoc((cur) => (cur ? { ...cur, address: a } : cur)));
  };

  const runSearch = async () => {
    const q = geoQuery.trim();
    if (!q) return;
    setGeoBusy(true);
    if (mapKind.current === "google" && googleRef.current) {
      googleRef.current.geocoder.geocode(
        { address: q, componentRestrictions: { country: "NZ" } },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const p = results[0].geometry.location;
            placeLocation(p.lat(), p.lng(), results[0].formatted_address, true);
          }
          setGeoBusy(false);
        }
      );
      return;
    }
    try {
      const res = await geocode(q);
      if (res && res[0]) placeLocation(parseFloat(res[0].lat), parseFloat(res[0].lon), res[0].display_name, true);
    } finally { setGeoBusy(false); }
  };

  const refreshFarms = async () => {
    if (cloud.enabled()) {
      setSyncing(true);
      try {
        const list = await cloud.list();
        try { localStorage.setItem(FARM_KEY, JSON.stringify(list)); } catch (e) {}
        setFarms(Array.isArray(list) ? list : []);
      } catch (e) { setFarms(farmStore.list()); }
      finally { setSyncing(false); }
    } else {
      setFarms(farmStore.list());
    }
  };

  const saveFarm = async () => {
    const name = farmName.trim() || (loc && loc.address ? loc.address.split(",")[0] : "Untitled farm");
    const id = currentId || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const farm = {
      id, name, location: loc, inputs: s,
      results: { ch4Emitted: calc.ch4Emitted, co2e: calc.co2e, peakMonth: MONTHS[calc.peakIdx] },
      updatedAt: new Date().toISOString(),
    };
    setFarms(farmStore.save(farm)); // optimistic + local cache
    setCurrentId(id);
    setFarmName(name);
    if (cloud.enabled()) {
      const sysL = SYSTEMS[s.system];
      const cn = consents && consents.length ? consents[Math.min(consentIdx, consents.length - 1)] : null;
      const flat = {
        Farm: name,
        Updated: new Date().toLocaleString("en-NZ"),
        Address: loc && loc.address ? loc.address : "",
        Lat: loc ? Number(loc.lat.toFixed(5)) : "",
        Lng: loc ? Number(loc.lng.toFixed(5)) : "",
        "ECan consent": cn && cn.ConsentNo ? cn.ConsentNo : "",
        "Consent holder": cn && cn.HolderName ? cn.HolderName : "",
        Cows: Number(s.herd) || 0,
        "Storage system": sysL.label,
        Region: CLIMATES[s.climate].label,
        "Milking days/yr": s.milkingDays,
        "Yard hrs/day": s.yardHours,
        "Standoff pad": s.padUsed ? "Yes" : "No",
        "Pad days/yr": s.padUsed ? s.padDays : "",
        "Pad hrs/day": s.padUsed ? s.padHours : "",
        "Calving start": MONTHS[(s.calvingStart - 1 + 12) % 12],
        "Emission factor (m3/kgVS)": s.ef,
        "Mean pond temp (C)": s.tmean,
        "Temp swing +/- (C)": s.tamp,
        Q10: s.q10,
        "Capture efficiency": s.system === "covered" ? s.captureEff : "",
        GWP: s.gwp,
        "Electricity $/kWh": s.price,
        "Faecal DM (kg/cow/day)": s.fdm,
        Ash: s.ash,
        "CH4 emitted (kg/yr)": Math.round(calc.ch4Emitted),
        "t CO2e/yr": Number(calc.co2e.toFixed(1)),
        "CH4 produced (kg/yr)": Math.round(calc.ch4Produced),
        "Peak month": MONTHS[calc.peakIdx],
        "Energy (kWh/yr)": Math.round(s.system === "covered" ? calc.elecActual : calc.elecPotential),
        "Energy value ($/yr)": Math.round(s.system === "covered" ? calc.valueActual : calc.valuePotential),
      };
      setSavedNote("Syncing “" + name + "”…");
      try { await cloud.save(farm, flat); await refreshFarms(); setSavedNote("Synced “" + name + "” to cloud"); }
      catch (e) { setSavedNote("Saved on this device (cloud unreachable)"); }
    } else {
      setSavedNote("Saved “" + name + "” on this device");
    }
    setTimeout(() => setSavedNote(""), 2800);
  };

  const loadFarm = (f) => {
    setS({ ...DEFAULTS, ...f.inputs });
    setCurrentId(f.id);
    setFarmName(f.name);
    if (f.location) placeLocation(f.location.lat, f.location.lng, f.location.address, true);
    else setLoc(null);
  };

  const deleteFarm = async (id) => {
    setFarms(farmStore.remove(id));
    if (id === currentId) setCurrentId(null);
    if (cloud.enabled()) { try { await cloud.remove(id); await refreshFarms(); } catch (e) {} }
  };

  const newFarm = () => {
    setS(DEFAULTS); setCurrentId(null); setFarmName(""); setLoc(null); setGeoQuery("");
    if (markerRef.current) {
      if (mapKind.current === "google") markerRef.current.setMap(null);
      else if (mapRef.current) mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  // one-tap: fill the calculator from the consent's recorded fields
  const applyConsent = (c) => {
    const changed = [];
    setS((p) => {
      const n = { ...p };
      const herd = parseInt(String(c.ActualAnimalNumbers || "").replace(/\D/g, ""), 10);
      const herdC = parseInt(String(c.ConsentedAnimalNumbers || "").replace(/\D/g, ""), 10);
      const useHerd = !isNaN(herd) && herd > 0 ? herd : (!isNaN(herdC) && herdC > 0 ? herdC : null);
      if (useHerd) { n.herd = useHerd; changed.push(useHerd + " cows"); }

      const sysKey = systemFromConsent(c);
      if (sysKey) { n.system = sysKey; changed.push(SYSTEMS[sysKey].label.toLowerCase()); }

      if (!blank(c.FeedPad)) {
        const hasPad = yes(c.FeedPad);
        n.padUsed = hasPad;
        changed.push(hasPad ? "feed pad in use" : "no feed pad");
      }
      if (!blank(c.WinterMilking) && yes(c.WinterMilking)) {
        n.milkingDays = 365;
        changed.push("winter milking (365 days)");
      }
      return n;
    });
    setConsentApplied(
      changed.length ? "Filled from consent: " + changed.join(", ") : "Nothing to fill — this consent has no recorded herd/storage details."
    );
    if (!farmName.trim() && !blank(c.HolderName)) setFarmName(String(c.HolderName));
    setTimeout(() => setConsentApplied(""), 6000);
  };

  // show/hide the ECan consent overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !overlayRef.current) return;
    if (mapKind.current === "google" && window.google) {
      const arr = map.overlayMapTypes;
      let idx = -1;
      arr.forEach((o, i) => { if (o === overlayRef.current) idx = i; });
      if (showConsentLayer && idx < 0) arr.push(overlayRef.current);
      if (!showConsentLayer && idx >= 0) arr.removeAt(idx);
    } else if (mapKind.current === "leaflet") {
      if (showConsentLayer) overlayRef.current.addTo(map);
      else map.removeLayer(overlayRef.current);
    }
  }, [showConsentLayer, mapReady]);

  // centre the map on the device's GPS position (the "my location" button)
  const goToMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude, ln = pos.coords.longitude;
        doReverse(la, ln).then((a) => placeLocation(la, ln, a, true));
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // load saved farms once (from cloud if configured, else this device)
  useEffect(() => { refreshFarms(); }, []);

  // init the map once: Google Maps if a key is set, otherwise keyless OSM/Esri
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mapRef.current || !mapEl.current) return;

      if (GMAPS_KEY) {
        try {
          const g = await loadGoogle(GMAPS_KEY);
          if (cancelled || mapRef.current || !mapEl.current) return;
          const map = new g.Map(mapEl.current, {
            center: { lat: -43.9, lng: 171.5 }, zoom: 6, mapTypeId: "hybrid",
            streetViewControl: true, fullscreenControl: true, mapTypeControl: false,
          });
          googleRef.current = { g, geocoder: new g.Geocoder() };
          mapKind.current = "google";
          mapRef.current = map;

          // ECan consented disposal areas, drawn over the imagery
          const overlay = new g.ImageMapType({
            name: "ECan effluent disposal areas",
            opacity: 0.4,
            tileSize: new g.Size(256, 256),
            maxZoom: 20,
            getTileUrl: (coord, zoom) => ecanTileUrl(coord, zoom, 256),
          });
          overlayRef.current = overlay;
          map.overlayMapTypes.push(overlay);
          map.addListener("click", (e) => {
            const la = e.latLng.lat(), ln = e.latLng.lng();
            doReverse(la, ln).then((a) => placeLocation(la, ln, a, false));
          });
          // "my location" control (top-right, below fullscreen) — matches the other app
          const locBtn = document.createElement("button");
          locBtn.type = "button";
          locBtn.className = "gf-gloc";
          locBtn.title = "Centre on my location";
          locBtn.innerHTML = LOCATE_SVG;
          locBtn.addEventListener("click", goToMyLocation);
          map.controls[g.ControlPosition.RIGHT_TOP].push(locBtn);
          if (g.places && searchInputRef.current) {
            const ac = new g.places.Autocomplete(searchInputRef.current, {
              componentRestrictions: { country: "nz" },
              fields: ["geometry", "formatted_address", "name"],
            });
            ac.addListener("place_changed", () => {
              const p = ac.getPlace();
              if (p && p.geometry && p.geometry.location)
                placeLocation(p.geometry.location.lat(), p.geometry.location.lng(), p.formatted_address || p.name, true);
            });
          }
          setMapReady(true);
          return;
        } catch (e) { /* key/network problem — fall back to the keyless map */ }
      }

      const L = window.L;
      if (!L || cancelled || mapRef.current || !mapEl.current) return;
      const map = L.map(mapEl.current).setView([-43.9, 171.5], 6);
      const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      });
      const sat = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Imagery © Esri", maxZoom: 19 }
      );
      sat.addTo(map); // aerial imagery, no layer toggle
      const EcanTiles = L.TileLayer.extend({
        getTileUrl: function (coords) {
          return ecanTileUrl({ x: coords.x, y: coords.y }, coords.z, 256);
        },
      });
      overlayRef.current = new EcanTiles("", { opacity: 0.4, maxZoom: 20 });
      overlayRef.current.addTo(map);
      map.on("click", (e) => {
        doReverse(e.latlng.lat, e.latlng.lng).then((a) =>
          placeLocation(e.latlng.lat, e.latlng.lng, a, false));
      });
      const LocateCtl = L.Control.extend({
        onAdd: function () {
          const div = L.DomUtil.create("div", "leaflet-bar gf-gloc-leaf");
          const a = L.DomUtil.create("a", "", div);
          a.href = "#"; a.title = "Centre on my location"; a.innerHTML = LOCATE_SVG;
          L.DomEvent.on(a, "click", (ev) => { L.DomEvent.preventDefault(ev); L.DomEvent.stopPropagation(ev); goToMyLocation(); });
          return div;
        },
      });
      new LocateCtl({ position: "topright" }).addTo(map);
      mapKind.current = "leaflet";
      mapRef.current = map;
      setMapReady(true);
      setTimeout(() => map.invalidateSize(), 200);
    })();
    return () => { cancelled = true; };
  }, []);

  // plume intensity for the visual (0..1)
  const plume = Math.max(0, Math.min(1, calc.ch4Emitted / 4000));
  const captured = s.system === "covered";

  return (
    <div className="gf">
      <style>{css}</style>

      <header className="gf-head">
        <div className="gf-brandbar">
          <div className="gf-logochip">
            <img src={LOGO} alt="Green Fields Energy — Farming Fuel" className="gf-logo" />
          </div>
          <div className="gf-toolname">
            <span className="gf-flame gf-flame-sm" aria-hidden="true" />
            Effluent pond methane estimator
          </div>
        </div>
        <div className="gf-wave" aria-hidden="true" />
        <p className="gf-lede">
          Estimate the methane coming off a dairy effluent system from herd size, storage type
          and the time cows stand on sealed surfaces — and see what that methane is worth as energy.
        </p>
      </header>

      {/* ---------------- FARM RECORDS + LOCATION ---------------- */}
      <section className="gf-panel gf-farmbar">
        <div className="gf-farmcols">
          <div className="gf-farmrecords">
            <div className="gf-sub gf-sub-flush gf-farmhdr">
              <span>Farm records</span>
              <span className="gf-syncbadge">
                {cloud.enabled() ? (
                  <>
                    <span className="gf-syncdot" /> {syncing ? "syncing…" : "Cloud synced"}
                    <button className="gf-refresh" onClick={refreshFarms} title="Refresh from cloud">⟳</button>
                  </>
                ) : (
                  <span className="gf-synclocal">This device only</span>
                )}
              </span>
            </div>
            <div className="gf-farmsaverow">
              <input
                className="gf-farminput"
                placeholder="Farm name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
              <button className="gf-savebtn" onClick={saveFarm}>
                {currentId ? "Update" : "Save"}
              </button>
              <button className="gf-newbtn" onClick={newFarm}>New</button>
            </div>
            {savedNote && <div className="gf-savednote">{savedNote}</div>}
            <div className="gf-farmlist">
              {farms.length === 0 && (
                <div className="gf-farmempty">No farms saved yet — enter details and hit Save. Records are stored in this browser.</div>
              )}
              {farms.map((f) => (
                <div key={f.id} className={"gf-farmrow" + (f.id === currentId ? " on" : "")}>
                  <button className="gf-farmload" onClick={() => loadFarm(f)}>
                    <span className="gf-farmrowname">{f.name}</span>
                    <span className="gf-farmrowmeta">
                      {f.results ? nf(f.results.co2e, 1) + " t CO₂e/yr" : ""}
                      {f.location && f.location.address ? " · " + f.location.address.split(",")[0] : ""}
                    </span>
                  </button>
                  <button className="gf-farmdel" onClick={() => deleteFarm(f.id)} title="Delete farm">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="gf-farmlocation">
            <div className="gf-sub gf-sub-flush">Location</div>
            <div className="gf-searchrow">
              <input
                ref={searchInputRef}
                className="gf-searchinput"
                placeholder="Search address, farm or town…"
                value={geoQuery}
                onChange={(e) => setGeoQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
              />
              <button className="gf-searchbtn" onClick={runSearch} disabled={geoBusy}>
                {geoBusy ? "…" : "Find"}
              </button>
            </div>
            <div ref={mapEl} className="gf-map" />
            <label className="gf-layertoggle">
              <input
                type="checkbox"
                checked={showConsentLayer}
                onChange={(e) => setShowConsentLayer(e.target.checked)}
              />
              <span className="gf-swatch" />
              <span className="gf-swatch-pt" />
              Show consented effluent disposal areas (ECan)
            </label>
            {showConsentLayer && (
              <div className="gf-layerhint">
                Shaded blocks are consented disposal areas; dots are older consents (pre-2013 records
                are points only). Zoom in — the areas only draw below ~1:50,000.
              </div>
            )}
            {loc ? (
              <div className="gf-locmeta">
                <span className="gf-locaddr">{loc.address || "Dropped pin"}</span>
                <span className="gf-loccoord">
                  {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)} · region set to {climate.label.split(" — ")[0].toLowerCase()}
                </span>
              </div>
            ) : (
              <div className="gf-locmeta gf-locmeta-empty">Search, or click the map, to pin the farm and auto-set its region.</div>
            )}
            {!mapReady && (
              <div className="gf-mapwarn">Loading map… (search still works, and you can set the region manually below)</div>
            )}

            {/* ECan consent lookup */}
            {loc && (
              <div className="gf-consent">
                {consentBusy && <div className="gf-consentbusy">Checking ECan effluent consents…</div>}

                {!consentBusy && consents && consents.length === 0 && (
                  <div className="gf-consentnone">
                    No ECan dairy effluent consent found within 3 km. Turn on the consent layer above —
                    the shaded areas are the consented <em>disposal areas</em> (the paddocks effluent goes
                    onto), not the shed — then tap inside one.
                  </div>
                )}

                {!consentBusy && consents && consents.length > 0 && (() => {
                  const c = consents[Math.min(consentIdx, consents.length - 1)];
                  const rows = [
                    ["Holder", c.HolderName],
                    ["Status", c.ConsentStatus],
                    ["Expires", c.toDateText || (c.Expires ? new Date(c.Expires).toLocaleDateString("en-NZ") : "")],
                    ["Consented cows", c.ConsentedAnimalNumbers],
                    ["Actual cows", c.ActualAnimalNumbers],
                    ["Storage method", c.StorageMethod],
                    ["Storage liner", c.StorageLiner],
                    ["Storage volume", blank(c.StorageVolume_m3) ? "" : c.StorageVolume_m3 + " m³"],
                    ["Disposal method", c.DisposalMethod],
                    ["Feed pad", c.FeedPad],
                    ["Winter milking", c.WinterMilking],
                    ["Cows wintered", c.CowsWintered],
                  ].filter((r) => !blank(r[1]));

                  return (
                    <div className="gf-consentcard">
                      <div className="gf-consenthead">
                        <div>
                          <span className="gf-consentno">{c.ConsentNo || "Consent"}</span>
                          <span className="gf-consenttag">
                            {c._radius > 0 ? "found within " + (c._radius / 1000) + " km of pin" : "ECan dairy effluent"}
                          </span>
                        </div>
                        {consents.length > 1 && (
                          <div className="gf-consentnav">
                            <button onClick={() => setConsentIdx((i) => Math.max(0, i - 1))} disabled={consentIdx === 0}>‹</button>
                            <span>{Math.min(consentIdx, consents.length - 1) + 1}/{consents.length}</span>
                            <button onClick={() => setConsentIdx((i) => Math.min(consents.length - 1, i + 1))}
                              disabled={consentIdx >= consents.length - 1}>›</button>
                          </div>
                        )}
                      </div>

                      <dl className="gf-consentrows">
                        {rows.map(([k, v]) => (
                          <div key={k} className="gf-consentrow">
                            <dt>{k}</dt><dd>{String(v)}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="gf-consentactions">
                        <button className="gf-usebtn" onClick={() => applyConsent(c)}>Use these details</button>
                        {!blank(c.LINK) && (
                          <a className="gf-consentlink" href={String(c.LINK)} target="_blank" rel="noopener noreferrer">
                            View consent ↗
                          </a>
                        )}
                      </div>

                      {consentApplied && <div className="gf-consentapplied">{consentApplied}</div>}

                      <p className="gf-consentnote">
                        ECan summary fields, not the full legal conditions — and consented figures may
                        differ from what's on farm today. Check against the consent document before
                        relying on it.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="gf-grid">
        {/* ---------------- INPUTS ---------------- */}
        <section className="gf-panel gf-inputs" aria-label="Farm inputs">
          <Field label="Herd size" hint="Peak cows milked">
            <div className="gf-numrow">
              <input
                className="gf-num"
                type="number"
                min="0"
                value={s.herd}
                onChange={(e) => set("herd", e.target.value === "" ? "" : Number(e.target.value))}
              />
              <span className="gf-unit">cows</span>
            </div>
          </Field>

          <Field label="Effluent storage system" hint={sys.note}>
            <div className="gf-choices">
              {Object.entries(SYSTEMS).map(([k, v]) => (
                <button
                  key={k}
                  className={"gf-choice" + (s.system === k ? " on" : "")}
                  onClick={() => set("system", k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </Field>

          {sys.climate && (
            <Field label="Region / climate" hint="Warmer regions produce more methane per unit of effluent.">
              <div className="gf-seg">
                {Object.entries(CLIMATES).map(([k, v]) => (
                  <button
                    key={k}
                    className={"gf-segbtn" + (s.climate === k ? " on" : "")}
                    onClick={() => applyClimate(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="gf-fine">{climate.label} · {climate.ef} m³ CH₄/kg VS ({climate.src})</div>
            </Field>
          )}

          <div className="gf-sub">Milking yard</div>
          <Field label="Time on yard per day" hint="Both milkings combined — collecting, waiting and milking.">
            <Slider
              value={s.yardHours}
              min={0}
              max={6}
              step={0.25}
              onChange={(v) => set("yardHours", v)}
              suffix="hrs/day"
            />
          </Field>
          <Field label="Milking days per year">
            <Slider
              value={s.milkingDays}
              min={0}
              max={365}
              step={5}
              onChange={(v) => set("milkingDays", v)}
              suffix="days"
            />
          </Field>

          <div className="gf-sub gf-subrow">
            <span>Standoff / feed pad</span>
            <label className="gf-toggle">
              <input
                type="checkbox"
                checked={s.padUsed}
                onChange={(e) => set("padUsed", e.target.checked)}
              />
              <span className="gf-track"><span className="gf-knob" /></span>
              <span className="gf-toglbl">{s.padUsed ? "In use" : "Not used"}</span>
            </label>
          </div>

          {s.padUsed && (
            <>
              <Field label="Hours per day on pad" hint="Effluent scraped or drained from the pad to the pond.">
                <Slider
                  value={s.padHours}
                  min={0}
                  max={20}
                  step={0.5}
                  onChange={(v) => set("padHours", v)}
                  suffix="hrs/day"
                />
              </Field>
              <Field label="Days used per year">
                <Slider
                  value={s.padDays}
                  min={0}
                  max={365}
                  step={5}
                  onChange={(v) => set("padDays", v)}
                  suffix="days"
                />
              </Field>
            </>
          )}

          <button className="gf-advtoggle" onClick={() => setShowAdv((v) => !v)}>
            {showAdv ? "− Hide" : "+ Show"} advanced parameters
          </button>

          {showAdv && (
            <div className="gf-adv">
              <AdvNum label="Faecal dry matter" v={s.fdm} k="fdm" step={0.1} unit="kg DM/cow/day" set={set} />
              <AdvNum label="Ash content" v={s.ash} k="ash" step={0.01} unit="fraction" set={set} />
              <AdvNum label="Pond emission factor (NIWA)" v={s.ef} k="ef" step={0.01} unit="m³ CH₄/kg VS" set={set} />
              {captured && (
                <AdvNum label="Capture efficiency" v={s.captureEff} k="captureEff" step={0.05} unit="fraction" set={set} />
              )}
              <div className="gf-advfield">
                <label>Methane GWP₁₀₀</label>
                <div className="gf-seg gf-seg-sm">
                  {[25, 27, 28].map((g) => (
                    <button
                      key={g}
                      className={"gf-segbtn" + (s.gwp === g ? " on" : "")}
                      onClick={() => set("gwp", g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <AdvNum label="Electricity price" v={s.price} k="price" step={0.01} unit="$/kWh" set={set} />
              <div className="gf-advdiv">Seasonal model</div>
              <AdvNum label="Mean pond temp" v={s.tmean} k="tmean" step={0.5} unit="°C" set={set} />
              <AdvNum label="Seasonal swing (±)" v={s.tamp} k="tamp" step={0.5} unit="°C" set={set} />
              <AdvNum label="Temp sensitivity (Q₁₀)" v={s.q10} k="q10" step={0.1} unit="× per 10°C" set={set} />
              <div className="gf-advfield">
                <label>Calving / milking start</label>
                <select
                  className="gf-select"
                  value={s.calvingStart}
                  onChange={(e) => set("calvingStart", Number(e.target.value))}
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <button className="gf-reset" onClick={() => setS(DEFAULTS)}>Reset to Canterbury defaults</button>
            </div>
          )}
        </section>

        {/* ---------------- RESULTS ---------------- */}
        <section className="gf-panel gf-results" aria-label="Results">
          <PondViz plume={plume} captured={captured} shareToEffluent={calc.shareToEffluent} />

          <div className="gf-headline">
            <div className="gf-hnum">
              <span className="gf-big">{nf(calc.ch4Emitted)}</span>
              <span className="gf-bigunit">kg CH₄ / yr released</span>
            </div>
            <div className="gf-co2e">
              ≈ {nf(calc.co2e, 1)} t CO₂e/yr
              <span className="gf-co2sub">at GWP {s.gwp}</span>
            </div>
          </div>

          {/* fate: manure */}
          <FateBar
            label="Where the manure goes"
            segments={[
              { v: calc.shareToEffluent, color: "var(--pond2)", name: "To effluent" },
              { v: 1 - calc.shareToEffluent, color: "var(--pasture)", name: "On pasture" },
            ]}
            caption={`${nf(calc.shareToEffluent * 100, 1)}% of dung lands on sealed surfaces and reaches the pond`}
          />

          {/* fate: methane */}
          {captured && (
            <FateBar
              label="Methane produced in the pond"
              segments={[
                { v: calc.captureEff, color: "var(--flare)", name: "Captured" },
                { v: 1 - calc.captureEff, color: "var(--emit)", name: "Released" },
              ]}
              caption={`${nf(calc.ch4Produced)} kg CH₄/yr produced · ${nf(calc.ch4Captured)} kg captured`}
            />
          )}

          {/* stat cards */}
          <div className="gf-cards">
            <Stat big label="Methane produced" value={nf(calc.ch4Produced)} unit="kg CH₄/yr" />
            <Stat label="Per cow" value={nf(calc.perCow, 1)} unit="kg CH₄/yr" />
            <Stat label="Emission factor" value={nf(calc.effEf, 3)} unit="m³ CH₄/kg VS (NIWA)" />
          </div>

          {/* energy panel */}
          <div className={"gf-energy" + (captured ? " live" : "")}>
            <div className="gf-energyhead">
              <span className="gf-flame gf-flame-sm" aria-hidden="true" />
              {captured ? "Energy recovered" : "Energy potential if captured"}
            </div>
            <div className="gf-energyrow">
              <div>
                <div className="gf-eval">
                  {nf(captured ? calc.elecActual : calc.elecPotential)}
                </div>
                <div className="gf-elbl">kWh electricity / yr</div>
              </div>
              <div>
                <div className="gf-eval gf-eval-dollar">
                  ${nf(captured ? calc.valueActual : calc.valuePotential)}
                </div>
                <div className="gf-elbl">value / yr @ ${nf(s.price, 2)}/kWh</div>
              </div>
              <div>
                <div className="gf-eval">{nf(calc.volProduced)}</div>
                <div className="gf-elbl">m³ CH₄ / yr</div>
              </div>
            </div>
            {!captured && (
              <p className="gf-upsell">
                A covered pond or digester could recover most of this methane — turning an emission
                into on-farm energy. Switch the storage system above to model it.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ---------------- SEASONAL PROFILE ---------------- */}
      <section className="gf-panel gf-season">
        <div className="gf-seasonhead">
          <div>
            <div className="gf-sub gf-sub-flush">Seasonal profile</div>
            <p className="gf-seasonlede">
              Emissions aren't flat across the year. Methane rises as the pond warms, so a farm's
              release is concentrated in late summer — even though most manure enters earlier.
            </p>
          </div>
          <div className="gf-peakcard">
            <div className="gf-peakmonth">{MONTHS[calc.peakIdx]}</div>
            <div className="gf-peaklbl">peak month · {nf(calc.monthly[calc.peakIdx])} kg CH₄</div>
          </div>
        </div>

        <SeasonChart monthly={calc.monthly} pondTemp={calc.pondTemp} peakIdx={calc.peakIdx} gwp={s.gwp} />

        <div className="gf-seasonstats">
          <div className="gf-sstat">
            <span className="gf-sstatval">{nf(calc.warmShare * 100)}%</span>
            <span className="gf-sstatlbl">released in the warm half (Nov–Apr)</span>
          </div>
          <div className="gf-sstat">
            <span className="gf-sstatval">{nf(calc.peakRatio, 1)}×</span>
            <span className="gf-sstatlbl">peak month vs winter low</span>
          </div>
          <div className="gf-sstat">
            <span className="gf-sstatval">{nf(calc.pondTemp[calc.peakIdx])}°C</span>
            <span className="gf-sstatlbl">modelled peak pond temperature</span>
          </div>
        </div>

        {s.system !== "sump" && (
          <p className="gf-seasontip">
            Because the curve is temperature-driven, emptying the pond before summer — as NIWA and
            DairyNZ advise — cuts the tallest bars, not the flat ones. Ask us about capture that runs
            hardest exactly when the pond is producing most.
          </p>
        )}
      </section>


      <section className="gf-panel gf-method">
        <button className="gf-methbtn" onClick={() => setShowMethod((v) => !v)}>
          {showMethod ? "−" : "+"} How this is calculated
        </button>
        {showMethod && (
          <div className="gf-methbody">
            <p className="gf-eq">
              CH₄ = VS&nbsp;×&nbsp;EF&nbsp;×&nbsp;0.67&nbsp;×&nbsp;(share of manure reaching the pond)
            </p>
            <p>
              Volatile solids (VS) are the methane-producing part of the dung: faecal dry matter
              minus its ash content. The share reaching the pond is driven by how long cows stand on
              the milking yard and any standoff or feed pad — that dung is scraped or washed into the
              effluent system, while the rest drops on pasture and produces almost no methane.
            </p>
            <p>
              EF is the emission factor — the methane actually produced per kg of volatile solids.
              Rather than the IPCC Oceania default (0.17 m³/kg VS), this tool uses values measured
              directly from New Zealand dairy effluent ponds by NIWA, which run meaningfully higher.
            </p>
            <ul className="gf-meth-list">
              <li><strong>EF = 0.21 / 0.22 / 0.29</strong> m³ CH₄/kg VS for cool / mild / warm regions — measured NZ ponds (Heubeck et al. 2014; Craggs et al. 2008), currently set to <strong>{s.ef}</strong> × {sys.rel} for this system.</li>
              <li><strong>0.67</strong> kg/m³ converts methane volume to mass.</li>
              <li><strong>Faecal dry matter ≈ {s.fdm}</strong> kg/cow/day (~900 kg/yr; Ledgard &amp; Brier 2004), ash {s.ash}.</li>
              <li>Energy uses ~9.9 kWh/m³ CH₄ at 35% generation efficiency.</li>
              <li><strong>Seasonal curve:</strong> the annual total is split across months by pond temperature (Q₁₀ = {s.q10}) acting on accumulated solids, so release peaks in late summer. NIWA measured this seasonal swing directly; here it distributes the measured annual figure rather than adding to it.</li>
            </ul>
            <p className="gf-disc">
              A planning estimate, not a compliance figure. NIWA's own work found emissions vary
              several-fold between farms and seasons with temperature, retention time and solids
              loading, so treat the regional EF as a starting point and adjust it in the advanced
              panel where farm data exists. GWP* and short-lived-gas accounting will give a different
              warming picture from the CO₂e shown here.
            </p>
          </div>
        )}
      </section>

      <footer className="gf-foot">
        Green Fields Energy · estimator for advisory use · NZ Inventory / Pratt et&nbsp;al. (2012) Tier-2 method
      </footer>
    </div>
  );
}

/* ---------------- sub-components ---------------- */

function Field({ label, hint, children }) {
  return (
    <div className="gf-field">
      <label className="gf-flabel">{label}</label>
      {children}
      {hint && <div className="gf-hint">{hint}</div>}
    </div>
  );
}

function Slider({ value, min, max, step, onChange, suffix }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="gf-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--flare) ${pct}%, var(--line) ${pct}%)` }}
      />
      <div className="gf-slidval">
        {value % 1 === 0 ? value : value.toFixed(2).replace(/0$/, "")} <span>{suffix}</span>
      </div>
    </div>
  );
}

function AdvNum({ label, v, k, step, unit, set }) {
  return (
    <div className="gf-advfield">
      <label>{label}</label>
      <div className="gf-numrow">
        <input
          className="gf-num gf-num-sm"
          type="number"
          step={step}
          value={v}
          onChange={(e) => set(k, e.target.value === "" ? "" : Number(e.target.value))}
        />
        <span className="gf-unit">{unit}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, big }) {
  return (
    <div className={"gf-stat" + (big ? " big" : "")}>
      <div className="gf-statval">{value}</div>
      <div className="gf-statunit">{unit}</div>
      <div className="gf-statlbl">{label}</div>
    </div>
  );
}

function FateBar({ label, segments, caption }) {
  return (
    <div className="gf-fate">
      <div className="gf-fatelbl">{label}</div>
      <div className="gf-fatebar">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="gf-fateseg"
            style={{ width: `${Math.max(0, seg.v * 100)}%`, background: seg.color }}
            title={`${seg.name}: ${(seg.v * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="gf-fatecap">{caption}</div>
    </div>
  );
}

function PondViz({ plume, captured, shareToEffluent }) {
  const bubbles = [0, 1, 2, 3, 4, 5];
  return (
    <div className="gf-viz">
      <svg viewBox="0 0 400 210" className="gf-svg" role="img" aria-label="Effluent pond cross-section">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6ede1" />
            <stop offset="1" stopColor="#f4f6ef" />
          </linearGradient>
          <linearGradient id="slurry" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f5947" />
            <stop offset="1" stopColor="#1c2c24" />
          </linearGradient>
          <radialGradient id="plume" cx="0.5" cy="1" r="1">
            <stop offset="0" stopColor="#c99a4a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c99a4a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="400" height="210" fill="url(#sky)" />

        {/* pasture banks */}
        <path d="M0,150 L120,150 L165,120 L235,120 L280,150 L400,150 L400,210 L0,210 Z" fill="#2f6b47" opacity="0.14" />
        {/* pond liner */}
        <path d="M118,150 L168,118 L232,118 L282,150 Z" fill="#0f1712" opacity="0.35" />
        {/* slurry */}
        <path d="M124,150 L171,122 L229,122 L276,150 Z" fill="url(#slurry)" />
        {/* slurry surface line */}
        <line x1="171" y1="122" x2="229" y2="122" stroke="#5c7a63" strokeWidth="1.5" opacity="0.7" />

        {/* methane plume */}
        <ellipse
          className="gf-plume"
          cx="200"
          cy="122"
          rx="46"
          ry="70"
          fill="url(#plume)"
          style={{ opacity: 0.25 + plume * 0.75 }}
        />

        {/* rising bubbles */}
        {bubbles.map((b) => (
          <circle
            key={b}
            className="gf-bubble"
            cx={176 + b * 9.5}
            cy="120"
            r={1.6 + (b % 3) * 0.5}
            fill="#d7b26a"
            style={{
              animationDelay: `${b * 0.5}s`,
              opacity: 0.2 + plume * 0.7,
            }}
          />
        ))}

        {captured && (
          <>
            {/* cover dome */}
            <path d="M169,122 Q200,96 231,122 Z" fill="#243029" opacity="0.9" />
            <path d="M169,122 Q200,96 231,122" fill="none" stroke="#3c5145" strokeWidth="2" />
            {/* pipe to generator */}
            <path d="M231,110 L300,110 L300,140" fill="none" stroke="#8a7a45" strokeWidth="3" />
            {/* generator */}
            <rect x="286" y="140" width="30" height="22" rx="2" fill="#2f6b47" />
            {/* flare */}
            <path className="gf-flare-svg" d="M301,140 q-5,-8 0,-14 q5,6 0,14 Z" fill="#e0952f" />
          </>
        )}

        <text x="200" y="172" textAnchor="middle" className="gf-svglbl">
          {captured ? "biogas captured" : "methane to atmosphere"}
        </text>
      </svg>
    </div>
  );
}

function SeasonChart({ monthly, pondTemp, peakIdx, gwp }) {
  const W = 720, H = 260, padL = 40, padR = 16, padT = 18, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const max = Math.max(...monthly, 0.0001);
  const n = monthly.length;
  const bw = plotW / n;

  const tMin = Math.min(...pondTemp);
  const tMax = Math.max(...pondTemp);
  const tSpan = tMax - tMin || 1;
  const tempPts = pondTemp.map((t, i) => {
    const x = padL + bw * (i + 0.5);
    const y = padT + plotH - ((t - tMin) / tSpan) * plotH * 0.9;
    return [x, y];
  });
  const tempPath = tempPts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");

  return (
    <div className="gf-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="gf-chartsvg" role="img" aria-label="Monthly methane emission profile">
        <defs>
          <linearGradient id="barfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e7a23f" />
            <stop offset="1" stopColor="#d98a20" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="#d6dccb" strokeWidth="1" />

        {/* bars */}
        {monthly.map((v, i) => {
          const h = (v / max) * plotH;
          const x = padL + bw * i + bw * 0.16;
          const y = padT + plotH - h;
          const isPeak = i === peakIdx;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={bw * 0.68}
                height={Math.max(0, h)}
                rx="3"
                fill={isPeak ? "url(#barfill)" : "#e7a23f"}
                opacity={isPeak ? 1 : 0.42}
              >
                <title>{`${MONTHS[i]}: ${nf(v)} kg CH₄ (${nf((v * gwp) / 1000, 1)} t CO₂e)`}</title>
              </rect>
              <text x={x + bw * 0.34} y={H - 12} textAnchor="middle" className="gf-chartlbl">
                {MONTHS[i][0]}
              </text>
            </g>
          );
        })}

        {/* pond temperature overlay */}
        <path d={tempPath} fill="none" stroke="#1C9AD6" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        {tempPts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#1C9AD6" opacity="0.85" />
        ))}
      </svg>
      <div className="gf-chartkey">
        <span><i className="gf-k-bar" /> methane released (kg CH₄/month)</span>
        <span><i className="gf-k-line" /> pond temperature</span>
      </div>
    </div>
  );
}


const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@700&display=swap');

.gf{
  --paper:#E9EDE3; --card:#FBFCF8; --ink:#16211B; --ink2:#59685B;
  --line:#D6DCCB; --flare:#DE8F2A; --flare-deep:#B9741A;
  --pasture:#2F6B47; --emit:#AE472B; --pond2:#22362C;
  --brand-green:#3FA535; --brand-blue:#1C9AD6;
  background:var(--paper); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; line-height:1.5;
  padding:clamp(16px,3vw,34px); min-height:100vh;
  overflow-x:hidden; max-width:100vw;
  -webkit-font-smoothing:antialiased;
}
.gf *{box-sizing:border-box;}

.gf-head{max-width:1080px;margin:0 auto 22px;}
.gf-brandbar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.gf-logochip{background:#fff;border:1px solid var(--line);border-radius:14px;
  padding:12px 18px;display:inline-flex;box-shadow:0 1px 3px rgba(20,33,27,.05);}
.gf-logo{height:46px;width:auto;display:block;}
.gf-toolname{display:flex;align-items:center;gap:8px;font-family:'Space Grotesk';
  font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.13em;color:var(--ink2);}
.gf-wave{height:3px;border-radius:3px;margin:16px 0 0;max-width:220px;
  background:linear-gradient(90deg,#1c6b34,var(--brand-green) 45%,var(--brand-blue));}
.gf-mark{width:44px;height:44px;border-radius:11px;background:var(--ink);
  display:grid;place-items:center;position:relative;flex:none;}
.gf-flame{width:16px;height:22px;border-radius:0 50% 50% 50%;
  background:linear-gradient(180deg,#f4c15e,var(--flare) 55%,var(--flare-deep));
  transform:rotate(45deg);box-shadow:0 0 14px rgba(222,143,42,.6);
  animation:flick 2.4s ease-in-out infinite;}
.gf-flame-sm{width:11px;height:15px;display:inline-block;transform:rotate(45deg) translateY(1px);}
@keyframes flick{0%,100%{transform:rotate(45deg) scale(1)}50%{transform:rotate(45deg) scale(1.12)}}
.gf-co{font-family:'Space Grotesk';font-weight:700;font-size:20px;letter-spacing:-.02em;}
.gf-tag{font-size:12.5px;color:var(--ink2);text-transform:uppercase;letter-spacing:.14em;font-weight:600;}
.gf-lede{max-width:640px;margin:16px 0 0;color:var(--ink2);font-size:15px;}

.gf-grid{max-width:1080px;margin:0 auto;display:grid;gap:18px;
  grid-template-columns:minmax(0,0.92fr) minmax(0,1.08fr);align-items:start;}
@media(max-width:860px){.gf-grid{grid-template-columns:1fr;}}

.gf-panel{background:var(--card);border:1px solid var(--line);border-radius:16px;
  padding:clamp(16px,2.4vw,24px);}

/* inputs */
.gf-field{margin-bottom:16px;}
.gf-flabel{display:block;font-weight:600;font-size:14px;margin-bottom:7px;}
.gf-hint{font-size:12.5px;color:var(--ink2);margin-top:6px;line-height:1.4;}
.gf-fine{font-size:12px;color:var(--ink2);margin-top:6px;}
.gf-sub{font-family:'Space Grotesk';font-weight:600;font-size:12px;text-transform:uppercase;
  letter-spacing:.13em;color:var(--flare-deep);margin:22px 0 12px;
  padding-top:16px;border-top:1px solid var(--line);}
.gf-subrow{display:flex;align-items:center;justify-content:space-between;}

.gf-numrow{display:flex;align-items:baseline;gap:8px;}
.gf-num{font-family:'Space Mono';font-size:22px;font-weight:700;color:var(--ink);
  width:110px;padding:8px 12px;border:1.5px solid var(--line);border-radius:10px;
  background:#fff;outline:none;}
.gf-num-sm{font-size:15px;width:88px;padding:6px 10px;}
.gf-num:focus{border-color:var(--flare);}
.gf-unit{font-size:13px;color:var(--ink2);}

.gf-choices{display:flex;flex-direction:column;gap:7px;}
.gf-choice{text-align:left;font-family:inherit;font-size:13.5px;font-weight:500;
  padding:11px 13px;border:1.5px solid var(--line);border-radius:10px;background:#fff;
  color:var(--ink);cursor:pointer;transition:all .15s;}
.gf-choice:hover{border-color:#b9c3ab;}
.gf-choice.on{border-color:var(--ink);background:var(--ink);color:#f4f6ef;font-weight:600;}

.gf-seg{display:flex;gap:6px;}
.gf-segbtn{flex:1;font-family:inherit;font-size:12.5px;font-weight:600;text-transform:capitalize;
  padding:9px 6px;border:1.5px solid var(--line);border-radius:9px;background:#fff;
  color:var(--ink2);cursor:pointer;transition:all .15s;}
.gf-segbtn.on{background:var(--pasture);border-color:var(--pasture);color:#fff;}
.gf-seg-sm .gf-segbtn{font-family:'Space Mono';padding:6px;}

/* slider */
.gf-slider{display:flex;align-items:center;gap:14px;}
.gf-slider input[type=range]{-webkit-appearance:none;appearance:none;height:6px;border-radius:6px;
  flex:1;outline:none;cursor:pointer;}
.gf-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;
  border-radius:50%;background:#fff;border:3px solid var(--flare);cursor:pointer;
  box-shadow:0 1px 4px rgba(0,0,0,.2);}
.gf-slider input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;
  background:#fff;border:3px solid var(--flare);cursor:pointer;}
.gf-slidval{font-family:'Space Mono';font-weight:700;font-size:15px;min-width:82px;text-align:right;}
.gf-slidval span{font-family:'Inter';font-weight:500;font-size:11px;color:var(--ink2);}

/* toggle */
.gf-toggle{display:flex;align-items:center;gap:9px;cursor:pointer;text-transform:none;letter-spacing:0;}
.gf-toggle input{position:absolute;opacity:0;}
.gf-track{width:40px;height:23px;border-radius:20px;background:var(--line);position:relative;transition:.2s;}
.gf-knob{position:absolute;top:2.5px;left:2.5px;width:18px;height:18px;border-radius:50%;
  background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}
.gf-toggle input:checked + .gf-track{background:var(--flare);}
.gf-toggle input:checked + .gf-track .gf-knob{transform:translateX(17px);}
.gf-toglbl{font-size:12.5px;font-weight:600;color:var(--ink2);font-family:'Inter';}

.gf-advtoggle,.gf-methbtn{font-family:'Space Grotesk';font-weight:600;font-size:13px;
  color:var(--flare-deep);background:none;border:none;cursor:pointer;padding:6px 0;margin-top:6px;}
.gf-adv{margin-top:12px;padding-top:14px;border-top:1px dashed var(--line);
  display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;}
.gf-advfield label{display:block;font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:5px;}
.gf-reset{grid-column:1/-1;font-family:inherit;font-size:12.5px;font-weight:600;color:var(--ink2);
  background:#fff;border:1.5px solid var(--line);border-radius:9px;padding:9px;cursor:pointer;margin-top:2px;}
.gf-reset:hover{border-color:var(--emit);color:var(--emit);}

/* results */
.gf-viz{margin:-6px -6px 4px;}
.gf-svg{width:100%;display:block;border-radius:12px;}
.gf-svglbl{font-family:'Space Mono';font-size:9px;fill:#7c8a7e;letter-spacing:.08em;text-transform:uppercase;}
.gf-bubble{animation:rise 3s ease-in infinite;}
@keyframes rise{0%{transform:translateY(0);opacity:0}20%{opacity:.8}100%{transform:translateY(-58px);opacity:0}}
.gf-flare-svg{animation:flick 1.6s ease-in-out infinite;transform-origin:301px 140px;}
@media(prefers-reduced-motion:reduce){.gf-bubble,.gf-flare-svg,.gf-flame{animation:none;}}

.gf-headline{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;
  flex-wrap:wrap;margin:14px 0 20px;padding-bottom:18px;border-bottom:1px solid var(--line);}
.gf-hnum{display:flex;flex-direction:column;}
.gf-big{font-family:'Space Mono';font-weight:700;font-size:clamp(38px,7vw,54px);
  line-height:1;letter-spacing:-.03em;color:var(--emit);}
.gf-bigunit{font-size:13px;font-weight:600;color:var(--ink2);margin-top:4px;}
.gf-co2e{font-family:'Space Grotesk';font-weight:600;font-size:19px;text-align:right;}
.gf-co2sub{display:block;font-family:'Inter';font-size:11px;font-weight:500;color:var(--ink2);}

.gf-fate{margin-bottom:16px;}
.gf-fatelbl{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;
  color:var(--ink2);margin-bottom:7px;}
.gf-fatebar{display:flex;height:16px;border-radius:8px;overflow:hidden;background:var(--line);}
.gf-fateseg{transition:width .3s ease;}
.gf-fatecap{font-size:12.5px;color:var(--ink2);margin-top:7px;}

.gf-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:20px 0;}
.gf-stat{background:var(--paper);border-radius:11px;padding:13px;}
.gf-stat.big{background:var(--ink);color:#f4f6ef;}
.gf-statval{font-family:'Space Mono';font-weight:700;font-size:20px;letter-spacing:-.02em;}
.gf-statunit{font-size:11px;color:var(--ink2);margin-top:2px;}
.gf-stat.big .gf-statunit{color:#aeb9ac;}
.gf-statlbl{font-size:12px;font-weight:600;margin-top:8px;}

.gf-energy{border:1.5px solid var(--line);border-radius:13px;padding:16px;background:#fff;}
.gf-energy.live{border-color:var(--flare);background:linear-gradient(180deg,#fdf6ea,#fff);}
.gf-energyhead{display:flex;align-items:center;gap:8px;font-family:'Space Grotesk';font-weight:600;
  font-size:14px;margin-bottom:14px;}
.gf-energyrow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;}
.gf-eval{font-family:'Space Mono';font-weight:700;font-size:21px;letter-spacing:-.02em;}
.gf-eval-dollar{color:var(--flare-deep);}
.gf-elbl{font-size:11.5px;color:var(--ink2);margin-top:3px;line-height:1.3;}
.gf-upsell{font-size:12.5px;color:var(--ink2);margin:14px 0 0;padding-top:12px;
  border-top:1px dashed var(--line);}

/* farm records + location */
.gf-farmbar{max-width:1080px;margin:0 auto 18px;}
.gf-farmcols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;}
.gf-farmrecords,.gf-farmlocation{min-width:0;}
@media(max-width:760px){.gf-farmcols{grid-template-columns:minmax(0,1fr);}}
.gf-farmsaverow{display:flex;gap:8px;margin-bottom:4px;}
.gf-farminput{flex:1;min-width:0;font-family:'Inter';font-size:14px;padding:10px 12px;border:1.5px solid var(--line);
  border-radius:10px;background:#fff;color:var(--ink);outline:none;}
.gf-farminput:focus{border-color:var(--flare);}
.gf-savebtn{font-family:'Space Grotesk';font-weight:600;font-size:13.5px;padding:10px 18px;border:none;
  border-radius:10px;background:var(--pasture);color:#fff;cursor:pointer;}
.gf-savebtn:hover{background:#25583a;}
.gf-newbtn{font-family:'Space Grotesk';font-weight:600;font-size:13.5px;padding:10px 14px;border:1.5px solid var(--line);
  border-radius:10px;background:#fff;color:var(--ink2);cursor:pointer;}
.gf-newbtn:hover{border-color:var(--ink2);}
.gf-savednote{font-size:12.5px;color:var(--pasture);font-weight:600;margin:6px 0;}
.gf-farmlist{display:flex;flex-direction:column;gap:6px;margin-top:8px;max-height:220px;overflow-y:auto;}
.gf-farmempty{font-size:12.5px;color:var(--ink2);padding:10px 2px;line-height:1.4;}
.gf-farmhdr{display:flex;align-items:center;justify-content:space-between;}
.gf-syncbadge{display:inline-flex;align-items:center;gap:6px;font-family:'Inter';font-weight:600;
  font-size:11.5px;letter-spacing:.02em;text-transform:none;color:var(--pasture);}
.gf-synclocal{color:var(--ink2);}
.gf-syncdot{width:8px;height:8px;border-radius:50%;background:var(--pasture);display:inline-block;
  box-shadow:0 0 0 3px rgba(47,107,73,.15);}
.gf-refresh{border:none;background:none;color:var(--ink2);font-size:15px;cursor:pointer;padding:0 2px;line-height:1;}
.gf-refresh:hover{color:var(--flare-deep);}
.gf-farmrow{display:flex;align-items:stretch;gap:6px;}
.gf-farmload{flex:1;text-align:left;background:var(--paper);border:1.5px solid transparent;border-radius:10px;
  padding:9px 12px;cursor:pointer;display:flex;flex-direction:column;gap:2px;}
.gf-farmrow.on .gf-farmload{border-color:var(--flare);background:#fdf6ea;}
.gf-farmload:hover{border-color:#c9d2bd;}
.gf-farmrowname{font-weight:600;font-size:14px;color:var(--ink);}
.gf-farmrowmeta{font-size:12px;color:var(--ink2);}
.gf-farmdel{width:38px;border:1.5px solid var(--line);border-radius:10px;background:#fff;color:var(--ink2);
  font-size:18px;line-height:1;cursor:pointer;flex:none;}
.gf-farmdel:hover{border-color:var(--emit);color:var(--emit);}

.gf-searchrow{display:flex;gap:8px;margin-bottom:10px;}
.gf-searchinput{flex:1;min-width:0;font-family:'Inter';font-size:14px;padding:10px 12px;border:1.5px solid var(--line);
  border-radius:10px;background:#fff;color:var(--ink);outline:none;}
.gf-searchinput:focus{border-color:var(--flare);}
.gf-searchbtn{font-family:'Space Grotesk';font-weight:600;font-size:13.5px;padding:10px 18px;border:none;
  border-radius:10px;background:var(--ink);color:#f4f6ef;cursor:pointer;min-width:56px;}
.gf-searchbtn:disabled{opacity:.6;cursor:default;}
.gf-map{height:340px;max-width:100%;border-radius:12px;border:1px solid var(--line);background:#e9ede3;overflow:hidden;z-index:0;}
.gf-gloc{background:#fff;border:none;border-radius:8px;width:40px;height:40px;margin:0 10px 10px 0;
  box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}
.gf-gloc:hover{background:#f6f6f6;}
.gf-gloc-leaf a{display:flex !important;align-items:center;justify-content:center;width:34px;height:34px;background:#fff;}
.gf-map .leaflet-container{height:100%;border-radius:12px;font-family:'Inter';}
.gf-locmeta{margin-top:9px;display:flex;flex-direction:column;gap:2px;}
.gf-locaddr{font-size:13px;color:var(--ink);font-weight:500;}
.gf-loccoord{font-family:'Space Mono';font-size:11.5px;color:var(--ink2);}
.gf-locmeta-empty{font-size:12.5px;color:var(--ink2);}
.gf-mapwarn{font-size:12px;color:var(--emit);margin-top:8px;}
.gf-layertoggle{display:flex;align-items:center;gap:8px;margin-top:9px;font-size:12.5px;
  color:var(--ink2);cursor:pointer;line-height:1.35;}
.gf-layertoggle input{accent-color:var(--brand-blue);width:16px;height:16px;flex:none;cursor:pointer;}
.gf-swatch{width:14px;height:14px;flex:none;border-radius:3px;background:rgba(112,168,0,.45);
  border:1.5px solid #70a800;}
.gf-swatch-pt{width:9px;height:9px;flex:none;border-radius:50%;background:#70a800;
  border:1.5px solid #4d7500;margin-left:-3px;}
.gf-layerhint{font-size:11.5px;color:var(--ink2);margin:6px 0 0 26px;line-height:1.4;}

/* ECan consent lookup */
.gf-consent{margin-top:12px;}
.gf-consentbusy{font-size:12.5px;color:var(--ink2);padding:10px 12px;background:var(--paper);border-radius:10px;}
.gf-consentnone{font-size:12.5px;color:var(--ink2);padding:11px 13px;background:var(--paper);
  border-radius:10px;line-height:1.45;}
.gf-consentcard{border:1.5px solid var(--brand-blue);border-radius:12px;padding:14px;background:#f5fbfe;}
.gf-consenthead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
.gf-consentno{font-family:'Space Mono';font-weight:700;font-size:15px;color:var(--ink);}
.gf-consenttag{display:block;font-size:11px;color:var(--brand-blue);font-weight:600;
  text-transform:uppercase;letter-spacing:.09em;margin-top:2px;}
.gf-consentnav{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink2);}
.gf-consentnav button{width:26px;height:26px;border:1.5px solid var(--line);background:#fff;border-radius:7px;
  cursor:pointer;color:var(--ink);font-size:14px;line-height:1;}
.gf-consentnav button:disabled{opacity:.4;cursor:default;}
.gf-consentrows{margin:0 0 12px;display:grid;grid-template-columns:1fr;gap:0;}
.gf-consentrow{display:flex;justify-content:space-between;gap:12px;padding:6px 0;
  border-bottom:1px dashed #d7e6ef;}
.gf-consentrow:last-child{border-bottom:none;}
.gf-consentrow dt{font-size:12.5px;color:var(--ink2);margin:0;flex:none;}
.gf-consentrow dd{font-size:12.5px;color:var(--ink);margin:0;text-align:right;font-weight:500;word-break:break-word;}
.gf-consentactions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.gf-usebtn{font-family:'Space Grotesk';font-weight:600;font-size:13.5px;padding:10px 16px;border:none;
  border-radius:10px;background:var(--brand-blue);color:#fff;cursor:pointer;}
.gf-usebtn:hover{background:#1580b5;}
.gf-consentlink{font-size:12.5px;color:var(--brand-blue);font-weight:600;text-decoration:none;}
.gf-consentlink:hover{text-decoration:underline;}
.gf-consentapplied{margin-top:10px;font-size:12.5px;font-weight:600;color:var(--pasture);}
.gf-consentnote{font-size:11.5px;color:var(--ink2);margin:10px 0 0;padding-top:10px;
  border-top:1px dashed #d7e6ef;line-height:1.45;font-style:italic;}

/* seasonal */
.gf-season{max-width:1080px;margin:18px auto 0;}
.gf-sub-flush{margin-top:0;padding-top:0;border-top:none;}
.gf-seasonhead{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;
  flex-wrap:wrap;margin-bottom:14px;}
.gf-seasonlede{max-width:520px;margin:8px 0 0;font-size:14px;color:var(--ink2);}
.gf-peakcard{background:var(--ink);color:#f4f6ef;border-radius:12px;padding:12px 18px;text-align:center;flex:none;}
.gf-peakmonth{font-family:'Space Grotesk';font-weight:700;font-size:26px;letter-spacing:-.02em;color:var(--flare);}
.gf-peaklbl{font-size:11px;color:#aeb9ac;margin-top:2px;}

.gf-chart{margin:6px 0 14px;}
.gf-chartsvg{width:100%;display:block;}
.gf-chartlbl{font-family:'Space Mono';font-size:11px;fill:var(--ink2);}
.gf-chartkey{display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--ink2);margin-top:4px;}
.gf-chartkey span{display:inline-flex;align-items:center;gap:7px;}
.gf-k-bar{width:12px;height:12px;border-radius:3px;background:var(--flare);display:inline-block;}
.gf-k-line{width:16px;height:2px;background:var(--brand-blue);display:inline-block;}

.gf-seasonstats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0 4px;}
@media(max-width:560px){.gf-seasonstats{grid-template-columns:1fr;}}
.gf-sstat{background:var(--paper);border-radius:11px;padding:14px;display:flex;flex-direction:column;gap:4px;}
.gf-sstatval{font-family:'Space Mono';font-weight:700;font-size:24px;letter-spacing:-.02em;color:var(--flare-deep);}
.gf-sstatlbl{font-size:12.5px;color:var(--ink2);line-height:1.35;}
.gf-seasontip{font-size:13px;color:var(--ink2);margin:14px 0 0;padding-top:13px;border-top:1px dashed var(--line);}

.gf-advdiv{grid-column:1/-1;font-family:'Space Grotesk';font-weight:600;font-size:11px;
  text-transform:uppercase;letter-spacing:.13em;color:var(--flare-deep);
  border-top:1px solid var(--line);padding-top:12px;margin-top:2px;}
.gf-select{font-family:inherit;font-size:14px;padding:7px 10px;border:1.5px solid var(--line);
  border-radius:9px;background:#fff;color:var(--ink);width:100%;}
.gf-select:focus{outline:none;border-color:var(--flare);}

/* method */
.gf-method{max-width:1080px;margin:18px auto 0;}
.gf-methbody{margin-top:14px;font-size:13.5px;color:var(--ink2);}
.gf-eq{font-family:'Space Mono';font-weight:700;font-size:14px;color:var(--ink);
  background:var(--paper);padding:13px 15px;border-radius:10px;margin:0 0 14px;overflow-x:auto;}
.gf-meth-list{margin:12px 0;padding-left:18px;}
.gf-meth-list li{margin-bottom:6px;}
.gf-meth-list strong{color:var(--ink);font-family:'Space Mono';font-size:12.5px;}
.gf-disc{font-size:12px;font-style:italic;border-top:1px solid var(--line);padding-top:12px;margin-top:12px;}

.gf-foot{max-width:1080px;margin:20px auto 0;font-size:11.5px;color:var(--ink2);
  text-align:center;letter-spacing:.02em;}
`;
