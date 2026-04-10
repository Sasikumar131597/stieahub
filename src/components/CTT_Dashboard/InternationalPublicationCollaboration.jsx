import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import geoData from "./in_countries.min.geojson";
import { useParams } from "react-router-dom";

/* ─── Theme tokens ──────────────────────────────────────────── */
const T = {
  bg:              "#f5f6fa",
  surface:         "#ffffff",
  border:          "rgba(0,0,0,0.08)",
  borderBright:    "rgba(82,108,255,0.35)",
  accent:          "#526CFF",
  accentGlow:      "rgba(82,108,255,0.25)",
  text:            "#1a1d2e",
  muted:           "#8a8fa8",
  dim:             "#d0d3e0",
  red:             "#e53e3e",
  mapIdle:         "#2a3152",
  mapHover:        "#3f4a7a",
  mapActive:       "#526CFF",
  mapStroke:       "rgba(100,120,220,0.4)",
  mapStrokeActive: "rgba(82,108,255,0.9)",
  mapStrokeHover:  "rgba(100,120,220,0.75)",
};

/* ─── Color system — zero repeats across both sides ─────────
 *
 * India source node is always SAFFRON (#FF9933).
 * Every other country gets a unique color from a 24-color
 * perceptually-distinct palette.  SOURCE_COLORS covers known
 * left-side countries; PARTNER_BASE covers known right-side
 * countries.  At runtime, buildColorMap() merges the two sets,
 * detects whatever partners actually appear in the API response,
 * and assigns remaining palette slots in order — guaranteeing
 * no color is ever shared between a source and any partner.
 * ─────────────────────────────────────────────────────────── */

// 24 perceptually-distinct colors (no two look alike, no saffron)
const UNIQUE_PALETTE = [
  "#5B8AF5", // blue-indigo
  "#2DC653", // vivid green
  "#C9A227", // amber-gold
  "#7B5EA7", // medium purple
  "#F4845F", // coral-salmon
  "#E84393", // hot pink
  "#3DB380", // jade teal
  "#D4781E", // burnt orange
  "#60C4D6", // sky cyan
  "#A259FF", // violet
  "#E63946", // crimson red
  "#1A936F", // emerald
  "#F7B731", // sunflower
  "#C44569", // deep rose
  "#2C7BB6", // ocean blue
  "#8BC34A", // lime green
  "#FF6B6B", // light red
  "#26A69A", // seafoam
  "#9C27B0", // deep purple
  "#FF8A65", // peach orange
  "#42A5F5", // light blue
  "#66BB6A", // soft green
  "#EF5350", // soft red
  "#AB47BC", // orchid
];

const SAFFRON = "#FF9933";

// Known source-country → color assignments (India always saffron)
const SOURCE_COLORS = {
  "India":       SAFFRON,
  "Germany":     UNIQUE_PALETTE[1],   // vivid green
  "China":       UNIQUE_PALETTE[10],  // crimson
  "Canada":      UNIQUE_PALETTE[3],   // purple
  "France":      UNIQUE_PALETTE[8],   // sky cyan
  "UK":          UNIQUE_PALETTE[2],   // amber-gold
  "Japan":       UNIQUE_PALETTE[4],   // coral-salmon
  "Australia":   UNIQUE_PALETTE[5],   // hot pink
  "USA":         UNIQUE_PALETTE[0],   // blue-indigo
  "Italy":       UNIQUE_PALETTE[6],   // jade teal
  "Switzerland": UNIQUE_PALETTE[7],   // burnt orange
  "South Korea": UNIQUE_PALETTE[11],  // emerald
  "Brazil":      UNIQUE_PALETTE[12],  // sunflower
  "Spain":       UNIQUE_PALETTE[13],  // deep rose
  "Russia":      UNIQUE_PALETTE[14],  // ocean blue
};

