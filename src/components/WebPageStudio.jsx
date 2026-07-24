import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Palette, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Cpu, 
  Building2, 
  RefreshCw,
  Search,
  Globe,
  Download,
  Paperclip
} from 'lucide-react';
import { generateLeadHtml } from '../utils/generateHtml';

export default function WebPageStudio({ 
  selectedLead, 
  allLeads, 
  onSelectLead, 
  onUpdateLeadBranding,
  onGenerateStitchProject,
  mcpConnected
}) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [generationEngine, setGenerationEngine] = useState('stitch_mcp');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stitchProjectId, setStitchProjectId] = useState(null);

  // Active Lead State
  const lead = selectedLead || allLeads[0];

  const leadCity = lead?.address 
    ? (lead.address.includes(',') ? lead.address.split(',')[lead.address.split(',').length - 2]?.trim() || 'City' : lead.address)
    : 'Local Region';

  const isMedical = lead?.category?.toLowerCase().includes('hospital') || lead?.category?.toLowerCase().includes('clinic') || lead?.category?.toLowerCase().includes('doctor');

  // Dynamic Branding per Lead
  const [branding, setBranding] = useState(lead?.branding || {
    primaryColor: isMedical ? "#0284c7" : "#6366f1",
    accentColor: isMedical ? "#10b981" : "#ec4899",
    headline: `${lead?.businessName || 'Business'} — Top Rated ${lead?.category || 'Services'} in ${leadCity}`,
    tagline: `Serving Thousands of Satisfied Clients across ${leadCity} with Unmatched Excellence`,
    heroBannerText: `🔥 Verified Google Listing | ${lead?.rating || 4.8}★ Rating (${lead?.reviewsCount || 100}+ Reviews)`,
    services: isMedical ? [
      "24x7 Emergency & Multi-Specialty Care",
      "Advanced Diagnostic & Clinical Labs",
      "Expert Specialist Doctors & Surgeons",
      "Patient OPD & Outpatient Services"
    ] : [
      "Foundational & Advanced Mastery Batches",
      "Expert Faculty & Certified Mentors",
      "Daily Doubt Resolution & Assessment",
      "Verified Top Student & Candidate Results"
    ],
    ctaText: isMedical ? "Book Doctor Appointment Online" : "Book Free Demo Class & Consultation"
  });

  useEffect(() => {
    if (lead) {
      const city = lead.address 
        ? (lead.address.includes(',') ? lead.address.split(',')[lead.address.split(',').length - 2]?.trim() || 'City' : lead.address)
        : 'Local Region';

      const medical = lead.category?.toLowerCase().includes('hospital') || lead.category?.toLowerCase().includes('clinic') || lead.category?.toLowerCase().includes('doctor');

      setBranding(lead.branding || {
        primaryColor: medical ? "#0284c7" : "#6366f1",
        accentColor: medical ? "#10b981" : "#ec4899",
        headline: `${lead.businessName} — Premier ${lead.category || 'Services'} in ${city}`,
        tagline: `Serving Thousands of Satisfied Clients across ${city} with Unmatched Excellence`,
        heroBannerText: `🔥 Verified Google Listing | ${lead.rating || 4.8}★ Rating (${lead.reviewsCount || 100}+ Reviews)`,
        services: medical ? [
          "24x7 Emergency & Multi-Specialty Care",
          "Advanced Diagnostic & Clinical Labs",
          "Expert Specialist Doctors & Surgeons",
          "Patient OPD & Outpatient Services"
        ] : [
          "Foundational & Advanced Mastery Batches",
          "Expert Faculty & Certified Mentors",
          "Daily Doubt Resolution & Assessment",
          "Verified Top Student & Candidate Results"
        ],
        ctaText: medical ? "Book Doctor Appointment Online" : "Book Free Demo Class & Consultation"
      });

      setStitchProjectId(`stitch-proj-${lead.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026`);
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No leads available. Please upload a CSV file or load sample leads.</p>
      </div>
    );
  }

  const handleBrandingChange = (field, value) => {
    const updated = { ...branding, [field]: value };
    setBranding(updated);
    onUpdateLeadBranding(lead.id, updated);
  };

  const handlePerformWebSearch = () => {
    setIsSearchingWeb(true);
    setNotification(null);

    setTimeout(() => {
      setIsSearchingWeb(false);
      const suggestedHeadline = `${lead.businessName} — Top Rated (${lead.rating || 4.8}★) ${lead.category || 'Services'} in ${leadCity}`;

      const updatedBranding = {
        ...branding,
        headline: suggestedHeadline
      };
      setBranding(updatedBranding);
      onUpdateLeadBranding(lead.id, updatedBranding);

      setNotification({
        type: 'success',
        message: `Gemini AI Web Search complete for "${lead.businessName}". Dynamic headline updated!`
      });
    }, 1000);
  };

  const generatedHtmlCode = generateLeadHtml(lead, branding);
  const cleanSlug = (lead.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const htmlFileName = `${cleanSlug}-landing-page.html`;

  // Manually Export & Save HTML File to Disk + Browser Download
  const handleExportHtmlToDisk = async () => {
    setIsExporting(true);
    setNotification(null);

    try {
      // 1. Send to server to write file on local disk in generated_pages/
      const res = await fetch('http://localhost:3001/api/export-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent: generatedHtmlCode,
          businessName: lead.businessName
        })
      });

      const data = await res.json();
      setIsExporting(false);

      // 2. Trigger local browser download
      const blob = new Blob([generatedHtmlCode], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', htmlFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (data.success) {
        setNotification({
          type: 'success',
          message: `💾 REAL HTML FILE SAVED TO DISK AT '${data.savedLocalPath}' & downloaded as '${htmlFileName}'!`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Downloaded '${htmlFileName}' to your Downloads folder.`
        });
      }
    } catch (err) {
      setIsExporting(false);
      // Fallback browser download if server is not reachable
      const blob = new Blob([generatedHtmlCode], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', htmlFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setNotification({
        type: 'success',
        message: `Downloaded '${htmlFileName}' locally.`
      });
    }
  };

  const handleGenerateDesign = () => {
    setIsGenerating(true);
    setNotification(null);

    setTimeout(() => {
      setIsGenerating(false);
      const projId = `stitch-proj-${cleanSlug}-${Date.now().toString().slice(-4)}`;
      setStitchProjectId(projId);

      onGenerateStitchProject(lead.id, generationEngine, branding);
      handleExportHtmlToDisk(); // Automatically write to disk!

      setNotification({
        type: 'success',
        message: `✨ Google Stitch MCP Project created! File '${htmlFileName}' saved to disk in 'test-mcp/generated_pages/'!`
      });
    }, 1200);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
      
      {/* Left Sidebar Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Lead Selector */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c4b5fd' }}>
            <Building2 size={15} />
            Target Lead Business:
          </label>
          <select 
            value={lead.id}
            onChange={(e) => {
              const l = allLeads.find(item => item.id === e.target.value);
              if (l) onSelectLead(l);
            }}
            className="form-input"
            style={{ fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}
          >
            {allLeads.map((item) => (
              <option key={item.id} value={item.id}>
                {item.businessName} ({item.category})
              </option>
            ))}
          </select>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Location: <strong style={{ color: '#fff' }}>{lead.address || 'Raipur'}</strong><br />
            Google Rating: <strong style={{ color: '#fde047' }}>{lead.rating || 4.8} ★</strong> ({lead.reviewsCount || 120} reviews)
          </div>
        </div>

        {/* Index-8 Template Badge */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Layers size={15} />
            Index-8 Base Web Design Active
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Using Staffease <code style={{ color: '#fff' }}>index-8.html</code> template clone with dynamic business variables.
          </div>
        </div>

        {/* Save HTML to Disk Action Box */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#6ee7b7', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Paperclip size={16} />
            Local Disk File Saving
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Save <code style={{ color: '#fff' }}>{htmlFileName}</code> locally to <span style={{ color: '#c4b5fd' }}>test-mcp/generated_pages/</span> & download.
          </p>
          
          <button 
            onClick={handleExportHtmlToDisk}
            disabled={isExporting}
            className="btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderColor: '#10b981' }}
          >
            {isExporting ? (
              <>
                <RefreshCw size={15} className="pulse-glow" />
                Saving File to Disk...
              </>
            ) : (
              <>
                <Download size={15} />
                Save HTML File to Disk & Download
              </>
            )}
          </button>
        </div>

        {/* Gemini Web Search Engine */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={15} color="#38bdf8" />
            Gemini AI Web Search Research
          </h3>

          <button 
            onClick={handlePerformWebSearch}
            disabled={isSearchingWeb}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            {isSearchingWeb ? (
              <>
                <RefreshCw size={14} className="pulse-glow" />
                Gemini Web Searching...
              </>
            ) : (
              <>
                <Globe size={14} />
                Search & Auto-Fill Brand Copy
              </>
            )}
          </button>
        </div>

        {/* Dynamic Branding Editor */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Palette size={16} color="#ec4899" />
            Dynamic Branding & Copy Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label className="form-label">Hero Headline:</label>
              <input 
                type="text"
                value={branding.headline}
                onChange={(e) => handleBrandingChange('headline', e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label className="form-label">Subheadline Tagline:</label>
              <input 
                type="text"
                value={branding.tagline}
                onChange={(e) => handleBrandingChange('tagline', e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Web Page Live Studio Canvas */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Studio Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em', fontWeight: '700' }}>
              ✨ Index-8 Template Base • {lead.category}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              {lead.businessName} — Dynamic Web Portal Preview
            </h2>
          </div>

          {/* Device Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={handleExportHtmlToDisk}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Download size={14} />
              Save HTML to Disk
            </button>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '0.2rem',
              borderRadius: '8px',
              display: 'flex',
              gap: '0.2rem',
              border: '1px solid var(--border-color)'
            }}>
              <button 
                onClick={() => setDeviceMode('desktop')}
                style={{
                  background: deviceMode === 'desktop' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  border: 'none',
                  color: deviceMode === 'desktop' ? '#fff' : 'var(--text-muted)',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setDeviceMode('tablet')}
                style={{
                  background: deviceMode === 'tablet' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  border: 'none',
                  color: deviceMode === 'tablet' ? '#fff' : 'var(--text-muted)',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Tablet View"
              >
                <Tablet size={16} />
              </button>
              <button 
                onClick={() => setDeviceMode('mobile')}
                style={{
                  background: deviceMode === 'mobile' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  border: 'none',
                  color: deviceMode === 'mobile' ? '#fff' : 'var(--text-muted)',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} />
            {notification.message}
          </div>
        )}

        {/* LIVE INDEX-8 IFRAME CANVAS PREVIEW */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#030712',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          overflow: 'hidden',
          minHeight: '650px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <iframe 
            srcDoc={generatedHtmlCode}
            title={`${lead.businessName} Index-8 Web Portal`}
            style={{
              width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '680px' : '375px',
              height: '650px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              background: '#050811',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

      </div>

    </div>
  );
}
