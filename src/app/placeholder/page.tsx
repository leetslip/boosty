"use client";

import React from "react";

export default function PlaceholderPage() {
  const rows = [
    { feature: "SOL/TOKEN", status: "Will Display On DexPaid" },
    { feature: "USD/TOKEN", status: "Will Display On DexPaid" },
    { feature: "MarketCap", status: "Will Display On DexPaid" },
    { feature: "BOOST MULTIPLIER", status: "None Yet" },
  ];

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
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