// Known partner-country → color assignments
// These must NOT overlap with any SOURCE_COLORS value
const PARTNER_BASE = {
  "USA":          UNIQUE_PALETTE[0],   // blue-indigo
  "Germany":      UNIQUE_PALETTE[1],   // vivid green
  "UK":           UNIQUE_PALETTE[2],   // amber-gold
  "Canada":       UNIQUE_PALETTE[3],   // purple
  "Japan":        UNIQUE_PALETTE[4],   // coral-salmon
  "Australia":    UNIQUE_PALETTE[5],   // hot pink
  "Italy":        UNIQUE_PALETTE[6],   // jade teal
  "Switzerland":  UNIQUE_PALETTE[7],   // burnt orange
  "France":       UNIQUE_PALETTE[8],   // sky cyan
  "China":        UNIQUE_PALETTE[10],  // crimson
  "South Korea":  UNIQUE_PALETTE[11],  // emerald
  "Spain":        UNIQUE_PALETTE[13],  // deep rose
  "Russia":       UNIQUE_PALETTE[14],  // ocean blue
  "Netherlands":  UNIQUE_PALETTE[15],  // lime green
  "Poland":       UNIQUE_PALETTE[16],  // light red
  "Singapore":    UNIQUE_PALETTE[17],  // seafoam
  "Austria":      UNIQUE_PALETTE[18],  // deep purple
  "Saudi Arabia": UNIQUE_PALETTE[19],  // peach orange
  "Sweden":       UNIQUE_PALETTE[20],  // light blue
  "Brazil":       UNIQUE_PALETTE[12],  // sunflower
  "India":        SAFFRON,
};

/**
 * At render time, call this with the selected source country name
 * and the list of partner names actually returned by the API.
 * Returns a map of { partnerName -> hexColor } with no repeats
 * against the source color or against each other.
 */
function buildPartnerColorMap(sourceCountry, partnerNames) {
  const usedColors = new Set(Object.values(SOURCE_COLORS));
  // If the source is India, saffron is taken
  usedColors.add(SAFFRON);

  const result = {};
  // Slots from UNIQUE_PALETTE not yet used by any source color
  const available = UNIQUE_PALETTE.filter((c) => !usedColors.has(c));
  let fallbackIdx = 0;

  partnerNames.forEach((name) => {
    if (PARTNER_BASE[name] && !usedColors.has(PARTNER_BASE[name])) {
      result[name] = PARTNER_BASE[name];
      usedColors.add(PARTNER_BASE[name]);
    } else {
      // Find next available slot
      while (fallbackIdx < available.length && usedColors.has(available[fallbackIdx])) {
        fallbackIdx++;
      }
      const color = available[fallbackIdx] || "#888888";
      result[name] = color;
      usedColors.add(color);
      fallbackIdx++;
    }
  });

  return result;
}

/* ─── Country name normalisation ───────────────────────────── */
const COUNTRY_NAME_MAP = {
  "United States of America": "USA", "United States": "USA", "USA": "USA",
  "United Kingdom": "UK", "UK": "UK", "Great Britain": "UK", "England": "UK",
  "Russia": "Russia", "South Korea": "South Korea",
  "Czechia": "Czech Republic", "Türkiye": "Turkey", "Viet Nam": "Vietnam",
  "Iran": "Iran", "Syria": "Syrian Arab Republic",
  "Venezuela": "Venezuela (Bolivarian Republic of)",
  "Bolivia": "Bolivia (Plurinational State of)",
  "Tanzania": "United Republic of Tanzania",
  "Moldova": "Republic of Moldova",
  "North Korea": "North Korea",
  "Laos": "Lao People's Democratic Republic",
  "Congo (Kinshasa)": "Democratic Republic of the Congo",
  "Congo (Brazzaville)": "Republic of the Congo",
};

const normalizeCountryName = (name) => {
  if (!name) return "Unknown";
  return COUNTRY_NAME_MAP[name] || name;
};

