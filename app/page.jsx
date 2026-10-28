"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Number formatting utilities
function formatNumber(value, decimals = 2) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatForexNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function calculateSpread(buy, sell) {
  if (typeof buy !== "number" || typeof sell !== "number") return null;
  return Math.abs(sell - buy);
}

// Window resize hook
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

// Badge Theme Palette
const BADGE_THEMES = {
  fx: {
    bg: "linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.05) 100%)",
    border: "rgba(56,189,248,0.30)",
    text: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
  },
  gold: {
    bg: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.06) 100%)",
    border: "rgba(245,158,11,0.32)",
    text: "#fbbf24",
    glow: "rgba(245,158,11,0.15)",
  },
  silver: {
    bg: "linear-gradient(135deg, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0.06) 100%)",
    border: "rgba(148,163,184,0.30)",
    text: "#cbd5e1",
    glow: "rgba(148,163,184,0.15)",
  },
  crypto: {
    bg: "linear-gradient(135deg, rgba(0,212,160,0.18) 0%, rgba(0,212,160,0.06) 100%)",
    border: "rgba(0,212,160,0.30)",
    text: "#00d4a0",
    glow: "rgba(0,212,160,0.15)",
  },
};

function AssetBadge({ label, type = "fx", compact = false }) {
  const theme = BADGE_THEMES[type] || BADGE_THEMES.fx;
  const size = compact ? 30 : 36;
  const fs = compact ? 9 : 10.5;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: compact ? 8 : 10,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 0 12px ${theme.glow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: fs,
        fontWeight: 600,
        color: theme.text,
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}
      className="tabular-nums"
    >
      {label}
    </div>
  );
}

function MarketRow({
  badge,
  title,
  subtitle,
  buy,
  sell,
  compact = false,
}) {
  const [hovered, setHovered] = useState(false);

  const px = compact ? 10 : 14;
  const numFs = compact ? 12 : 13.5;
  const labelFs = compact ? 8 : 9;
  const titleFs = compact ? 12.5 : 13.5;
  const subFs = compact ? 10.5 : 11.5;
  const gap = compact ? 8 : 12;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `8px ${px}px`,
        borderRadius: 12,
        background: hovered ? "rgba(255,255,255,0.035)" : "transparent",
        border: hovered
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        gap,
        minWidth: 0,
      }}
    >
      {/* Left Symbol & Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap,
          minWidth: 0,
          flex: 1,
        }}
      >
        {badge}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: titleFs,
              fontWeight: 600,
              color: hovered ? "#ffffff" : "#e5e7eb",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "color 0.15s ease",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: subFs,
              color: "#9ca3af",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: 1,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {/* Right Buy & Sell Rates */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          gap: 2,
        }}
      >
        {/* BUY BOX */}
        <div
          style={{
            textAlign: "right",
            padding: "3px 8px",
            borderRadius: 6,
            background: hovered ? "rgba(56,189,248,0.06)" : "transparent",
            transition: "background 0.15s ease",
            minWidth: compact ? 70 : 80,
          }}
        >
          <div
            className="tabular-nums"
            style={{
              fontSize: numFs,
              fontWeight: 600,
              color: "#38bdf8",
              letterSpacing: "-0.02em",
            }}
          >
            {buy}
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: labelFs,
              fontWeight: 500,
              color: "#71717a",
              letterSpacing: "0.12em",
            }}
          >
            BUY
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(255,255,255,0.08)",
            margin: "0 2px",
          }}
        />

        {/* SELL BOX */}
        <div
          style={{
            textAlign: "right",
            padding: "3px 8px",
            borderRadius: 6,
            background: hovered ? "rgba(0,212,160,0.06)" : "transparent",
            transition: "background 0.15s ease",
            minWidth: compact ? 70 : 80,
          }}
        >
          <div
            className="tabular-nums"
            style={{
              fontSize: numFs,
              fontWeight: 600,
              color: "#00d4a0",
              letterSpacing: "-0.02em",
            }}
          >
            {sell}
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: labelFs,
              fontWeight: 500,
              color: "#71717a",
              letterSpacing: "0.12em",
            }}
          >
            SELL
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionContainer({ icon, title, count, rightLabel, children, empty }) {
  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: "#00d4a0",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </span>
          <span
            className="font-brand"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#d1d5db",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
          {count != null && (
            <span
              className="tabular-nums"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#9ca3af",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                padding: "1px 6px",
              }}
            >
              {count}
            </span>
          )}
        </div>
        {rightLabel && (
          <div
            className="tabular-nums"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "#9ca3af",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ opacity: 0.5 }}>Quote:</span>
            <span style={{ color: "#d1d5db", fontWeight: 500 }}>
              {rightLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{ padding: "6px 6px 8px" }}>
        {empty ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              fontSize: 13,
              color: "#9ca3af",
            }}
          >
            No matching items found
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ─── Contact Bar with Interactive Chips ───────────────────────────────────────

