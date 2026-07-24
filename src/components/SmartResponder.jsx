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
  HelpCircle,
  CornerDownRight
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
    "Hi Codeair Team, we saw the custom website HTML file you sent! We really liked the design. Can you share details about your development package and hosting cost?"
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

  const handleProcessReply = () => {
    if (!clientReplyText.trim()) return;
    setIsAiProcessing(true);

    setTimeout(() => {
      setIsAiProcessing(false);
      onSimulateClientReply(lead.id, clientReplyText);
      setClientReplyText('');
    }, 1000);
  };

  const handleAddNote = () => {
    if (!manualNoteInput.trim()) return;
    onAddManualNote(lead.id, manualNoteInput);
    setManualNoteInput('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem' }}>
      
      {/* Left Column: Client Reply Simulator & Quick Prompts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Lead Selector */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c4b5fd' }}>
            <Building2 size={15} />
            Select Business Lead:
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
            Email: <strong style={{ color: '#38bdf8' }}>{lead.email}</strong>
          </div>
        </div>

        {/* Client Reply Simulator Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} color="#38bdf8" />
            Simulate Client Lead Reply
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            Simulate incoming emails from client leads to test how AI responds on behalf of Codeair.
          </p>

          {/* Quick Preset Replies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600' }}>QUICK TEST REPLIES:</span>
            {[
              "We loved the web page demo! What is the pricing and project duration?",
              "Can you add a student online admission form and parent login portal?",
              "Can we schedule a Zoom call tomorrow to discuss deployment?"
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setClientReplyText(preset)}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  color: '#94a3b8',
                  padding: '0.4rem 0.6rem',
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
                <Sparkles size={16} className="pulse-glow" />
                Formulating AI Smart Reply...
              </>
            ) : (
              <>
                <Bot size={16} />
                Receive Reply & Trigger AI Response
              </>
            )}
          </button>
        </div>

        {/* Add Manual Notes for Model Training */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={15} color="#ec4899" />
            Add Manual Inspection & Training Note
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
            Add feedback notes to refine AI response tone and keep record for Codeair team.
          </p>

          <input 
            type="text"
            placeholder="e.g. Approved AI reply tone; offer 10% discount on call"
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
            Save Inspection Note
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
              Individual Activity Notes & Interaction Log
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Detailed audit trail for <strong>{lead.businessName}</strong> ({lead.email})
            </p>
          </div>

          <span className="badge badge-replied">
            Total Log Entries: {lead.activityNotes?.length || 0}
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
              const isPitch = note.type === 'pitch_sent';

              return (
                <div 
                  key={note.id}
                  style={{
                    background: isClient 
                      ? 'rgba(56, 189, 248, 0.08)' 
                      : isAi 
                        ? 'rgba(16, 185, 129, 0.08)' 
                        : 'rgba(15, 23, 42, 0.6)',
                    border: isClient 
                      ? '1px solid rgba(56, 189, 248, 0.25)' 
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: isClient ? '#38bdf8' : isAi ? '#6ee7b7' : '#c4b5fd' }}>
                      {isClient && <User size={14} />}
                      {isAi && <Bot size={14} />}
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

                  {isAi && (
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <CornerDownRight size={12} />
                      Smart Response automatically recorded for Codeair team review & model training.
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
