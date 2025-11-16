import { useEffect, useRef } from "react";
import { Network } from "vis-network";

export default function RelationshipMap({ characters = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = characters.map((c) => ({ id: c.id, label: c.name }));
    const edges = [];

    // Build edges from relationships
    characters.forEach((c) => {
      if (c.relationships) {
        c.relationships.forEach((relId) => {
          if (
            edges.find(
              (e) =>
                (e.from === c.id && e.to === relId) ||
                (e.from === relId && e.to === c.id)
            )
          )
            return;
          edges.push({ from: c.id, to: relId });
        });
      }
    });

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      {
        nodes: { shape: "dot", color: "#7c5cff" },
        edges: { color: "#444" },
      }
    );

    return () => network.destroy();
  }, [characters]);

  return (
    <div
      ref={containerRef}
      style={{ height: 400, background: "#0b1220", borderRadius: 8 }}
    />
  );
}