function ContactBar() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText("Beşyol, Çimen Sk, küçükçekmece/İstanbul");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/905315919450"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            background: "rgba(37, 211, 102, 0.08)",
            border: "1px solid rgba(37, 211, 102, 0.22)",
            borderRadius: 9999,
            fontSize: 11.5,
            fontWeight: 500,
            color: "#4ade80",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(37, 211, 102, 0.16)";
            e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(37, 211, 102, 0.08)";
            e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.22)";
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>WhatsApp: +90 531 591 94 50</span>
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/Arzino_Sarrafi"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            background: "rgba(56, 189, 248, 0.08)",
            border: "1px solid rgba(56, 189, 248, 0.22)",
            borderRadius: 9999,
            fontSize: 11.5,
            fontWeight: 500,
            color: "#38bdf8",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(56, 189, 248, 0.16)";
            e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(56, 189, 248, 0.08)";
            e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.22)";
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Telegram: @ArzinoExchange</span>
        </a>

        {/* WhatsApp Group */}
        <a
          href="https://chat.whatsapp.com/Lsbuls2dRoE8gJDuxdMhu7?mode=gi_t"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderRadius: 9999,
            fontSize: 11.5,
            fontWeight: 500,
            color: "#9ca3af",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>WhatsApp Group: arzino</span>
        </a>
      </div>

      {/* Address with click to copy */}
      <div
        onClick={handleCopyAddress}
        title="Click to copy address"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11.5,
          color: "#9ca3af",
          cursor: "pointer",
          width: "fit-content",
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#e5e7eb")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00d4a0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Address: Beşyol, Çimen Sk, küçükçekmece/İstanbul</span>
        {copied && (
          <span
            style={{
              fontSize: 10,
              color: "#00d4a0",
              fontWeight: 600,
              marginLeft: 4,
            }}
          >
            ✓ Copied
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Navigation Segmented Tabs ────────────────────────────────────────────────

const TABS = [
  { id: "Forex", label: "Forex", icon: "💱" },
  { id: "Metals", label: "Metals", icon: "🪙" },
  { id: "Crypto", label: "Crypto", icon: "₿" },
  { id: "All", label: "All Markets", icon: "🌐" },
];

function Tabs({ active, onChange, counts, isMobile, isTiny }) {
  return (
    <div
      style={{
        display: isMobile ? "grid" : "flex",
        gridTemplateColumns: isMobile ? "repeat(4, minmax(0, 1fr))" : undefined,
        gap: isMobile ? 3 : 4,
        background: "rgba(14, 17, 24, 0.75)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 14,
        padding: 4,
        width: isMobile ? "100%" : "fit-content",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const count = counts?.[tab.id] ?? null;
        // On mobile, show "All" instead of "All Markets" to save space comfortably
        const label = isMobile && tab.id === "All" ? "All" : tab.label;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isTiny ? 3 : 4,
              fontSize: isTiny ? 11 : isMobile ? 11.5 : 12,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#ffffff" : "#9ca3af",
              background: isActive
                ? "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)"
                : "transparent",
              border: isActive
                ? "1px solid rgba(255,255,255,0.14)"
                : "1px solid transparent",
              boxShadow: isActive
                ? "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "none",
              borderRadius: 10,
              padding: isMobile ? (isTiny ? "6px 2px" : "6px 4px") : "6px 12px",
              cursor: "pointer",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: isTiny ? 11 : 12, flexShrink: 0 }}>
              {tab.icon}
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
            {count != null && (
              <span
                className="tabular-nums"
                style={{
                  fontSize: isTiny ? 9 : 9.5,
                  fontWeight: 600,
                  color: isActive ? "#00d4a0" : "#6b7280",
                  background: isActive
                    ? "rgba(0, 212, 160, 0.12)"
                    : "rgba(255, 255, 255, 0.04)",
                  borderRadius: 9999,
                  padding: isTiny ? "1px 3px" : "1px 4px",
                  lineHeight: 1.1,
                  flexShrink: 0,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 680;
  const isTiny = windowWidth < 400;

  const [board, setBoard] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Forex");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBoard = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/board`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setBoard(data);
      setStatus("loaded");
    } catch {
      setStatus("error");
      setErrorMessage("Could not connect to rates feed. Please check backend connection.");
    }
  }, []);

  useEffect(() => {
    fetchBoard();
    const interval = setInterval(fetchBoard, 30000);
    return () => clearInterval(interval);
  }, [fetchBoard]);

  const rawCurrencies = board?.currencies ?? [];
  const rawGold = board?.gold ?? [];
  const rawSilver = board?.silver ?? null;
  const rawCrypto = board?.crypto ?? [];

  // Filter with search query
  const q = searchQuery.trim().toLowerCase();

  const currencies = useMemo(() => {
    if (!q) return rawCurrencies;
    return rawCurrencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.name && c.name.toLowerCase().includes(q))
    );
  }, [rawCurrencies, q]);

  const goldItems = useMemo(() => {
    if (!q) return rawGold;
    return rawGold.filter((g) => g.name && g.name.toLowerCase().includes(q));
  }, [rawGold, q]);

  const silverItem = useMemo(() => {
    if (!rawSilver) return null;
    if (!q) return rawSilver;
    if ("silver".includes(q) || "gümüş".includes(q) || "xag".includes(q)) {
      return rawSilver;
    }
    return null;
  }, [rawSilver, q]);

  const cryptoItems = useMemo(() => {
    if (!q) return rawCrypto;
    return rawCrypto.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.name && c.name.toLowerCase().includes(q))
    );
  }, [rawCrypto, q]);

  const totalMetalsCount = goldItems.length + (silverItem ? 1 : 0);
  const totalFound =
    currencies.length + totalMetalsCount + cryptoItems.length;

  const counts = {
    Forex: rawCurrencies.length,
    Metals: rawGold.length + (rawSilver ? 1 : 0),
    Crypto: rawCrypto.length,
    All: rawCurrencies.length + rawGold.length + (rawSilver ? 1 : 0) + rawCrypto.length,
  };

  const lastUpdatedFormatted = board?.lastUpdate
    ? new Date(board.lastUpdate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    : null;

  const show = (tab) => activeTab === "All" || activeTab === tab;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? "24px 12px 48px" : "40px 20px 64px",
        position: "relative",
      }}
    >
      {/* Ambient background glows */}
      <div className="ambient-bg" />
      <div className="grid-pattern" />

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Header Card */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 22,
            padding: isMobile ? "16px 18px" : "20px 24px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 14,
            }}
          >
            {/* Brand Logo & Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  overflow: "hidden",
                  background:
                    "radial-gradient(circle at 30% 30%, #00d4a0, #0f172a)",
                  border: "1px solid rgba(0, 212, 160, 0.3)",
                  boxShadow: "0 0 20px rgba(0, 212, 160, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/arzino.jpg"
                  alt="Arzino logo"
                  width={44}
                  height={44}
                  priority
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div>
                <div
                  className="font-brand"
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  ARZINO
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "#9ca3af",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginTop: 1,
                  }}
                >
                  Currency &amp; Precious Metals Exchange
                </div>
              </div>
            </div>

            {/* Live Feed Status & Refresh Action */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Radar Status Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 12px",
                  background: "rgba(0, 212, 160, 0.08)",
                  border: "1px solid rgba(0, 212, 160, 0.25)",
                  borderRadius: 9999,
                }}
              >
                <span className="radar-beacon" />
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#00d4a0",
                    letterSpacing: "0.12em",
                  }}
                >
                  LIVE
                </span>
                {/*{lastUpdatedFormatted && (
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: 10.5,
                      color: "#9ca3af",
                      borderLeft: "1px solid rgba(255,255,255,0.1)",
                      paddingLeft: 6,
                    }}
                  >
                    {lastUpdatedFormatted}
                  </span>
                )}*/}
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchBoard}
                disabled={status === "loading"}
                title="Refresh exchange rates"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  color: status === "loading" ? "#00d4a0" : "#9ca3af",
                  cursor: status === "loading" ? "default" : "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color =
                    status === "loading" ? "#00d4a0" : "#9ca3af";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation:
                      status === "loading"
                        ? "spin 1s linear infinite"
                        : "none",
                  }}
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Contact Chips */}
          <ContactBar />
        </div>

        {/* Search & Navigation Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {/* Segmented Tabs */}
          <Tabs
            active={activeTab}
            onChange={setActiveTab}
            counts={counts}
            isMobile={isMobile}
            isTiny={isTiny}
          />

          {/* Real-time Search Input */}
          <div
            style={{
              position: "relative",
              width: isMobile ? "100%" : 240,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                display: "flex",
                pointerEvents: "none",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pair or metal..."
              style={{
                width: "100%",
                height: 36,
                paddingLeft: 34,
                paddingRight: searchQuery ? 30 : 12,
                background: "rgba(14, 17, 24, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 12,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "#f3f4f6",
                fontSize: 12,
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(0, 212, 160, 0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.08)")
              }
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: 14,
                  padding: "2px 6px",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Rate Cards Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Forex Section */}
          {show("Forex") && (!q || currencies.length > 0) && (
            <SectionContainer
              icon="↗"
              title="Forex"
              count={currencies.length}
              rightLabel="TRY"
              empty={!currencies.length}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 4,
                }}
              >
                {currencies.map((row) => (
                  <MarketRow
                    key={row.code}
                    compact={isTiny}
                    badge={
                      <AssetBadge
                        label={row.code.slice(0, 3)}
                        type="fx"
                        compact={isTiny}
                      />
                    }
                    title={`${row.code}/TRY`}
                    subtitle={row.name}
                    buy={formatForexNumber(row.buy)}
                    sell={formatForexNumber(row.sell)}
                  />
                ))}
              </div>
            </SectionContainer>
          )}

          {/* Metals Section */}
          {show("Metals") && (!q || totalMetalsCount > 0) && (
            <SectionContainer
              icon="◈"
              title="Metals"
              count={totalMetalsCount}
              rightLabel="TRY"
              empty={!goldItems.length && !silverItem}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 4,
                }}
              >
                {silverItem && (
                  <MarketRow
                    compact={isTiny}
                    badge={
                      <AssetBadge
                        label="AG"
                        type="silver"
                        compact={isTiny}
                      />
                    }
                    title="XAG/TRY"
                    subtitle="Silver spot (Gümüş)"
                    buy={
                      silverItem.buying != null
                        ? formatNumber(silverItem.buying)
                        : "—"
                    }
                    sell={
                      silverItem.selling != null
                        ? formatNumber(silverItem.selling)
                        : "—"
                    }
                  />
                )}
                {goldItems.map((item) => (
                  <MarketRow
                    key={item.name}
                    compact={isTiny}
                    badge={
                      <AssetBadge
                        label={(item.name || "AU").slice(0, 2).toUpperCase()}
                        type="gold"
                        compact={isTiny}
                      />
                    }
                    title={item.name}
                    subtitle="Precious metal"
                    buy={item.buy != null ? formatNumber(item.buy) : "—"}
                    sell={item.sell != null ? formatNumber(item.sell) : "—"}
                  />
                ))}
              </div>
            </SectionContainer>
          )}

          {/* Crypto Section */}
          {show("Crypto") && (!q || cryptoItems.length > 0) && (
            <SectionContainer
              icon="⬡"
              title="Crypto"
              count={cryptoItems.length}
              rightLabel="USD"
              empty={!cryptoItems.length}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 4,
                }}
              >
                {cryptoItems.map((item) => (
                  <MarketRow
                    key={item.code}
                    compact={isTiny}
                    badge={
                      <AssetBadge
                        label={(item.code || "CR").slice(0, 2).toUpperCase()}
                        type="crypto"
                        compact={isTiny}
                      />
                    }
                    title={`${item.code}/USD`}
                    subtitle={item.name}
                    buy={formatNumber(item.buy)}
                    sell={formatNumber(item.sell)}
                  />
                ))}
              </div>
            </SectionContainer>
          )}

          {/* No results at all for search */}
          {q && totalFound === 0 && (
            <div
              className="glass-panel"
              style={{
                borderRadius: 18,
                padding: "36px 20px",
                textAlign: "center",
                fontSize: 13,
                color: "#9ca3af",
              }}
            >
              No currency, metal, or crypto found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Connection Error Toast */}
        {status === "error" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                color: "#f87171",
              }}
            >
              ⚠️ {errorMessage}
            </div>
            <button
              type="button"
              onClick={fetchBoard}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 8,
                padding: "4px 10px",
                color: "#fecaca",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Footer Credit & Trust */}
        <div
          style={{
            marginTop: 28,
            textAlign: "center",
            fontSize: 11,
            color: "#6b7280",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div>
            Arzino Exchange © {new Date().getFullYear()} — Real-time Forex,
            Bullion &amp; Crypto Rates
          </div>
          <div style={{ fontSize: 10, color: "#4b5563" }}>
            {/*Rates refresh automatically every 30 seconds*/}
          </div>
        </div>
      </div>
    </div>
  );
}