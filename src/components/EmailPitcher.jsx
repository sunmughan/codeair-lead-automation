import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  Clock, 
  Building2,
  Server,
  Paperclip,
  Check,
  Zap,
  Globe,
  ExternalLink,
  ShieldCheck,
  Send,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export default function EmailPitcher({ 
  selectedLead, 
  allLeads, 
  onSelectLead, 
  onTriggerFollowUp,
  smtpConfig
}) {
  const lead = selectedLead || allLeads[0];

  if (!lead) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No leads available. Please upload a CSV file or load sample leads.</p>
      </div>
    );
  }

  const htmlFileName = `${(lead.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html`;
  const isSent = lead.status === 'sent' || lead.status === 'replied';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem' }}>
      
      {/* Left Column: Lead Picker & Automatic Campaign Monitor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Select Lead */}
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

          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Recipient: <strong style={{ color: '#38bdf8' }}>{lead.email}</strong>
          </div>
        </div>

        {/* 100% Zero-Touch Automation Badge */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Zap size={18} color="#10b981" />
            100% Zero-Touch Email Automation
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            No manual button click required. Emails are automatically generated, attached with physical <code style={{ color: '#fff' }}>.html</code> files from <span style={{ color: '#c4b5fd' }}>generated_pages/</span>, and dispatched over SMTP immediately upon CSV import.
          </p>
        </div>

        {/* Real Local File Attachment Info */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Paperclip size={15} />
            Physical Local File Attachment
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            File Name: <code style={{ color: '#fff', fontFamily: 'monospace' }}>{htmlFileName}</code><br />
            Saved Directory: <span style={{ color: '#c4b5fd' }}>test-mcp/generated_pages/</span>
          </div>
        </div>

        {/* Live SMTP Server Status */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Server size={15} color="#38bdf8" />
            Connected SMTP Gateway
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Host: <strong style={{ color: '#fff' }}>{smtpConfig?.host || 'smtp.gmail.com'}:{smtpConfig?.port || '587'}</strong><br />
            Sender Name: <strong style={{ color: '#c4b5fd' }}>{smtpConfig?.senderName || 'Codeair Software Solutions'}</strong>
          </div>
        </div>

        {/* Automated Follow-Up Sequencer */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="#f59e0b" />
            Automated Follow-Up Sequencer
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              background: isSent ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.6)',
              border: isSent ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontWeight: '700', color: isSent ? '#6ee7b7' : '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {isSent ? <CheckCircle2 size={15} color="#10b981" /> : <Clock size={15} />}
                Stage 1: Pitch Email & HTML File Attachment
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {isSent ? '🟢 AUTOMATICALLY DISPATCHED OVER SMTP' : '⏳ Auto-Dispatching...'}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontWeight: '600', color: '#fff' }}>
                Stage 2: Day 3 Automated Follow-Up
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Triggers automatically if no client reply in 72h
              </div>
              <button 
                onClick={() => onTriggerFollowUp(lead.id, "Follow-Up #1 (Day 3)")}
                className="btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Trigger Immediate Follow-Up Remind
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Live Automated Email Delivery Monitor */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail color="#10b981" size={24} />
              Live Automated Email Delivery & Audit Dashboard
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real-time audit log of automatically delivered emails with attached <code style={{ color: '#10b981' }}>{htmlFileName}</code> files.
            </p>
          </div>

          <div style={{
            background: isSent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: isSent ? '#6ee7b7' : '#fcd34d',
            border: isSent ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {isSent ? <CheckCircle2 size={16} /> : <RefreshCw size={16} className="pulse-glow" />}
            {isSent ? '🟢 AUTOMATICALLY SENT VIA SMTP' : '⏳ AUTO-PROCESSING'}
          </div>
        </div>

        {/* Automated Email Details Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ margin: 0, color: 'var(--text-muted)' }}>Target Business Lead:</label>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>
                {lead.businessName}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ margin: 0, color: 'var(--text-muted)' }}>Recipient Email:</label>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.2rem' }}>
                {lead.email}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <label className="form-label" style={{ margin: 0, color: 'var(--text-muted)' }}>Dispatched Subject Line:</label>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>
              {lead.pitchEmail?.subject || `Customized Web Portal & Growth Engine for ${lead.businessName}`}
            </div>
          </div>

          <div style={{ flex: 1, background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <label className="form-label" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Automated Pitch Body Content:</label>
            <div style={{
              flex: 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: '1.6',
              fontSize: '0.88rem',
              color: '#e2e8f0',
              whiteSpace: 'pre-line',
              background: '#090d16',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {lead.pitchEmail?.body || `Dear ${lead.businessName} Team,\n\nGreetings from Codeair Software Solutions!\n\nWe noticed your top ratings on Google Maps and have designed a custom high-performance web portal for ${lead.businessName}.\n\nWe have attached your complete interactive web portal file (${htmlFileName}) directly to this email for your review.\n\nBest regards,\nCodeair Software Solutions`}
            </div>
          </div>

          {/* Attached Local File Receipt */}
          <div style={{
            padding: '0.85rem 1.1rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#10b981" />
              <span>
                Physical HTML File Saved & Attached: <strong>{htmlFileName}</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
              Disk Path: <code>test-mcp/generated_pages/{htmlFileName}</code>
            </span>
          </div>

          {/* Delivery Audit Notice */}
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={16} />
            <span>
              <strong>Zero-Touch Automated Delivery:</strong> This email was automatically dispatched over SMTP by the Google Stitch & Gemini MCP automation pipeline. No manual send click was required.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
