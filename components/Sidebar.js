export default function Sidebar({ world, activeTab, onTabChange }) {
  const tabs = [
    { id: "characters", label: "Characters", icon: "⚔️" },
    { id: "locations", label: "Locations", icon: "🏰" },
    { id: "magics", label: "Magic", icon: "✨" },
    { id: "factions", label: "Factions", icon: "🛡️" },
    { id: "events", label: "Story", icon: "📜" },
  ];

  return (
    <div className="sidebar card">
      <h3 style={{ marginTop: 0, fontSize: 24, letterSpacing: "1px" }}>
        {world?.name ?? "World"}
      </h3>
      {world?.summary && <div className="world-summary">{world.summary}</div>}
      <nav style={{ marginTop: 24 }}>
        <ul className="sidebar-nav">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <a
                href="#"
                className={activeTab === tab.id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(tab.id);
                }}
              >
                <span style={{ marginRight: 8 }}>{tab.icon}</span>
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
