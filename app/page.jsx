"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatForexNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("fx-fonts")) return;
    const link = document.createElement("link");
    link.id = "fx-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const BADGE_COLORS = {
  fx:     { bg: "rgba(77,159,255,0.10)",  ring: "rgba(77,159,255,0.25)",  text: "#6aabff" },
  gold:   { bg: "rgba(251,191,36,0.10)",  ring: "rgba(251,191,36,0.25)",  text: "#fbbf24" },
  silver: { bg: "rgba(148,163,184,0.10)", ring: "rgba(148,163,184,0.25)", text: "#a0aec0" },
  crypto: { bg: "rgba(0,212,160,0.10)",   ring: "rgba(0,212,160,0.25)",   text: "#00d4a0" },
};

function Badge({ label, type = "fx", compact = false }) {
  const c = BADGE_COLORS[type];
  const size = compact ? 28 : 34;
  const fs = compact ? 8 : 9.5;
  return (
    <div style={{
      width: size, height: size, borderRadius: compact ? 7 : 9,
      background: c.bg, border: `1px solid ${c.ring}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono', monospace", fontSize: fs, fontWeight: 500,
      color: c.text, flexShrink: 0, letterSpacing: "0.04em",
    }}>
      {label}
    </div>
  );
}

function MarketRow({ badge, title, subtitle, sell, buy, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const px = compact ? 8 : 12;
  const numFs = compact ? 11 : 13;
  const labelFs = compact ? 8 : 9;
  const titleFs = compact ? 11 : 13;
  const subFs = compact ? 10 : 11;
  const pr = compact ? 8 : 12;
  const pl = compact ? 8 : 12;
  const gap = compact ? 6 : 10;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `7px ${px}px`, borderRadius: 10,
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background 0.12s ease", cursor: "default", gap,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap, minWidth: 0, flex: 1 }}>
        {badge}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: titleFs, fontWeight: 500, color: "#dde0ea", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: subFs, color: "#6b6b85", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subtitle}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ textAlign: "right", paddingRight: pr }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: numFs, fontWeight: 500, color: "#7eb8ff", letterSpacing: "-0.02em" }}>{buy}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: labelFs, color: "#6b6b85", letterSpacing: "0.1em" }}>BUY</div>
        </div>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.07)" }} />
        <div style={{ textAlign: "right", paddingLeft: pl }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: numFs, fontWeight: 500, color: "#00d4a0", letterSpacing: "-0.02em" }}>{sell}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: labelFs, color: "#6b6b85", letterSpacing: "0.1em" }}>SELL</div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, count, rightLabel, children, empty }) {
  return (
    <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{icon}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8888a8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {title}
          </span>
          {count != null && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#6b6b85", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, padding: "1px 5px" }}>
              {count}
            </span>
          )}
        </div>
        {rightLabel && (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#6b6b85", letterSpacing: "0.06em" }}>
            {rightLabel}
          </span>
        )}
      </div>
      <div style={{ padding: "4px 0 5px" }}>
        {empty ? (
          <div style={{ padding: "20px", textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#44445a" }}>
            No data available
          </div>
        ) : children}
      </div>
    </div>
  );
}

// ─── Forex: 2-column on wide, 1-column on small ───────────────────────────────

function ForexSection({ currencies, isMobile, isTiny }) {
  return (
    <Section icon="↗" title="Forex" count={currencies.length} rightLabel="vs TRY" empty={!currencies.length}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 0 }}>
        {currencies.map((row) => (
          <MarketRow
            key={row.code}
            compact={isTiny}
            badge={<Badge label={row.code.slice(0, 3)} type="fx" compact={isTiny} />}
            title={`${row.code}/TRY`}
            subtitle={row.name}
            sell={formatForexNumber(row.sell)}
            buy={formatForexNumber(row.buy)}
          />
        ))}
      </div>
    </Section>
  );
}

// ─── Metals: silver full-width, gold 2-column on wide / 1-column on small ────

function MetalsSection({ goldItems, silverItem, isMobile, isTiny }) {
  const totalCount = goldItems.length + (silverItem ? 1 : 0);
  return (
    <Section icon="◈" title="Metals" count={totalCount} rightLabel="Local currency" empty={!goldItems.length && !silverItem}>
      {silverItem && (
        <MarketRow
          compact={isTiny}
          badge={<Badge label="AG" type="silver" compact={isTiny} />}
          title="XAG/TRY"
          subtitle="Silver spot"
          sell={silverItem.selling != null ? formatNumber(silverItem.selling) : "—"}
          buy={silverItem.buying != null ? formatNumber(silverItem.buying) : "—"}
        />
      )}
      {goldItems.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 0 }}>
          {goldItems.map((item) => (
            <MarketRow
              key={item.name}
              compact={isTiny}
              badge={<Badge label={(item.name || "AU").slice(0, 2).toUpperCase()} type="gold" compact={isTiny} />}
              title={item.name}
              subtitle="Precious metal"
              sell={item.sell != null ? formatNumber(item.sell) : "—"}
              buy={item.buy != null ? formatNumber(item.buy) : "—"}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

// ─── Crypto ───────────────────────────────────────────────────────────────────

function CryptoSection({ items, isTiny }) {
  return (
    <Section icon="⬡" title="Crypto" count={items.length} rightLabel="USD" empty={!items.length}>
      {items.map((item) => (
        <MarketRow
          key={item.code}
          compact={isTiny}
          badge={<Badge label={(item.code || "CR").slice(0, 2).toUpperCase()} type="crypto" compact={isTiny} />}
          title={`${item.code}/USD`}
          subtitle={item.name}
          sell={formatNumber(item.sell)}
          buy={formatNumber(item.buy)}
        />
      ))}
    </Section>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ["All", "Forex", "Metals", "Crypto"];

function Tabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 11, padding: 3, width: "fit-content" }}>
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button key={tab} type="button" onClick={() => onChange(tab)} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: isActive ? 600 : 400,
            color: isActive ? "#e8e8f0" : "#7a7a96",
            background: isActive ? "rgba(255,255,255,0.09)" : "transparent",
            border: isActive ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent",
            borderRadius: 8, padding: "4px 13px", cursor: "pointer", transition: "all 0.12s ease",
          }}>
            {tab}
          </button>
        );
      })}
    </div>
  );
}

// ─── Contact Bar ──────────────────────────────────────────────────────────────

function ContactBar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#4b5563", marginBottom: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a
          href="https://wa.me/905315919450"
          style={{ color: "#6b7280", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp: +90 531 591 94 50
        </a>
        <a
          href="https://t.me/Arzino_Sarrafi"
          style={{ color: "#6b7280", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
        >
          Telegram: @ArzinoExchange
        </a>
        <a
          href="https://chat.whatsapp.com/Lsbuls2dRoE8gJDuxdMhu7?mode=gi_t"
          style={{ color: "#6b7280", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Group: arzino
        </a>
      </div>
      <div style={{ color: "#6b7280" }}>
        Address: Beşyol, Çimen Sk, küçükçekmece/İstanbul
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  useFonts();

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 600;
  const isTiny = windowWidth < 390;

  const [board, setBoard] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const fetchBoard = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/board`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setBoard(await res.json());
      setStatus("loaded");
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach backend. Is the server running?");
    }
  }, []);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const currencies  = board?.currencies ?? [];
  const goldItems   = board?.gold       ?? [];
  const silverItem  = board?.silver     ?? null;
  const cryptoItems = board?.crypto     ?? [];

  const lastUpdated = board?.lastUpdate
    ? new Date(board.lastUpdate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const show = (tab) => activeTab === "All" || activeTab === tab;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b0e", display: "flex", justifyContent: "center", padding: "36px 16px 60px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 780 }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, overflow: "hidden", background: "radial-gradient(circle at 0 0, #00d4a0, #1f2937)" }}>
            <Image
              src="/arzino.jpg"
              alt="Arzino logo"
              width={32}
              height={32}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f9fafb" }}>
              ARZINO
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#4b5563", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Currency & Crypto Exchange
            </div>
          </div>
        </div>

        {/* Contacts — moved to top */}
        <ContactBar />

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#00d4a0", letterSpacing: "0.18em", textTransform: "uppercase" }}>● Live</span>
          
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Tabs active={activeTab} onChange={setActiveTab} />
          
          {/* <button type="button" onClick={fetchBoard} disabled={status === "loading"} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
            color: status === "loading" ? "#44445a" : "#7a7a96",
            background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "4px 11px",
            cursor: status === "loading" ? "default" : "pointer", transition: "all 0.12s ease",
          }}>
            {status === "loading" ? "Loading…" : "↻ Refresh"}
          </button> */}
          
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {show("Forex")  && <ForexSection  currencies={currencies} isMobile={isMobile} isTiny={isTiny} />}
          {show("Metals") && <MetalsSection goldItems={goldItems} silverItem={silverItem} isMobile={isMobile} isTiny={isTiny} />}
          {show("Crypto") && <CryptoSection items={cryptoItems} isTiny={isTiny} />}
        </div>

        {status === "error" && (
          <div style={{ marginTop: 12, padding: "9px 13px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 11, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#f87171" }}>
            {errorMessage}
          </div>
        )}

        
      </div>
    </div>
  );
}