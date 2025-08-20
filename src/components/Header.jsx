import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__row">
        <div className="logo" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img src="/logohometop.png" alt="VibeStrings Logo" style={{ height: "20px" }} />
          <span style={{ fontWeight: "600", fontSize: "16px", color: "#0f172a" }}>VibeStrings</span>
        </div>

        <nav style={{ opacity: 0.7, fontSize: 14 }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a>
        </nav>
      </div>
    </header>
  );
}
