import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  Mail, 
  Server, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  Globe, 
  Send,
  Zap,
  RefreshCw,
  Lock,
  DollarSign
} from 'lucide-react';

export default function AdminSettingsModal({ 
  isOpen, 
  onClose, 
  geminiApiKey, 
  onSaveGeminiKey,
  stitchToken,
  onSaveStitchToken,
  smtpConfig,
  onSaveSmtpConfig,
  previewDomain,
  onSavePreviewDomain,
  packagePrice,
  onSavePackagePrice
}) {
  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey || '');
  const [stitchTokenInput, setStitchTokenInput] = useState(stitchToken || '');
  const [domainInput, setDomainInput] = useState(previewDomain || '{slug}.preview.codeair.com');
  const [priceInput, setPriceInput] = useState(packagePrice || '₹14,999');
  
  // SMTP Config state
  const [smtp, setSmtp] = useState(smtpConfig || {
    host: 'smtp.gmail.com',
    port: '587',
    security: 'TLS',
    username: '',
    password: '',
    senderName: 'Codeair Software Solutions'
  });

  const [activeTab, setActiveTab] = useState('smtp');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSmtpChange = (field, value) => {
    setSmtp(prev => ({ ...prev, [field]: value }));
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);

    try {
      const res = await fetch('http://localhost:3001/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtp)
      });

      const data = await res.json();
      setTestingSmtp(false);

      if (data.success) {
        setSmtpTestResult({
          success: true,
          message: data.message || `SMTP Handshake Verified! Connected to ${smtp.host}:${smtp.port} cleanly. Real emails will be sent.`
        });
      } else {
        setSmtpTestResult({
          success: false,
          message: data.error || `SMTP Test Error: Could not connect to ${smtp.host}:${smtp.port}. Please check credentials.`
        });
      }
    } catch (err) {
      setTestingSmtp(false);
      setSmtpTestResult({
        success: false,
        message: `Make sure 'node server.js' is running on port 3001 for live SMTP socket verification. (${err.message})`
      });
    }
  };

  const handleSaveAll = () => {
    onSaveGeminiKey(geminiKeyInput);
    onSaveStitchToken(stitchTokenInput);
    onSaveSmtpConfig(smtp);
    if (onSavePreviewDomain) onSavePreviewDomain(domainInput);
    if (onSavePackagePrice) onSavePackagePrice(priceInput);

    setStatusMsg("All Configuration & SMTP Connection Settings Saved Successfully!");
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '780px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Server size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Admin & Connection Settings
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Codeair Software Solutions • SMTP Email Gateway, Domain & Pricing Config
            </p>
          </div>
        </div>

        {/* Config Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('smtp')}
            style={{
              flex: 1,
              background: activeTab === 'smtp' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: activeTab === 'smtp' ? '#fff' : 'var(--text-muted)',
              border: activeTab === 'smtp' ? '1px solid #10b981' : 'none',
              padding: '0.65rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Mail size={16} color="#34d399" />
            1. Real SMTP Server Configuration
          </button>

          <button
            onClick={() => setActiveTab('gemini_stitch')}
            style={{
              flex: 1,
              background: activeTab === 'gemini_stitch' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: activeTab === 'gemini_stitch' ? '#fff' : 'var(--text-muted)',
              border: activeTab === 'gemini_stitch' ? '1px solid #6366f1' : 'none',
              padding: '0.65rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Sparkles size={16} color="#818cf8" />
            2. API Keys, Domain & Pricing Config
          </button>
        </div>

        {/* Tab 1: Real SMTP Email Server Settings */}
        {activeTab === 'smtp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: '#6ee7b7',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              <Info size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>📧 REAL SMTP EMAIL DISPATCHING SETUP:</strong><br />
                Real emails bhejne ke liye apni actual SMTP credentials daalein. Gmail users: Host me <code style={{ color: '#fff' }}>smtp.gmail.com</code>, Port <code style={{ color: '#fff' }}>587</code> aur Gmail ka <strong>"App Password"</strong> use karein.
              </div>
            </div>

            {/* SMTP Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">SMTP Server Host:</label>
                <input 
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={smtp.host}
                  onChange={(e) => handleSmtpChange('host', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Port & Security Protocol:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input 
                    type="text"
                    placeholder="587"
                    value={smtp.port}
                    onChange={(e) => handleSmtpChange('port', e.target.value)}
                    className="form-input"
                  />
                  <select
                    value={smtp.security}
                    onChange={(e) => handleSmtpChange('security', e.target.value)}
                    className="form-input"
                  >
                    <option value="TLS">TLS (587)</option>
                    <option value="SSL">SSL (465)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Sender Email / Username:</label>
                <input 
                  type="email"
                  placeholder="e.g. sales@yourdomain.com"
                  value={smtp.username}
                  onChange={(e) => handleSmtpChange('username', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">SMTP Password / App Password:</label>
                <input 
                  type="password"
                  placeholder="Enter App Password"
                  value={smtp.password}
                  onChange={(e) => handleSmtpChange('password', e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Sender Name (Appears in inbox):</label>
                <input 
                  type="text"
                  placeholder="Codeair Software Solutions"
                  value={smtp.senderName}
                  onChange={(e) => handleSmtpChange('senderName', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Test Connection Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button 
                onClick={handleTestSmtp}
                disabled={testingSmtp}
                className="btn-secondary"
              >
                {testingSmtp ? (
                  <>
                    <RefreshCw size={15} className="pulse-glow" />
                    Testing Real SMTP Handshake...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Test Real SMTP Connection
                  </>
                )}
              </button>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                SMTP Gateway: <strong style={{ color: '#10b981' }}>Node.js Express (Port 3001)</strong>
              </span>
            </div>

            {/* SMTP Test Result Banner */}
            {smtpTestResult && (
              <div style={{
                padding: '0.75rem 1rem',
                background: smtpTestResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: smtpTestResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: smtpTestResult.success ? '#6ee7b7' : '#fca5a5',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {smtpTestResult.success ? <Check size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
                {smtpTestResult.message}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Gemini, Stitch, Domain & Pricing Config */}
        {activeTab === 'gemini_stitch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Gemini API Key */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c4b5fd', margin: 0 }}>
                  <Key size={15} />
                  Gemini API Key (For AI Web Search & Web Page Generation)
                </label>
                
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.78rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Globe size={13} />
                  Get Free Key from Google AI Studio ↗
                </a>
              </div>

              <input 
                type="password"
                placeholder="AIzaSy... (Enter your Gemini API Key)"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}
              />
            </div>

            {/* Google Stitch MCP Token */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc' }}>
                <ShieldCheck size={15} />
                Google Stitch MCP Global Token
              </label>
              
              <input 
                type="text"
                placeholder="stitch_live_sk_..."
                value={stitchTokenInput}
                onChange={(e) => setStitchTokenInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}
              />
            </div>

            {/* Dynamic Landing Page Subdomain Pattern */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                <Globe size={15} />
                Landing Page Dynamic Preview Pattern
              </label>
              
              <input 
                type="text"
                placeholder="{slug}.preview.codeair.com or http://localhost:5173/preview/{id}"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}
              />
            </div>

            {/* Package Base Price Config */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde047' }}>
                <DollarSign size={15} />
                Codeair Base Service Package Pricing (Used in AI Smart Responder)
              </label>
              
              <input 
                type="text"
                placeholder="e.g. ₹14,999 or $499"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

          </div>
        )}

        {/* Save Status Notification */}
        {statusMsg && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} />
            {statusMsg}
          </div>
        )}

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSaveAll} className="btn-primary">
            <Sparkles size={16} />
            Save & Connect Credentials
          </button>
        </div>

      </div>
    </div>
  );
}