/* ─── CSS ───────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.ipc *{box-sizing:border-box}

.ipc{
  font-family:'Inter',sans-serif;
  background:${T.bg};
  color:${T.text};
  min-height:100vh;
  position:relative;
  overflow:hidden;
}

.ipc-hdr{
  position:relative;z-index:10;
  padding:20px 28px 16px;
  display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;
  border-bottom:1px solid ${T.border};
  background:#ffffff;
  box-shadow:0 1px 4px rgba(0,0,0,0.06);
}
.ipc-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:${T.muted};
  display:flex;align-items:center;gap:8px;
  margin-bottom:5px;
}
.ipc-eyebrow::before{
  content:'';display:block;width:16px;height:1px;background:${T.accent};
}
.ipc-title{
  font-size:17px;font-weight:700;
  color:${T.text};
  letter-spacing:-.02em;
  margin:0;
}
.ipc-desc{
  font-size:12px;color:${T.muted};margin-top:4px;
}

.ipc-stat{
  display:flex;align-items:center;gap:16px;
  background:#f8f9fd;
  border:1px solid ${T.border};border-radius:12px;
  padding:10px 18px;
  animation:fadeIn .4s ease both;
}
.ipc-stat-lbl{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;letter-spacing:.14em;color:${T.muted};text-transform:uppercase;
  margin-bottom:2px;
}
.ipc-stat-val{
  font-size:20px;font-weight:700;color:${T.text};
  font-variant-numeric:tabular-nums;
}
.ipc-stat-country{
  font-size:13px;font-weight:600;color:${T.text};
  padding:2px 0;
}

.ipc-map{
  position:relative;z-index:5;
  background:#ffffff;
  height:680px;
  overflow:hidden;
  border-bottom:1px solid ${T.border};
}

.ipc-tip{
  position:fixed;z-index:9999;pointer-events:none;
  background:${T.text};
  border-radius:8px;padding:6px 12px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;color:#ffffff;
  box-shadow:0 4px 20px rgba(0,0,0,0.25);
  display:flex;align-items:center;gap:8px;
  transition:opacity .1s;
}
.ipc-tip-dot{
  width:6px;height:6px;border-radius:50%;
  background:#4fffff;flex-shrink:0;
}

.ipc-loader{
  position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
  z-index:30;
  background:#fff;
  border:1px solid ${T.border};border-radius:100px;
  padding:9px 22px;
  display:flex;align-items:center;gap:10px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;color:${T.accent};
  animation:fadeIn .3s ease both;
  white-space:nowrap;
  box-shadow:0 4px 16px rgba(0,0,0,0.1);
}
.ipc-spinner{
  width:13px;height:13px;
  border:2px solid rgba(82,108,255,.2);
  border-top-color:${T.accent};
  border-radius:50%;
  animation:spin .65s linear infinite;
}

.ipc-hint{
  position:absolute;bottom:24px;left:50%;transform:translateX(-50%);
  z-index:15;pointer-events:none;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:${T.muted};
  background:#fff;
  border:1px solid ${T.border};border-radius:100px;
  padding:7px 18px;
  display:flex;align-items:center;gap:8px;
  white-space:nowrap;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);
}
.ipc-hint-blink{
  width:5px;height:5px;border-radius:50%;background:${T.accent};
  animation:blink 2s ease-in-out infinite;
}

.ipc-overlay-backdrop{
  position:absolute;
  inset:0;
  background:rgba(10,12,30,0.45);
  backdrop-filter:blur(4px);
  z-index:40;
  animation:fadeBackdrop .3s ease both;
}

.ipc-overlay{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:min(960px,95%);
  z-index:50;
  animation:popIn .38s cubic-bezier(.22,1,.36,1) both;
}

.ipc-overlay-box{
  background:#ffffff;
  border:1px solid ${T.borderBright};
  border-radius:18px;
  overflow:hidden;
  box-shadow:
    0 0 0 1px rgba(82,108,255,0.06),
    0 8px 40px rgba(82,108,255,0.14),
    0 28px 70px rgba(0,0,0,0.5);
}

.ipc-ov-hdr{
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
  padding:14px 22px;
  border-bottom:1px solid ${T.border};
  background:#fafbff;
}
.ipc-ov-left{display:flex;align-items:center;gap:12px;}
.ipc-ov-indicator{
  width:9px;height:9px;border-radius:50%;
  background:${T.accent};
  box-shadow:0 0 0 3px ${T.accentGlow};
  flex-shrink:0;
}
.ipc-ov-name{font-size:15px;font-weight:700;color:${T.text};letter-spacing:-.01em;}
.ipc-ov-sub{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:${T.muted};margin-top:2px;
}
.ipc-ov-right{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.ipc-total-wrap{text-align:right;}
.ipc-total-lbl{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;letter-spacing:.14em;color:${T.muted};text-transform:uppercase;
  margin-bottom:2px;
}
.ipc-total-num{
  font-size:19px;font-weight:700;color:${T.text};
  font-variant-numeric:tabular-nums;
}
.ipc-close{
  font-size:11px;color:${T.text};
  background:transparent;
  border:1px solid ${T.border};border-radius:8px;
  padding:7px 16px;cursor:pointer;
  transition:all .2s;
  line-height:1;font-family:'JetBrains Mono',monospace;
}
.ipc-close:hover{background:${T.text};color:#fff;}

.ipc-sankey-wrap{
  padding:6px 8px 4px;
  background:#ffffff;
}

.ipc-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:50px 20px;gap:10px;
  font-family:'JetBrains Mono',monospace;font-size:11px;color:${T.dim};text-align:center;
}
.ipc-empty-icon{font-size:24px;opacity:.3;margin-bottom:4px;}
.ipc-err{
  font-family:'JetBrains Mono',monospace;font-size:11px;color:${T.red};
  background:rgba(229,62,62,.06);border:1px solid rgba(229,62,62,.2);
  border-radius:8px;padding:10px 16px;margin:14px 20px;
}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes fadeBackdrop{from{opacity:0}to{opacity:1}}
@keyframes popIn{
  from{opacity:0;transform:translate(-50%,-50%) scale(0.93)}
  to  {opacity:1;transform:translate(-50%,-50%) scale(1)}
}
`;

function useInjectCSS() {
  useEffect(() => {
    if (document.getElementById("ipc-css")) return;
    const el = document.createElement("style");
    el.id = "ipc-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/* ─── Main Component ────────────────────────────────────────── */
