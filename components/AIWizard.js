import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AIWizard({
  world,
  activeTab,
  entities,
  allEntities,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getQuickActions = () => {
    const actions = {
      characters: [
        { label: "✨ Generate Character", action: "generate-characters" },
        { label: "📖 Expand Backstory", action: "expand-backstory" },
        { label: "🔗 Create Relationships", action: "generate-relationships" },
      ],
      locations: [
        { label: "🏰 Generate Location", action: "generate-locations" },
        { label: "📜 Add History", action: "add-history" },
        { label: "🗺️ Create Connected Location", action: "create-connected" },
      ],
      magic: [
        { label: "✨ Design Magic System", action: "generate-magic" },
        { label: "⚖️ Add Limitations", action: "add-limitations" },
        { label: "🔮 Create Spells", action: "create-spells" },
      ],
      factions: [
        { label: "🛡️ Generate Faction", action: "generate-factions" },
        { label: "👑 Create Leader", action: "create-leader" },
        { label: "⚔️ Add Conflict", action: "add-conflict" },
      ],
      story: [
        { label: "📚 Generate Plot Hook", action: "generate-events" },
        { label: "⏰ Suggest Next Event", action: "suggest-event" },
        { label: "💥 Create Conflict", action: "create-conflict" },
      ],
    };
    return actions[activeTab] || [];
  };

  const handleQuickAction = async (action) => {
    let prompt = "";
    let apiAction = action;

    switch (action) {
      case "generate-characters":
        prompt = "Generate 3 unique character concepts for this world.";
        break;
      case "generate-locations":
        prompt = "Generate 3 unique location ideas for this world.";
        break;
      case "generate-magic":
        prompt = "Generate 2 unique magic system concepts for this world.";
        break;
      case "generate-factions":
        prompt = "Generate 3 unique faction ideas for this world.";
        break;
      case "generate-events":
        prompt = "Generate 3 compelling story event ideas for this world.";
        break;
      case "expand-backstory":
        apiAction = "chat";
        prompt =
          "Help me expand the backstory for one of my characters. What character should we work on?";
        break;
      case "generate-relationships":
        apiAction = "chat";
        prompt =
          "Suggest interesting relationships between my existing characters.";
        break;
      case "add-history":
        apiAction = "chat";
        prompt =
          "Help me add rich historical background to one of my locations.";
        break;
      case "create-connected":
        apiAction = "chat";
        prompt =
          "Suggest a new location that connects to my existing locations.";
        break;
      case "add-limitations":
        apiAction = "chat";
        prompt =
          "Help me add meaningful limitations and costs to my magic system.";
        break;
      case "create-spells":
        apiAction = "chat";
        prompt =
          "Generate interesting spells or abilities for my magic system.";
        break;
      case "create-leader":
        apiAction = "chat";
        prompt = "Help me create a compelling leader for one of my factions.";
        break;
      case "add-conflict":
        apiAction = "chat";
        prompt = "Suggest conflicts or tensions between my factions.";
        break;
      case "suggest-event":
        apiAction = "chat";
        prompt =
          "Based on my existing story events, suggest what should happen next.";
        break;
      case "create-conflict":
        apiAction = "chat";
        prompt = "Generate a dramatic conflict or crisis for my story.";
        break;
      default:
        return;
    }

    await sendMessage(prompt, apiAction);
  };

  const sendMessage = async (messageText = input, action = "chat") => {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/ai/generate", {
        action,
        prompt: messageText,
        context: {
          worldName: world.name,
          entityType: activeTab,
          existingEntities: entities,
          characters: allEntities.characters || [],
          locations: allEntities.locations || [],
          factions: allEntities.factions || [],
        },
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.result,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "❌ Sorry, I encountered an error. Please make sure your GEMINI_API_KEY is set in your .env.local file.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating wizard button */}
      <button
        className="ai-wizard-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Axel Intelligence Wizard"
      >
        🤖
      </button>

      {/* Wizard panel */}
      {isOpen && (
        <div className="ai-wizard-panel">
          <div className="ai-wizard-header">
            <h3>🤖 Axel Intelligence Wizard</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">
              ×
            </button>
          </div>

          <div className="ai-wizard-context">
            <strong>{world.name}</strong>
            <span className="context-separator">•</span>
            <span className="context-tab">{activeTab}</span>
            <span className="context-separator">•</span>
            <span className="context-count">
              {entities.length} {activeTab}
            </span>
          </div>

          <div className="ai-quick-actions">
            {getQuickActions().map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(qa.action)}
                className="quick-action-button"
                disabled={isLoading}
              >
                {qa.label}
              </button>
            ))}
          </div>

          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p>🤖 Welcome to Axel Intelligence!</p>
                <p>
                  I'm your AI worldbuilding assistant. I can help you create characters, locations, magic systems,
                  factions, and story events.
                </p>
                <p>
                  Try a quick action above or ask me anything about your world!
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-message assistant">
                <div className="message-icon">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="ai-chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the wizard anything..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .ai-wizard-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border: 2px solid var(--accent-gold);
          font-size: 2rem;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(157, 78, 221, 0.5);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .ai-wizard-button:hover {
          transform: scale(1.1) rotate(10deg);
          box-shadow: 0 6px 30px rgba(157, 78, 221, 0.7);
        }

        .ai-wizard-panel {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 450px;
          height: 600px;
          background: var(--bg-primary);
          border: 2px solid var(--accent-gold);
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          z-index: 1001;
          overflow: hidden;
        }

        .ai-wizard-header {
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--accent-gold);
        }

        .ai-wizard-header h3 {
          margin: 0;
          color: white;
          font-family: "Cinzel", serif;
          font-size: 1.2rem;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .close-button:hover {
          transform: scale(1.2);
        }

        .ai-wizard-context {
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .context-separator {
          color: var(--text-muted);
        }

        .context-tab {
          color: var(--accent-secondary);
          font-weight: bold;
          text-transform: capitalize;
        }

        .context-count {
          color: var(--text-muted);
        }

        .ai-quick-actions {
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .quick-action-button {
          padding: 0.4rem 0.8rem;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border: 1px solid var(--accent-gold);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(157, 78, 221, 0.4);
        }

        .quick-action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-welcome {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem 1rem;
        }

        .ai-welcome p {
          margin: 0.5rem 0;
        }

        .ai-message {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .ai-message.user {
          flex-direction: row-reverse;
        }

        .message-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .message-content {
          background: var(--bg-secondary);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          max-width: 80%;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .ai-message.user .message-content {
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          color: white;
          border-color: var(--accent-gold);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.25rem;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--accent-secondary);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        .ai-chat-input {
          padding: 1rem;
          border-top: 2px solid var(--accent-gold);
          background: var(--bg-secondary);
          display: flex;
          gap: 0.5rem;
        }

        .ai-chat-input input {
          flex: 1;
          padding: 0.75rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .ai-chat-input input:focus {
          outline: none;
          border-color: var(--accent-secondary);
        }

        .ai-chat-input button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border: 1px solid var(--accent-gold);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .ai-chat-input button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(157, 78, 221, 0.4);
        }

        .ai-chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .ai-wizard-panel {
            width: calc(100vw - 2rem);
            height: calc(100vh - 4rem);
            bottom: 1rem;
            right: 1rem;
          }

          .ai-wizard-button {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
}
