"use client";

import React, { useEffect, useState } from "react";

// Exact API URL requested
const API_URL = "https://api.dexscreener.com/latest/dex/pairs/solana/AniwPMMaRG6cbLXrZXonAcmGAMaWmLerz4sfouhhgWwD";

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
  "fdv",
];

// Allow `any` because API response shape is dynamic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFields(data: any) {
  if (!data || !data.pair) return [];
  const fields: { feature: string; status: string | null }[] = [];

  // Custom mappings
  if (data.pair.priceNative !== undefined) fields.push({ feature: "SOL/TOKEN", status: data.pair.priceNative ?? null });
  if (data.pair.priceUsd !== undefined) fields.push({ feature: "USD/TOKEN", status: data.pair.priceUsd ?? null });
  if (data.pair.marketCap !== undefined) fields.push({ feature: "MarketCap", status: data.pair.marketCap ?? null });
  if (data.pair.boosts && data.pair.boosts.active !== undefined) fields.push({ feature: "BOOST MULTIPLIER", status: data.pair.boosts.active !== null ? String(data.pair.boosts.active) + " X" : null });

  // Add remaining fields except excluded and custom mapped
  for (const key in data.pair) {
    if (["priceNative", "priceUsd", "liquidity", "marketCap", "boosts"].includes(key)) continue;
    const val = data.pair[key];
    if (typeof val === "object" && val !== null) {
      for (const subKey in val) {
        const fieldName = `${key}.${subKey}`;
        if (!EXCLUDE_FIELDS.includes(fieldName)) {
          fields.push({ feature: fieldName, status: val[subKey] ?? null });
        }
      }
    } else {
      if (!EXCLUDE_FIELDS.includes(key)) {
        fields.push({ feature: key, status: val ?? null });
      }
    }
  }

  return fields;
}

type Row = { feature: string; status: string | null };

export default function ObsPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const parsed = parseFields(data);
        if (mounted) setRows(parsed.map(r => ({ feature: r.feature, status: r.status !== undefined && r.status !== null ? String(r.status) : null })));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (mounted) setRows([]);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <table style={{ borderCollapse: "collapse", color: "#fff", minWidth: 260 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingBottom: 8, fontSize: 14, color: "#ddd" }}>Feature</th>
            <th style={{ textAlign: "right", paddingBottom: 8, fontSize: 14, color: "#ddd" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.feature}>
              <td style={{ padding: "6px 8px", fontWeight: 700, color: "#fff" }}>{r.feature}</td>
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>{r.status === null ? "null" : r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
