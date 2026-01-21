import React from "react";

const Header: React.FC<{ onImportClick: () => void; onExportClick: () => void; }> = ({ onImportClick, onExportClick }) => (
  <header className="app-header">
    <div className="container header-inner">
      <div className="brand">
        <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden><path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z" /></svg>
        <div>
          <h1>MoneyMap</h1>
          <p className="muted">SpendWise - Financial Insights Platform — local-first</p>
        </div>
      </div>
      <nav>
        <button className="btn ghost" onClick={onImportClick}>Import CSV</button>
        <button className="btn ghost" onClick={onExportClick}>Export CSV</button>
      </nav>
    </div>
  </header>
);

export default Header;
