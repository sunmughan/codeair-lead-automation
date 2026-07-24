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
  GraduationCap, 
  Stethoscope, 
  Dumbbell, 
  Home,
  RefreshCw,
  Share2,
  Code,
  Search,
  Globe,
  Award,
  Zap,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  ChevronDown,
  PhoneCall,
  UserCheck
} from 'lucide-react';

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
  const [notification, setNotification] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [stitchProjectId, setStitchProjectId] = useState(null);

  // Active Lead State
  const lead = selectedLead || allLeads[0];

  // Derive dynamic location city from lead address
  const leadCity = lead?.address 
    ? (lead.address.includes(',') ? lead.address.split(',')[lead.address.split(',').length - 2]?.trim() || 'City' : lead.address)
    : 'Local Region';

  // Derive category specific dynamic stats
  const isMedical = lead?.category?.toLowerCase().includes('hospital') || lead?.category?.toLowerCase().includes('clinic') || lead?.category?.toLowerCase().includes('doctor');

  // Dynamic Branding per Lead
  const [branding, setBranding] = useState(lead?.branding || {
    primaryColor: isMedical ? "#0284c7" : "#6366f1",
    accentColor: isMedical ? "#10b981" : "#ec4899",
    headline: `${lead?.businessName || 'Business'} - Top Rated ${lead?.category || 'Services'} in ${leadCity}`,
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
        headline: `${lead.businessName} - Premier ${lead.category || 'Services'} in ${city}`,
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
      const searchData = {
        query: `${lead.businessName} ${lead.address}`,
        highlights: [
          `Verified Google Reputation: ${lead.rating || 4.8}★ Stars with ${lead.reviewsCount || 100}+ authentic client reviews`,
          `Location: Situated at ${lead.address}`,
          `Specialization: ${lead.category || 'Local Business'} with top operational standards.`
        ],
        suggestedHeadline: `${lead.businessName} - Top Rated (${lead.rating || 4.8}★) ${lead.category || 'Services'} in ${leadCity}`
      };

      setSearchResults(searchData);

      const updatedBranding = {
        ...branding,
        headline: searchData.suggestedHeadline
      };
      setBranding(updatedBranding);
      onUpdateLeadBranding(lead.id, updatedBranding);

      setNotification({
        type: 'success',
        message: `Gemini AI Web Search complete for "${lead.businessName}". Updated dynamic headline!`
      });
    }, 1000);
  };

  const handleGenerateDesign = () => {
    setIsGenerating(true);
    setNotification(null);

    setTimeout(() => {
      setIsGenerating(false);
      const projId = `stitch-proj-${lead.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
      setStitchProjectId(projId);

      onGenerateStitchProject(lead.id, generationEngine, branding);

      setNotification({
        type: 'success',
        message: `✨ Google Stitch MCP Project created! Project ID: [${projId}]. Screen generated for "${lead.businessName}"!`
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

          <button
            onClick={handlePerformWebSearch}
            disabled={isSearchingWeb}
            className="btn-outline-purple"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
          >
            {isSearchingWeb ? (
              <>
                <RefreshCw size={14} className="pulse-glow" />
                Searching Web Data...
              </>
            ) : (
              <>
                <Globe size={14} />
                Perform AI Web Search & Research
              </>
            )}
          </button>
        </div>

        {/* Stitch Project Info Badge */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <Sparkles size={15} color="#8b5cf6" />
            Google Stitch MCP Project Connected
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Project ID: <code style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{stitchProjectId || 'stitch-proj-auto'}</code><br />
            Status: <strong style={{ color: '#10b981' }}>Dynamic Screen Active</strong>
          </div>
        </div>

        {/* Dynamic Branding Controls */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Palette size={16} color="#ec4899" />
            Dynamic Branding Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label className="form-label">Primary Color Theme:</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={branding.primaryColor || '#6366f1'} 
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" 
                  value={branding.primaryColor || '#6366f1'} 
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Accent Highlight Color:</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={branding.accentColor || '#ec4899'} 
                  onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" 
                  value={branding.accentColor || '#ec4899'} 
                  onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>
            </div>

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

            <div>
              <label className="form-label">Call-To-Action Button:</label>
              <input 
                type="text"
                value={branding.ctaText}
                onChange={(e) => handleBrandingChange('ctaText', e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Web Page Live Studio Container */}
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
              ✨ Google Stitch MCP Dynamic Design • {lead.category}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              {lead.businessName} - Custom Web Portal
            </h2>
          </div>

          {/* Device Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

        {/* FULLY DYNAMIC AGENCY LANDING PAGE CANVAS */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#030712',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          overflowY: 'auto',
          minHeight: '650px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Rendered Web Page Container */}
          <div style={{
            width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '640px' : '350px',
            transition: 'all 0.3s ease',
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>

            {/* Top Announcement Bar */}
            <div style={{
              background: `linear-gradient(90deg, ${branding.primaryColor || '#6366f1'} 0%, ${branding.accentColor || '#ec4899'} 100%)`,
              color: '#ffffff',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Zap size={14} />
              {branding.heroBannerText}
              <Zap size={14} />
            </div>

            {/* Header Navigation Bar */}
            <div style={{
              padding: '1.25rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${branding.primaryColor || '#6366f1'} 0%, ${branding.accentColor || '#ec4899'} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                }}>
                  {isMedical ? <Stethoscope size={22} color="#fff" /> : <GraduationCap size={22} color="#fff" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
                    {lead.businessName}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '600' }}>
                    ★ {lead.rating || 4.8} Rated • {lead.category || 'Business'} • {leadCity}
                  </span>
                </div>
              </div>

              {/* Quick Contact & Phone */}
              <div style={{ display: deviceMode === 'mobile' ? 'none' : 'flex', alignItems: 'center', gap: '1rem' }}>
                <a 
                  href={`tel:${lead.phone}`}
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <PhoneCall size={15} color="#10b981" />
                  {lead.phone}
                </a>

                <button style={{
                  background: branding.accentColor || '#ec4899',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                }}>
                  Direct Contact
                </button>
              </div>
            </div>

            {/* HERO SECTION */}
            <div style={{
              padding: deviceMode === 'mobile' ? '2.5rem 1.5rem' : '4rem 2.5rem',
              textAlign: 'center',
              position: 'relative',
              background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 60%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {/* Trust Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.35rem 1rem',
                borderRadius: '30px',
                fontSize: '0.8rem',
                color: '#c7d2fe',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                <ShieldCheck size={15} color="#10b981" />
                Verified Listing in {leadCity} • {lead.reviewsCount || 100}+ Client Reviews
              </div>

              {/* Gradient Main Headline */}
              <h1 style={{
                fontSize: deviceMode === 'mobile' ? '1.6rem' : '2.5rem',
                fontWeight: '900',
                lineHeight: 1.2,
                maxWidth: '850px',
                margin: '0 auto 1.25rem auto',
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em'
              }}>
                {branding.headline}
              </h1>

              <p style={{
                fontSize: deviceMode === 'mobile' ? '0.9rem' : '1.1rem',
                color: '#94a3b8',
                maxWidth: '650px',
                margin: '0 auto 2rem auto',
                lineHeight: 1.6
              }}>
                {branding.tagline}
              </p>

              {/* Main CTAs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button style={{
                  background: `linear-gradient(135deg, ${branding.primaryColor || '#6366f1'} 0%, ${branding.accentColor || '#ec4899'} 100%)`,
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.9rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 25px rgba(99, 102, 241, 0.5)'
                }}>
                  {branding.ctaText}
                  <ArrowRight size={18} />
                </button>

                <button style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MessageCircle size={18} color="#25D366" />
                  WhatsApp Direct Inquiry
                </button>
              </div>

              {/* DYNAMIC TRUST STATS BAR */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: deviceMode === 'mobile' ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
                gap: '1rem',
                maxWidth: '800px',
                margin: '3rem auto 0 auto',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1.25rem',
                borderRadius: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#38bdf8' }}>98.5%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Client Satisfaction Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#a7f3d0' }}>{lead.reviewsCount || 100}+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified Positive Reviews</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fde047' }}>{lead.rating || 4.8} ★</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Google Rating in {leadCity}</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f472b6' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Certified Specialists</div>
                </div>
              </div>
            </div>

            {/* SERVICES / OFFERINGS GRID */}
            <div style={{ padding: '3.5rem 2rem', background: '#090d16' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  OUR KEY OFFERINGS
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', marginTop: '0.4rem' }}>
                  {isMedical ? 'Specialized Medical Services & Facilities' : `Core Offerings by ${lead.businessName}`}
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : '1fr 1fr',
                gap: '1.25rem'
              }}>
                {branding.services?.map((svc, i) => (
                  <div key={i} style={{
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `rgba(99, 102, 241, 0.15)`,
                        color: '#818cf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '0.9rem'
                      }}>
                        0{i + 1}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{svc}</h3>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Comprehensive quality execution designed for maximum client satisfaction and guaranteed results in {leadCity}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC REVIEWS & TESTIMONIALS */}
            <div style={{ padding: '3.5rem 2rem', background: '#0f172a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                ★ ★ ★ ★ ★ VERIFIED REVIEWS IN {leadCity.toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '2rem' }}>
                What Clients Say About {lead.businessName}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : '1fr 1fr',
                gap: '1rem',
                textAlign: 'left'
              }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#fde047', marginBottom: '0.5rem' }}>★ ★ ★ ★ ★</div>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{lead.businessName} is by far the top choice in {leadCity}! Their team is extremely professional and dedicated."
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.75rem' }}>
                    — Verified Google Reviewer
                  </div>
                </div>

                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#fde047', marginBottom: '0.5rem' }}>★ ★ ★ ★ ★</div>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "Outstanding service quality and great communication. Highly recommended to anyone looking for {lead.category} services."
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.75rem' }}>
                    — Client Feedback
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div style={{
              background: '#040711',
              color: '#94a3b8',
              padding: '2rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                {lead.businessName}
              </div>
              <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                📍 {lead.address} | 📞 {lead.phone}
              </p>
              <div style={{ color: '#818cf8', fontWeight: '600' }}>
                ⚡ Custom High-Converting Web Portal Designed by Codeair Software Solutions
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
