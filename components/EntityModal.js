import { useState } from "react";

export default function EntityModal({
  open = false,
  initial = {},
  entityType = "character",
  onClose,
  onSave,
}) {
  const [data, setData] = useState(initial);

  // Reset when initial changes
  if (initial && initial.id !== data.id) {
    setData(initial);
  }

  if (!open) return null;

  const renderFields = () => {
    switch (entityType) {
      case "characters":
        return (
          <>
            <input
              placeholder="Name"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              placeholder="Role"
              value={data.role || ""}
              onChange={(e) => setData({ ...data, role: e.target.value })}
            />
            <input
              placeholder="Age"
              value={data.age || ""}
              onChange={(e) => setData({ ...data, age: e.target.value })}
            />
            <input
              placeholder="Personality"
              value={data.personality || ""}
              onChange={(e) =>
                setData({ ...data, personality: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="Backstory"
              value={data.backstory || ""}
              onChange={(e) => setData({ ...data, backstory: e.target.value })}
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="Strengths"
              value={data.strengths || ""}
              onChange={(e) => setData({ ...data, strengths: e.target.value })}
              style={{ minHeight: 50 }}
            />
            <textarea
              placeholder="Weaknesses"
              value={data.weaknesses || ""}
              onChange={(e) => setData({ ...data, weaknesses: e.target.value })}
              style={{ minHeight: 50 }}
            />
          </>
        );

      case "locations":
        return (
          <>
            <input
              placeholder="Name"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              placeholder="Type (City, Forest, Dungeon, etc.)"
              value={data.type || ""}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            />
            <input
              placeholder="Population"
              value={data.population || ""}
              onChange={(e) => setData({ ...data, population: e.target.value })}
            />
            <input
              placeholder="Climate"
              value={data.climate || ""}
              onChange={(e) => setData({ ...data, climate: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="History"
              value={data.history || ""}
              onChange={(e) => setData({ ...data, history: e.target.value })}
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
          </>
        );

      case "magics":
        return (
          <>
            <input
              placeholder="Name"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              placeholder="Category (Elemental, Ritual, etc.)"
              value={data.category || ""}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="Rules"
              value={data.rules || ""}
              onChange={(e) => setData({ ...data, rules: e.target.value })}
              style={{ gridColumn: "1 / -1", minHeight: 50 }}
            />
            <textarea
              placeholder="Limitations"
              value={data.limitations || ""}
              onChange={(e) =>
                setData({ ...data, limitations: e.target.value })
              }
              style={{ minHeight: 50 }}
            />
            <textarea
              placeholder="Costs"
              value={data.costs || ""}
              onChange={(e) => setData({ ...data, costs: e.target.value })}
              style={{ minHeight: 50 }}
            />
            <textarea
              placeholder="Examples"
              value={data.examples || ""}
              onChange={(e) => setData({ ...data, examples: e.target.value })}
              style={{ gridColumn: "1 / -1", minHeight: 50 }}
            />
          </>
        );

      case "factions":
        return (
          <>
            <input
              placeholder="Name"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              placeholder="Type (Guild, Kingdom, Cult, etc.)"
              value={data.type || ""}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            />
            <input
              placeholder="Leader"
              value={data.leader || ""}
              onChange={(e) => setData({ ...data, leader: e.target.value })}
              style={{ gridColumn: "1 / -1" }}
            />
            <textarea
              placeholder="Description"
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="Goals"
              value={data.goals || ""}
              onChange={(e) => setData({ ...data, goals: e.target.value })}
              style={{ minHeight: 50 }}
            />
            <textarea
              placeholder="Conflicts"
              value={data.conflicts || ""}
              onChange={(e) => setData({ ...data, conflicts: e.target.value })}
              style={{ minHeight: 50 }}
            />
          </>
        );

      case "events":
        return (
          <>
            <input
              placeholder="Title"
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
            <input
              placeholder="Date"
              value={data.date || ""}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
            <input
              placeholder="Location"
              value={data.location || ""}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              style={{ gridColumn: "1 / -1" }}
            />
            <textarea
              placeholder="Description"
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              style={{ gridColumn: "1 / -1", minHeight: 60 }}
            />
            <textarea
              placeholder="Characters Involved"
              value={data.charactersInvolved || ""}
              onChange={(e) =>
                setData({ ...data, charactersInvolved: e.target.value })
              }
              style={{ minHeight: 50 }}
            />
            <textarea
              placeholder="Outcome"
              value={data.outcome || ""}
              onChange={(e) => setData({ ...data, outcome: e.target.value })}
              style={{ minHeight: 50 }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 700,
          maxHeight: "90vh",
          overflow: "auto",
          background: "#041024",
          padding: 18,
          borderRadius: 8,
        }}
      >
        <h3>{data.id ? "Edit" : "Create"}</h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {renderFields()}
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button onClick={onClose}>Cancel</button>
          <button className="button" onClick={() => onSave?.(data)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
