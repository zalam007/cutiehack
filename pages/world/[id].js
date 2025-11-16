import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import EntityList from "../../components/EntityList";
import EntityModal from "../../components/EntityModal";
import AIWizard from "../../components/AIWizard";
import axios from "axios";

export default function WorldPage() {
  const router = useRouter();
  const { id } = router.query;
  const [world, setWorld] = useState(null);
  const [tab, setTab] = useState("characters");
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [allEntities, setAllEntities] = useState({
    characters: [],
    locations: [],
    magics: [],
    factions: [],
    events: [],
  });

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/worlds/${id}`).then((r) => setWorld(r.data));
    loadItems();
    loadAllEntities();
  }, [id, tab]);

  function loadAllEntities() {
    if (!id) return;
    const entityTypes = [
      "characters",
      "locations",
      "magics",
      "factions",
      "events",
    ];
    Promise.all(
      entityTypes.map((type) =>
        axios
          .get(`/api/${type}?worldId=${id}`)
          .then((r) => ({ type, data: r.data }))
      )
    ).then((results) => {
      const entities = {};
      results.forEach(({ type, data }) => {
        entities[type] = data;
      });
      setAllEntities(entities);
    });
  }

  function loadItems() {
    if (!id) return;
    axios.get(`/api/${tab}?worldId=${id}`).then((r) => setItems(r.data));
  }

  function handleCreate() {
    setEditing({});
    setModalOpen(true);
  }

  function handleEdit(it) {
    setEditing(it);
    setModalOpen(true);
  }

  function handleView(it) {
    setViewing(it);
    setViewModalOpen(true);
  }

  function handleDelete(it) {
    if (!confirm("Are you sure you want to delete this?")) return;
    axios.delete(`/api/${tab}/${it.id}`).then(loadItems);
  }

  function handleSave(data) {
    const payload = { ...data, worldId: Number(id) };
    if (data.id) {
      axios.put(`/api/${tab}/${data.id}`, payload).then(() => {
        setModalOpen(false);
        loadItems();
      });
    } else {
      axios.post(`/api/${tab}`, payload).then(() => {
        setModalOpen(false);
        loadItems();
      });
    }
  }

  const tabLabels = {
    characters: "Character",
    locations: "Location",
    magics: "Magic System",
    factions: "Faction",
    events: "Story Event",
  };

  return (
    <Layout>
      <div className="layout">
        <Sidebar world={world} activeTab={tab} onTabChange={setTab} />
        <div className="main">
          <div className="card">
            <div className="page-header">
              <h1 className="page-title">
                {tabLabels[tab] || "Entity"} Archive
              </h1>
              <button className="button" onClick={handleCreate}>
                + New {tabLabels[tab]}
              </button>
            </div>

            <EntityList
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </div>
        </div>
      </div>

      <EntityModal
        open={modalOpen}
        initial={editing || {}}
        entityType={tab}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {viewModalOpen && viewing && (
        <ViewModal
          item={viewing}
          entityType={tab}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            handleEdit(viewing);
          }}
        />
      )}

      {world && (
        <AIWizard
          world={world}
          activeTab={tab}
          entities={items}
          allEntities={allEntities}
        />
      )}
    </Layout>
  );
}

function ViewModal({ item, entityType, onClose, onEdit }) {
  const renderFields = () => {
    const fields = Object.entries(item).filter(
      ([key, value]) =>
        !["id", "worldId", "timestamp"].includes(key) && value != null
    );

    return fields.map(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        return (
          <div key={key} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent-secondary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: 8,
              }}
            >
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                lineHeight: 1.6,
                fontFamily: "Georgia, serif",
              }}
            >
              {value}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 800,
          maxHeight: "90vh",
          overflow: "auto",
          background: "linear-gradient(135deg,#1a1f2e,#12171f)",
          padding: 32,
          borderRadius: 16,
          border: "1px solid rgba(157,78,221,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: 28,
            background:
              "linear-gradient(135deg,var(--accent-secondary),var(--accent-gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {item.name || item.title}
        </h2>

        <div>{renderFields()}</div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button className="button-secondary" onClick={onClose}>
            Close
          </button>
          <button className="button" onClick={onEdit}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
