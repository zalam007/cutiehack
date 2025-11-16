import Link from "next/link";

export default function Sidebar({ world }) {
  return (
    <div className="sidebar">
      <h3 style={{ marginTop: 0 }}>{world?.name ?? "World"}</h3>
      <p className="muted">{world?.summary}</p>
      <div style={{ marginTop: 12 }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="#">Characters</Link>
            </li>
            <li>
              <Link href="#">Locations</Link>
            </li>
            <li>
              <Link href="#">Magic</Link>
            </li>
            <li>
              <Link href="#">Factions</Link>
            </li>
            <li>
              <Link href="#">Story / Timeline</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
