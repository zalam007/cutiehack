import sounds from "../lib/sounds";

export default function EntityList({ items = [], onEdit, onDelete, onView }) {
  const handleView = (item) => {
    sounds.click();
    onView?.(item);
  };

  const handleEdit = (item) => {
    sounds.open();
    onEdit?.(item);
  };

  const handleDelete = (item) => {
    sounds.delete();
    onDelete?.(item);
  };

  if (!items.length) {
    return (
      <div className="empty-state">
        <p>No entries yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((it) => {
        const displayName = it.name || it.title;
        const description = it.description || it.overview;
        const meta = [];

        if (it.role) meta.push({ label: "Role", value: it.role });
        if (it.type) meta.push({ label: "Type", value: it.type });
        if (it.age) meta.push({ label: "Age", value: it.age });
        if (it.category) meta.push({ label: "Category", value: it.category });
        if (it.leader) meta.push({ label: "Leader", value: it.leader });
        if (it.date) meta.push({ label: "Date", value: it.date });

        return (
          <div key={it.id} className="entity-card">
            <div className="entity-header">
              <div style={{ flex: 1 }}>
                <h3 className="entity-title">{displayName}</h3>
                {meta.length > 0 && (
                  <div className="entity-meta">
                    {meta.slice(0, 3).map((m, i) => (
                      <span key={i}>
                        <strong>{m.label}:</strong> {m.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {description && (
              <div className="entity-description">
                {description.length > 200
                  ? description.substring(0, 200) + "..."
                  : description}
              </div>
            )}

            <div className="entity-actions">
              <button className="button-secondary" onClick={() => handleView(it)}>
                View
              </button>
              <button className="button-secondary" onClick={() => handleEdit(it)}>
                Edit
              </button>
              <button className="button-danger" onClick={() => handleDelete(it)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
