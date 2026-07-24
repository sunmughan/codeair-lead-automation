import React from 'react';
import { 
  Building2, 
  Layers, 
  Send, 
  MessageSquareCode, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit,
  Database
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  leadsCount, 
  designedCount, 
  sentCount, 
  repliedCount, 
  mcpConnected,
  onOpenMcpModal 
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <BrainCircuit size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#fff',
                letterSpacing: '-0.02em'
              }}>
                Codeair <span style={{ color: '#8b5cf6' }}>Lead Engine</span>
              </h1>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: '700'
              }}>
                SOFTWARE SOLUTIONS
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Automated Lead Extraction • Dynamic Web Studio • Real SMTP Outreach
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Database size={14} color="#3b82f6" />
            <span style={{ color: 'var(--text-muted)' }}>Total Email Leads:</span>
            <strong style={{ color: '#fff' }}>{leadsCount}</strong>
          </div>
          
          <div className="glass-card" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Layers size={14} color="#8b5cf6" />
            <span style={{ color: 'var(--text-muted)' }}>Pages Designed:</span>
            <strong style={{ color: '#c4b5fd' }}>{designedCount}</strong>
          </div>

          <div className="glass-card" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Send size={14} color="#f59e0b" />
            <span style={{ color: 'var(--text-muted)' }}>Pitches Sent:</span>
            <strong style={{ color: '#fde68a' }}>{sentCount}</strong>
          </div>

          {/* MCP & SMTP Settings Trigger */}
          <button 
            onClick={onOpenMcpModal}
            className="btn-secondary btn-sm"
            style={{
              borderColor: mcpConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
              background: mcpConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <Sparkles size={14} color={mcpConnected ? '#10b981' : '#f59e0b'} />
            <span style={{ color: mcpConnected ? '#6ee7b7' : '#fde68a' }}>
              {mcpConnected ? 'SMTP & Stitch Active' : 'Configure SMTP & API'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'leads', label: '1. CSV Leads Hub', icon: Building2, count: leadsCount },
          { id: 'studio', label: '2. Dynamic Web Studio', icon: Layers, count: designedCount },
          { id: 'emails', label: '3. Real Email Pitcher', icon: Send, count: sentCount },
          { id: 'smart-replies', label: '4. Smart Reply & Notes Log', icon: MessageSquareCode, count: repliedCount },
          { id: 'mcp-settings', label: 'Admin Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                padding: '0.75rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={16} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#c7d2fe' : 'var(--text-dim)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '10px',
                  fontSize: '0.72rem'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
