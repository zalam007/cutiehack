import Link from "next/link";
import sounds from "../lib/sounds";

export default function Layout({ children }) {
  const handleLogoClick = () => {
    sounds.logoClick();
  };

  return (
    <div className="container">
      <div className="app-header">
        <Link href="/" className="logo-link" onClick={handleLogoClick}>
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
