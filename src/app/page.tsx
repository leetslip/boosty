

"use client";
import { useState, useEffect } from "react";


const API_URL = "https://api.dexscreener.com/latest/dex/pairs/solana/a";

const EXCLUDE_FIELDS = [
  "chainId",
  "dexId",
  "url",
  "pairAddress",
  "baseToken.address",
  "baseToken.name",
  "baseToken.symbol",
  "quoteToken.address",
  "quoteToken.name",
  "quoteToken.symbol",
  "txns.m5",
  "txns.h1",
  "txns.h6",
  "txns.h24",
  "volume.h24",
  "volume.h6",
  "volume.h1",
  "volume.m5",
  "priceChange.m5",
  "priceChange.h1",
  "priceChange.h6",
  "priceChange.h24",
  "liquidity.usd",
  "liquidity.quote",
  "pairCreatedAt",
  "info.imageUrl",
  "info.header",
  "info.openGraph",
  "info.websites",
  "info.socials",
  "fdv"
];

// Allow `any` here because the external API shape is dynamic and we only read values safely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFields(data: any) {
  if (!data || !data.pair) return [];
  const fields = [];
  // Custom mappings
  if (data.pair.priceNative) {
    fields.push({ feature: "SOL/TOKEN", status: String(data.pair.priceNative) });
  }
  if (data.pair.priceUsd) {
    fields.push({ feature: "USD/TOKEN", status: String(data.pair.priceUsd) });
  }
  // Removed Liquidity field from custom mappings
  if (data.pair.marketCap) {
    fields.push({ feature: "MarketCap", status: String(data.pair.marketCap) });
  }
  if (data.pair.boosts && data.pair.boosts.active) {
    fields.push({ feature: "BOOST MULTIPLIER", status: String(data.pair.boosts.active) + " X" });
  }
  // Add remaining fields except excluded and custom mapped
  for (const key in data.pair) {
    if (["priceNative", "priceUsd", "liquidity", "marketCap", "boosts"].includes(key)) continue;
    if (typeof data.pair[key] === "object" && data.pair[key] !== null) {
      for (const subKey in data.pair[key]) {
        const fieldName = `${key}.${subKey}`;
        if (!EXCLUDE_FIELDS.includes(fieldName)) {
          fields.push({ feature: fieldName, status: String(data.pair[key][subKey]) });
        }
      }
    } else {
      if (!EXCLUDE_FIELDS.includes(key)) {
        fields.push({ feature: key, status: String(data.pair[key]) });
      }
    }
  }
  return fields;
}

export default function Home() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [fields, setFields] = useState<{feature: string, status: string}[]>([]);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [captionHover, setCaptionHover] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (mounted) setFields(parseFields(data));
      } catch (err) {
          // log the error for debugging and show a simple status
    console.error(err);
          if (mounted) setFields([{feature: "Error", status: "Failed to fetch"}]);
        }
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundImage: "url('/bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }}
    >
      {/* Center Logos */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <a href="https://dexscreener.com/solana/" target="_blank" rel="noopener noreferrer">
              <img
                src="/dex.png"
                alt="Dexscreener"
                style={{ width: 80, height: 80, borderRadius: "16px", boxShadow: "0 4px 16px #ffb300", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = "0 0 32px 8px #ffb300"; e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = "0 4px 16px #ffb300"; e.currentTarget.style.transform = ""; }}
              />
            </a>
            <div
              role="button"
              onClick={async () => {
                const captionText = "Contract Address Here SoonContract Address Here Soon";
                try {
                  await navigator.clipboard.writeText(captionText);
                  setCaptionCopied(true);
                  setTimeout(() => setCaptionCopied(false), 1800);
                } catch (err) {
                  console.error("Clipboard write failed", err);
                }
              }}
              onMouseEnter={() => setCaptionHover(true)}
              onMouseLeave={() => setCaptionHover(false)}
              style={{
                marginTop: 12,
                fontWeight: 700,
                color: "#ffb300",
                textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                fontSize: 16,
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s, color 0.18s",
                transform: captionHover ? "scale(1.06)" : "scale(1)",
                boxShadow: captionHover ? "0 6px 28px 0 #ffb30099" : "none",
                padding: "6px 10px",
                borderRadius: 8,
                userSelect: "none",
              }}
            >
              {captionCopied ? "Copied!" : "Contract Address Here SoonContract Address Here Soon"}
            </div>
          </div>
        </div>
      </div>
      {/* Dexscreener Table Top Right */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div style={{
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          padding: "32px 24px 24px 24px",
          maxWidth: "480px",
          marginBottom: "32px",
          fontSize: "1.1rem",
          textAlign: "center",
          border: "2px solid #ffb300",
          backdropFilter: "blur(8px)",
        }}>
          <strong>Description:</strong><br />
          The aim of this project is just to see if paying dex is a scam or nah. ALL creator fees used to pay for dex boosts and ads and keep topping up the boost multiplier. Why are we paying 300 dollars minimum to dexscreener for every coin? Lets find out!
        </div>
        <table style={{
          borderCollapse: "separate",
          borderSpacing: "0",
          width: "420px",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
        }}>
          <thead>
            <tr style={{background: "#ffb300"}}>
              <th style={{padding: "16px", fontSize: "1.2rem", color: "#222", letterSpacing: "1px"}}>Feature</th>
              <th style={{padding: "16px", fontSize: "1.2rem", color: "#222", letterSpacing: "1px"}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((row, idx) => (
              <tr
                key={row.feature}
                style={{
                  transition: "all 0.3s",
                  cursor: "pointer",
                  background: hovered === idx ? "#ffe082" : undefined,
                  transform: hovered === idx ? "scale(1.03)" : undefined,
                  boxShadow: hovered === idx ? "0 2px 16px 0 #ffb30088" : undefined,
                }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <td style={{padding: "16px", fontWeight: "bold", color: "#1976d2"}}>{row.feature}</td>
                <td style={{padding: "16px", color: "#1976d2", fontWeight: "bold"}}>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
