import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Sparkles, 
  Code, 
  Key, 
  Database, 
  Server, 
  AlertCircle,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export default function McpConfigModal({ 
  isOpen, 
  onClose, 
  mcpConfig, 
  onSaveMcpConfig,
  geminiApiKey,
  onSaveGeminiKey
}) {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(mcpConfig || {
      serverName: "stitch",
      version: "1.0.0",
      transport: "stdio",
      command: "npx",
      args: ["-y", "@google/stitch-mcp"],
      env: {
        STITCH_API_KEY: "stitch_live_sk_8f7392a10b98",
        PROJECT_DEFAULT_THEME: "dark"
      },
      availableTools: [
        "create_project",
        "generate_screen_from_text",
        "list_screens",
        "get_screen",
        "edit_screens",
        "apply_design_system"
      ]
    }, null, 2)
  );

  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorText, setErrorText] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonText(JSON.stringify(parsed, null, 2));
        setErrorText(null);
        setStatusMessage("MCP Configuration JSON uploaded successfully!");
      } catch (err) {
        setErrorText("Invalid JSON File format. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    try {
      const parsedConfig = JSON.parse(jsonText);
      onSaveMcpConfig(parsedConfig);
      if (apiKeyInput) {
        onSaveGeminiKey(apiKeyInput);
      }
      setStatusMessage("Stitch MCP & Gemini configuration saved successfully!");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setErrorText("Error parsing MCP JSON. Please verify JSON syntax.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff' }}>
              Google Stitch MCP & Gemini Configuration
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Backend Admin Panel for Uploading MCP JSON & Managing API Key
            </p>
          </div>
        </div>

        {/* Gemini API Key Section */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c4b5fd' }}>
            <Key size={15} />
            Gemini API Key (Option A - Direct AI Generation)
          </label>
          <input 
            type="password"
            placeholder="AIzaSy... (Enter Gemini API Key)"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
            Used for dynamic web page generation and AI smart auto-responder.
          </p>
        </div>

        {/* MCP JSON Upload Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', margin: 0 }}>
              <FileCode size={15} />
              Google Stitch MCP Configuration JSON (Option B - Stitch Integration)
            </label>

            <label htmlFor="mcp-json-file" className="btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              <Upload size={14} />
              Upload MCP JSON File
            </label>
            <input 
              type="file"
              id="mcp-json-file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <textarea 
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            className="form-input"
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.82rem',
              background: '#090d16',
              color: '#38bdf8',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Registered MCP Tools List */}
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#c7d2fe', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#818cf8" />
            Registered Stitch MCP Tools Active:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {["create_project", "generate_screen_from_text", "list_screens", "edit_screens", "apply_design_system"].map((tool) => (
              <span key={tool} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#6ee7b7',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: "'Fira Code', monospace"
              }}>
                ✓ {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Banners */}
        {errorText && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            {errorText}
          </div>
        )}

        {statusMessage && (
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} />
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Sparkles size={16} />
            Save & Connect Stitch MCP
          </button>
        </div>
      </div>
    </div>
  );
}
