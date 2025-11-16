import { useEffect, useRef } from "react";
import { Network } from "vis-network";

export default function LocationMap({ locations = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = locations.map((loc) => ({ id: loc.id, label: loc.name }));
    const edges = [];

    // Build edges from connected locations
    locations.forEach((loc) => {
      if (loc.connected) {
        loc.connected.forEach((connectedId) => {
          if (
            edges.find(
              (e) =>
                (e.from === loc.id && e.to === connectedId) ||
                (e.from === connectedId && e.to === loc.id)
            )
          )
            return;
          edges.push({ from: loc.id, to: connectedId });
        });
      }
    });

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      {
        nodes: { shape: "box", color: "#ff7c5c" },
        edges: { color: "#666" },
      }
    );

    return () => network.destroy();
  }, [locations]);

  return (
    <div
      ref={containerRef}
      style={{ height: 400, background: "#0b1220", borderRadius: 8 }}
    />
  );
}
