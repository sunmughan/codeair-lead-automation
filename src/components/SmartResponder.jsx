import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Bot, 
  Clock, 
  Building2, 
  FileText, 
  PlusCircle, 
  Tag, 
  CornerDownRight,
  Palette,
  Paperclip,
  RefreshCw
} from 'lucide-react';

export default function SmartResponder({ 
  selectedLead, 
  allLeads, 
  onSelectLead, 
  onSimulateClientReply,
  onAddManualNote
}) {
  const lead = selectedLead || allLeads[0];

  const [clientReplyText, setClientReplyText] = useState(
    "Hi Codeair Team, we don't like the current color scheme. Please redesign the webpage with a modern blue theme and update the headline to focus on 24x7 Emergency OPD Care."
  );

  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [manualNoteInput, setManualNoteInput] = useState('');

  if (!lead) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No leads available. Please upload a CSV file or load sample leads.</p>
      </div>
    );
  }

  const handleProcessReply = async () => {
    if (!clientReplyText.trim()) return;
    setIsAiProcessing(true);

    await onSimulateClientReply(lead.id, clientReplyText);

    setIsAiProcessing(false);
    setClientReplyText('');
  };

  const handleAddNote = () => {
    if (!manualNoteInput.trim()) return;
    onAddManualNote(lead.id, manualNoteInput);
    setManualNoteInput('');
  };

  const cleanSlug = (lead.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const savedFileName = `${cleanSlug}-landing-page.html`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '1.5rem' }}>
      
      {/* Left Column: Client Reply Simulator & Quick Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Lead Selector */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c4b5fd' }}>
            <Building2 size={15} />
            Target Business Lead:
          </label>
          <select 
            value={lead.id}
            onChange={(e) => {
              const l = allLeads.find(item => item.id === e.target.value);
              if (l) onSelectLead(l);
            }}
            className="form-input"
            style={{ fontWeight: '600', color: '#fff' }}
          >
            {allLeads.map((item) => (
              <option key={item.id} value={item.id}>
                {item.businessName} ({item.status})
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Email: <strong style={{ color: '#38bdf8' }}>{lead.email}</strong><br />
            Saved File: <code style={{ color: '#6ee7b7' }}>generated_pages/{savedFileName}</code>
          </div>
        </div>

        {/* Client Reply Simulator Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} color="#38bdf8" />
            AI Auto-Responder & Re-Design Trigger
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            If a lead requests design changes, AI will automatically <strong>re-design the page</strong>, save the updated <code style={{ color: '#fff' }}>.html</code> file locally, and send an email reply with the new attachment via SMTP!
          </p>

          {/* Quick Preset Replies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: '700' }}>TEST AUTO-RESPONDER RE-DESIGN PRESETS:</span>
            {[
              "We don't like the current layout. Please change colors to blue & update headline for Emergency Care.",
              "Please redesign the landing page with a modern dark theme and update services list.",
              "We liked the demo! What is your final price and deployment timeline?"
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setClientReplyText(preset)}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  color: '#94a3b8',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                "{preset}"
              </button>
            ))}
          </div>

          <textarea
            value={clientReplyText}
            onChange={(e) => setClientReplyText(e.target.value)}
            rows={4}
            placeholder="Type incoming client email reply..."
            className="form-input"
            style={{ fontSize: '0.82rem', marginBottom: '0.8rem' }}
          />

          <button
            onClick={handleProcessReply}
            disabled={isAiProcessing || !clientReplyText.trim()}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isAiProcessing ? (
              <>
                <RefreshCw size={16} className="pulse-glow" />
                Auto-Redesigning & Dispatching Email...
              </>
            ) : (
              <>
                <Bot size={16} />
                Receive Reply & Trigger Auto-Redesign Pipeline
              </>
            )}
          </button>
        </div>

        {/* Add Manual Notes for Model Training */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={15} color="#ec4899" />
            Add Manual Audit Note
          </h3>
          <input 
            type="text"
            placeholder="e.g. Client requested medical blue theme; verified updated attachment"
            value={manualNoteInput}
            onChange={(e) => setManualNoteInput(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.8rem', marginBottom: '0.6rem' }}
          />

          <button 
            onClick={handleAddNote}
            disabled={!manualNoteInput.trim()}
            className="btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <PlusCircle size={14} />
            Save Audit Note
          </button>
        </div>

      </div>

      {/* Right Column: Timeline & Individual Activity Notes Log */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquareCode color="#10b981" size={22} />
              Auto-Responder & Interaction Audit Trail
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real-time activity log for <strong>{lead.businessName}</strong> ({lead.email})
            </p>
          </div>

          <span className="badge badge-replied">
            Total Entries: {lead.activityNotes?.length || 0}
          </span>
        </div>

        {/* Timeline Log Feed */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!lead.activityNotes || lead.activityNotes.length === 0) ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No activity logs recorded yet for this lead.
            </div>
          ) : (
            lead.activityNotes.map((note) => {
              const isClient = note.type === 'client_reply';
              const isAi = note.type === 'ai_smart_reply';
              const isRedesign = note.content.includes('Re-Design') || note.content.includes('redesigned');

              return (
                <div 
                  key={note.id}
                  style={{
                    background: isClient 
                      ? 'rgba(56, 189, 248, 0.08)' 
                      : isRedesign 
                        ? 'rgba(236, 72, 153, 0.12)' 
                        : isAi 
                          ? 'rgba(16, 185, 129, 0.08)' 
                          : 'rgba(15, 23, 42, 0.6)',
                    border: isClient 
                      ? '1px solid rgba(56, 189, 248, 0.25)' 
                      : isRedesign 
                        ? '1px solid rgba(236, 72, 153, 0.35)' 
                        : isAi 
                          ? '1px solid rgba(16, 185, 129, 0.25)' 
                          : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: isClient ? '#38bdf8' : isRedesign ? '#f472b6' : isAi ? '#6ee7b7' : '#c4b5fd' }}>
                      {isClient && <User size={14} />}
                      {isRedesign && <Palette size={14} />}
                      {!isClient && !isRedesign && isAi && <Bot size={14} />}
                      {!isClient && !isAi && <Clock size={14} />}
                      {note.author || 'System'}
                    </div>

                    <div style={{ color: 'var(--text-dim)' }}>
                      {note.timestamp}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </div>

                  {isRedesign && (
                    <div style={{ fontSize: '0.75rem', color: '#f472b6', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <Paperclip size={13} />
                      Updated HTML file written to disk & attached to outgoing SMTP reply email.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
