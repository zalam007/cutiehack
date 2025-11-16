import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="container">
      <div className="app-header">
        <Link href="/" className="logo-link">
          <div className="logo">
            <span className="logo-icon">⚔️</span>
            <span className="logo-text">
              <span className="logo-lore">Lore</span>
              <span className="logo-forge">Forge</span>
            </span>
          </div>
        </Link>
      </div>
      <div className="card">{children}</div>
    </div>
  );
}
