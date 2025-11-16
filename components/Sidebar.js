import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Sidebar({ world, activeTab, onTabChange, onWorldUpdate }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [name, setName] = useState(world?.name || '');
  const [summary, setSummary] = useState(world?.summary || '');
  const router = useRouter();

  const tabs = [
    { id: "characters", label: "Characters", icon: "⚔️" },
    { id: "locations", label: "Locations", icon: "🏰" },
    { id: "magics", label: "Magic", icon: "✨" },
    { id: "factions", label: "Factions", icon: "🛡️" },
    { id: "events", label: "Story", icon: "📜" },
  ];

  async function handleSaveName() {
    if (name.trim()) {
      await axios.put(`/api/worlds/${world.id}`, { name, summary: world.summary });
      setIsEditingName(false);
      onWorldUpdate();
    }
  }

  async function handleSaveSummary() {
    await axios.put(`/api/worlds/${world.id}`, { name: world.name, summary });
    setIsEditingSummary(false);
    onWorldUpdate();
  }

  async function handleDelete() {
    if (confirm(`Are you sure you want to delete "${world.name}"? This will delete all characters, locations, magic systems, factions, and story events in this world. This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/worlds/${world.id}`);
        router.push('/');
      } catch (error) {
        alert('Failed to delete world: ' + error.message);
      }
    }
  }

  return (
    <div className="sidebar card">
      {isEditingName ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSaveName}
          onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
          autoFocus
          style={{ 
            marginTop: 0, 
            fontSize: 20, 
            fontWeight: 700,
            fontFamily: 'Cinzel, serif',
            marginBottom: 12
          }}
        />
      ) : (
        <h3 
          style={{ 
            marginTop: 0, 
            fontSize: 24, 
            letterSpacing: "1px",
            cursor: 'pointer',
            borderBottom: '2px dashed transparent',
            paddingBottom: 4,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
          onClick={() => {
            setName(world?.name || '');
            setIsEditingName(true);
          }}
          title="Click to edit"
        >
          {world?.name ?? "World"}
        </h3>
      )}
      
      {isEditingSummary ? (
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onBlur={handleSaveSummary}
          autoFocus
          className="world-summary"
          style={{ 
            minHeight: 80,
            width: '100%',
            resize: 'vertical'
          }}
        />
      ) : (
        world?.summary ? (
          <div 
            className="world-summary" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setSummary(world.summary);
              setIsEditingSummary(true);
            }}
            title="Click to edit"
          >
            {world.summary}
          </div>
        ) : (
          <div 
            className="world-summary" 
            style={{ 
              cursor: 'pointer', 
              opacity: 0.5,
              fontStyle: 'italic' 
            }}
            onClick={() => {
              setSummary('');
              setIsEditingSummary(true);
            }}
            title="Click to add description"
          >
            Click to add description...
          </div>
        )
      )}
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
      
      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={handleDelete} 
          className="button-danger"
          style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          🗑️ Delete World
        </button>
      </div>
    </div>
  );
}