export default function InternationalPublicationCollaboration() {
  useInjectCSS();

  const [tooltip, setTooltip]                 = useState({ name: "", x: 0, y: 0 });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [apiData, setApiData]                 = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const { sub_tech_id }                       = useParams();

  const chartRef  = useRef(null);
  const SANKEY_ID = "ipc-sankey-div";

  /* ── Fetch on country click ── */
  const handleCountryClick = async (countryName) => {
    const normalizedName = normalizeCountryName(countryName);
    if (selectedCountry === normalizedName) { closeOverlay(); return; }

    setSelectedCountry(normalizedName);
    setApiData([]);
    setError(null);
    setLoading(true);

    try {
      const res  = await fetch(
        `https://development.stieahub.in/Codigniter_api/public/publication_international_collaboration_top_20_countries/${sub_tech_id}`
      );
      const data = await res.json();

      const filtered = data
        .filter((d) => normalizeCountryName(d.parent_country_name) === normalizedName)
        .sort((a, b) => Number(b.co_publications) - Number(a.co_publications))
        .slice(0, 10);

      setApiData(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load collaboration data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeOverlay = () => {
    setSelectedCountry(null);
    setApiData([]);
    setError(null);
  };

  /* ── Build Sankey chart ── */
  useEffect(() => {
    if (!apiData.length) return;
    if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null; }

    const timer = setTimeout(() => {
      const el = document.getElementById(SANKEY_ID);
      if (!el) return;

      const root = am5.Root.new(SANKEY_ID);
      root._logo?.dispose();
      root.setThemes([am5themes_Animated.new(root)]);

      /* ── Resolve source color (India → saffron, others → unique slot) ── */
      const srcHex     = SOURCE_COLORS[selectedCountry] || UNIQUE_PALETTE[0];

      /* ── Build partner color map — guaranteed zero repeats ── */
      const partnerNames    = apiData.map((d) => normalizeCountryName(d.collaboration_country_name));
      const partnerColorHex = buildPartnerColorMap(selectedCountry, partnerNames);

      /* ── Sankey series ── */
      const series = root.container.children.push(
        am5flow.Sankey.new(root, {
          sourceIdField:  "from",
          targetIdField:  "to",
          valueField:     "value",
          paddingRight:   200,
          paddingLeft:    50,
          paddingTop:     20,
          paddingBottom:  20,
          nodePadding:    20,
          nodeWidth:      20,
          linkTension:    0.58,
        })
      );

      series.set("sequencedInterpolation", false);

      /* ── Build value-per-destination lookup ── */
      const destValueMap = {};
      apiData.forEach((item) => {
        const name = normalizeCountryName(item.collaboration_country_name);
        destValueMap[name] = (destValueMap[name] || 0) + Number(item.co_publications);
      });

      /* ── Node rectangles ── */
      series.nodes.rectangles.template.setAll({
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        cornerRadiusBL: 6,
        cornerRadiusBR: 6,
        fillOpacity:    1,
        strokeWidth:    0,
      });

      /* Node color comes from the data colorField — no adapters needed */
      series.nodes.set("colorField", "nodeColor");

      /* ── Node labels ── */
      series.nodes.labels.template.setAll({
        fontFamily:        "'Inter', sans-serif",
        fontSize:          12,
        fontWeight:        "500",
        fill:              am5.color(0x1a1d2e),
        oversizedBehavior: "none",
        truncate:          "none",
        dx:                12,
      });

      /* Destination nodes: append "(N co-publications)" */
      series.nodes.labels.template.adapters.add("text", (text, target) => {
        const ctx  = target.dataItem?.dataContext;
        const name = ctx?.name || ctx?.id;
        if (!name) return text;
        if (name === selectedCountry) return name;
        const val = destValueMap[name];
        return val != null
          ? `${name} (${Number(val).toLocaleString()})`
          : name;
      });

      /* ── Links — true gradient: source color → destination color ── */
      series.links.template.setAll({
        fillOpacity:   0.6,
        strokeOpacity: 0,
        interactive:   true,
        /* autoGradient reads the node fill set via colorField */
        autoGradient:  true,
      });

      series.links.template.states.create("hover", { fillOpacity: 0.85 });

      /* ── Tooltip ── */
      series.links.template.set(
        "tooltipText",
        "{from} → {to}: [bold]{value}[/] co-publications"
      );

      // 🔵 Make tooltip BLUE
      series.links.template.set("tooltip", am5.Tooltip.new(root, {
        getFillFromSprite: false
      }));

      // Background color → BLUE
      series.links.template.get("tooltip").get("background").setAll({
        fill: am5.color(0x007BFF) // blue
      });

      // Text color → WHITE
      series.links.template.get("tooltip").label.setAll({
        fill: am5.color(0xffffff)
      });

      /* ── Inline value labels on each ribbon ── */
      series.events.once("datavalidated", () => {
        setTimeout(() => {
          series.dataItems.forEach((dataItem) => {
            try {
              const link  = dataItem.get("link");
              const value = dataItem.get("value");
              if (!link || value == null) return;
              const bounds = link?._display?.getBounds?.();
              if (!bounds) return;
              root.container.children.push(
                am5.Label.new(root, {
                  text:          Number(value).toLocaleString(),
                  fontSize:      10,
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontWeight:    "600",
                  fill:          am5.color(0x1a1d2e),
                  centerX:       am5.p50,
                  centerY:       am5.p50,
                  x:             (bounds.left + bounds.right)  / 2,
                  y:             (bounds.top  + bounds.bottom) / 2,
                  paddingLeft:   4,
                  paddingRight:  4,
                  paddingTop:    2,
                  paddingBottom: 2,
                  background: am5.RoundedRectangle.new(root, {
                    fill:          am5.color(0xffffff),
                    fillOpacity:   0.85,
                    cornerRadiusTL:3,
                    cornerRadiusTR:3,
                    cornerRadiusBL:3,
                    cornerRadiusBR:3,
                  }),
                })
              );
            } catch (_e) { /* skip */ }
          });
        }, 1200);
      });

      /* ── Chart data — node colors embedded so autoGradient can read them ── */
      const chartData = apiData.map((item) => ({
        from:  normalizeCountryName(item.parent_country_name),
        to:    normalizeCountryName(item.collaboration_country_name),
        value: Number(item.co_publications),
      }));

      /* Node color data: one entry per unique node, with nodeColor field */
      const allNodeNames = [
        selectedCountry,
        ...partnerNames,
      ];
      const nodeColorData = allNodeNames.map((name) => ({
        id:        name,
        nodeColor: name === selectedCountry
          ? srcHex
          : (partnerColorHex[name] || "#888888"),
      }));

      series.nodes.data.setAll(nodeColorData);
      series.data.setAll(chartData);
      chartRef.current = root;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null; }
    };
  }, [apiData, selectedCountry]);

  /* ── Derived state ── */
  const total          = apiData.reduce((s, d) => s + Number(d.co_publications), 0);
  const showOverlay    = selectedCountry && !loading && (apiData.length > 0 || error);
  const srcHexForStat  = selectedCountry ? (SOURCE_COLORS[selectedCountry] || UNIQUE_PALETTE[0]) : T.accent;


  return (
    <div className="ipc">
      {/* ── Header ── */}
      <header className="ipc-hdr">
        <div>
          <div className="ipc-eyebrow">Research Analytics</div>
          <h1 className="ipc-title">International Publication Collaboration</h1>
          <p className="ipc-desc">Click any country on the map to view its collaboration flow</p>
        </div>

        {selectedCountry && !loading && (
          <div className="ipc-stat" key={selectedCountry}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: srcHexForStat, flexShrink: 0,
              boxShadow: `0 0 0 3px ${srcHexForStat}33`,
            }} />
            <div>
              <div className="ipc-stat-lbl">Selected Country</div>
              <div className="ipc-stat-country">{selectedCountry}</div>
            </div>
            <div style={{ width: 1, height: 34, background: T.border, flexShrink: 0 }} />
            <div>
              <div className="ipc-stat-lbl">Total Co-Publications</div>
              <div className="ipc-stat-val">{total.toLocaleString()}</div>
            </div>
          </div>
        )}
      </header>

      {/* ── Tooltip ── */}
      {tooltip.name && (
        <div className="ipc-tip" style={{ top: tooltip.y + 14, left: tooltip.x + 14 }}>
          <span className="ipc-tip-dot" />
          {normalizeCountryName(tooltip.name)}
        </div>
      )}

      {/* ── Map ── */}
      <div className="ipc-map">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 145, center: [0, 20] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rawName  = geo.properties.ADMIN || geo.properties.name || "Unknown";
                const name     = normalizeCountryName(rawName);
                const isActive = selectedCountry === name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => setTooltip({ name: rawName, x: e.clientX, y: e.clientY })}
                    onMouseMove={(e)  => setTooltip((p) => ({ ...p, x: e.clientX, y: e.clientY }))}
                    onMouseLeave={() => setTooltip({ name: "", x: 0, y: 0 })}
                    onClick={() => handleCountryClick(rawName)}
                    style={{
                      default: {
                        fill:        isActive ? T.mapActive : T.mapIdle,
                        stroke:      isActive ? T.mapStrokeActive : T.mapStroke,
                        strokeWidth: isActive ? 1.2 : 0.6,
                        outline:     "none",
                        transition:  "fill .18s",
                      },
                      hover: {
                        fill:        T.mapHover,
                        stroke:      T.mapStrokeHover,
                        strokeWidth: 0.9,
                        outline:     "none",
                        cursor:      "pointer",
                      },
                      pressed: {
                        fill:        T.mapActive,
                        stroke:      T.mapStrokeActive,
                        strokeWidth: 1.2,
                        outline:     "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Loading */}
        {loading && (
          <div className="ipc-loader">
            <div className="ipc-spinner" />
            Loading collaborations for <strong style={{ color: T.text }}>{selectedCountry}</strong>…
          </div>
        )}

        {/* Hint */}
        {!selectedCountry && !loading && (
          <div className="ipc-hint">
            <span className="ipc-hint-blink" />
            Click any country to view collaboration flows
          </div>
        )}

        {/* ── SANKEY OVERLAY ── */}
        {showOverlay && (
          <>
            <div className="ipc-overlay-backdrop" onClick={closeOverlay} />
            <div className="ipc-overlay">
              <div className="ipc-overlay-box">

                {/* Header */}
                <div className="ipc-ov-hdr">
                  <div className="ipc-ov-left">
                    <div
                      className="ipc-ov-indicator"
                      style={{
                        background: srcHexForStat,
                        boxShadow: `0 0 0 3px ${srcHexForStat}33`,
                      }}
                    />
                    <div>
                      <div className="ipc-ov-name">{selectedCountry}</div>
                      <div className="ipc-ov-sub">
                        Top {apiData.length} collaboration partners 
                      </div>
                    </div>
                  </div>
                  <div className="ipc-ov-right">
                    {total > 0 && (
                      <div className="ipc-total-wrap">
                        <div className="ipc-total-lbl">Total Co-Publications</div>
                        <div className="ipc-total-num">{total.toLocaleString()}</div>
                      </div>
                    )}
                    <button className="ipc-close" onClick={closeOverlay}>✕ Close</button>
                  </div>
                </div>

                {error ? (
                  <div className="ipc-err">⚠ {error}</div>
                ) : apiData.length === 0 ? (
                  <div className="ipc-empty">
                    <div className="ipc-empty-icon">◎</div>
                    No collaboration data found for {selectedCountry}
                  </div>
                ) : (
                  <>
                    {/* Sankey chart */}
                    <div className="ipc-sankey-wrap">
                      <div
                        id={SANKEY_ID}
                        style={{ width: "100%", height: 500, background: "#ffffff" }}
                      />
                    </div>


                  </>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}