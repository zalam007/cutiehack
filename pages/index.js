import { useState } from "react";
import Layout from "../components/Layout";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((r) => r.data);

export default function Dashboard() {
  const { data, mutate } = useSWR("/api/worlds", fetcher);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", summary: "" });
  const router = useRouter();

  async function handleCreate() {
    const result = await axios.post("/api/worlds", formData);
    setModalOpen(false);
    setFormData({ name: "", summary: "" });
    mutate();
    router.push(`/world/${result.data.id}`);
  }

  return (
    <Layout>
      <div className="layout">
        <div className="sidebar card">
          <h3>Worlds</h3>
          <div className="muted">Create and manage your worlds</div>
        </div>
        <div className="main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Your Worlds</h2>
            <button className="button" onClick={() => setModalOpen(true)}>
              Create World
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            {data?.length ? (
              data.map((w) => (
                <div 
                  key={w.id} 
                  className="world-card world-card-clickable"
                  onClick={() => router.push(`/world/${w.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="world-card-content">
                    <div className="world-card-title">
                      🌍 {w.name}
                    </div>
                    <div className="world-card-summary">{w.summary || "No description yet"}</div>
                    <div className="world-card-meta">
                      📅 Created {new Date(w.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌌</div>
                <div>No worlds created yet. Start building your first world!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            setModalOpen(false);
            setFormData({ name: "", summary: "" });
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create New World</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                placeholder="World Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{ padding: 8 }}
              />
              <textarea
                placeholder="Summary (optional)"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                style={{ padding: 8, minHeight: 80 }}
              />
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button className="button-secondary" onClick={() => {
                setModalOpen(false);
                setFormData({ name: "", summary: "" });
              }}>Cancel</button>
              <button
                className="button"
                onClick={handleCreate}
                disabled={!formData.name}
              >
                Create World
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
