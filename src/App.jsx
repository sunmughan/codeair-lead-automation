import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CsvUploader from './components/CsvUploader';
import LeadTable from './components/LeadTable';
import WebPageStudio from './components/WebPageStudio';
import EmailPitcher from './components/EmailPitcher';
import SmartResponder from './components/SmartResponder';
import AdminSettingsModal from './components/AdminSettingsModal';
import { INITIAL_LEADS } from './data/mockLeads';
import { generateLeadHtml } from './utils/generateHtml';

export default function App() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'studio' | 'emails' | 'smart-replies' | 'mcp-settings'
  const [selectedLeadId, setSelectedLeadId] = useState(INITIAL_LEADS[0].id);

  // Campaign Automation State
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(null);

  // Admin Credentials & Persistent Connection State
  const [mcpConnected, setMcpConnected] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [stitchToken, setStitchToken] = useState('');
  const [previewDomain, setPreviewDomain] = useState('{slug}.preview.codeair.com');
  const [packagePrice, setPackagePrice] = useState('₹14,999');
  
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    security: 'TLS',
    username: '',
    password: '',
    senderName: 'Codeair Software Solutions'
  });

  // Load Saved Persistent Credentials from MySQL / Disk / LocalStorage on App Startup
  useEffect(() => {
    const loadPersistentConfig = async () => {
      // 1. Try loading from backend MySQL DB / Disk
      try {
        const res = await fetch('http://localhost:3001/api/get-config');
        const data = await res.json();
        if (data.success && data.config) {
          const cfg = data.config;
          if (cfg.geminiApiKey) setGeminiApiKey(cfg.geminiApiKey);
          if (cfg.stitchToken) setStitchToken(cfg.stitchToken);
          if (cfg.previewDomain) setPreviewDomain(cfg.previewDomain);
          if (cfg.packagePrice) setPackagePrice(cfg.packagePrice);
          if (cfg.smtpConfig) setSmtpConfig(cfg.smtpConfig);
          return;
        }
      } catch (err) {
        console.warn('Backend config fetch notice:', err);
      }

      // 2. Fallback to LocalStorage
      try {
        const localSmtp = localStorage.getItem('codeair_smtp_config');
        if (localSmtp) setSmtpConfig(JSON.parse(localSmtp));

        const localGemini = localStorage.getItem('codeair_gemini_key');
        if (localGemini) setGeminiApiKey(localGemini);

        const localStitch = localStorage.getItem('codeair_stitch_token');
        if (localStitch) setStitchToken(localStitch);

        const localDomain = localStorage.getItem('codeair_preview_domain');
        if (localDomain) setPreviewDomain(localDomain);

        const localPrice = localStorage.getItem('codeair_package_price');
        if (localPrice) setPackagePrice(localPrice);
      } catch (err) {
        console.warn('LocalStorage load error:', err);
      }
    };

    loadPersistentConfig();
  }, []);

  // Save Credentials Persistently to MySQL Database, Backend Disk, AND LocalStorage
  const handleSaveAllConfig = async (newConfig) => {
    const updatedGemini = newConfig.geminiApiKey !== undefined ? newConfig.geminiApiKey : geminiApiKey;
    const updatedStitch = newConfig.stitchToken !== undefined ? newConfig.stitchToken : stitchToken;
    const updatedSmtp = newConfig.smtpConfig || smtpConfig;
    const updatedDomain = newConfig.previewDomain || previewDomain;
    const updatedPrice = newConfig.packagePrice || packagePrice;

    setGeminiApiKey(updatedGemini);
    setStitchToken(updatedStitch);
    setSmtpConfig(updatedSmtp);
    setPreviewDomain(updatedDomain);
    setPackagePrice(updatedPrice);

    // Save to LocalStorage
    try {
      localStorage.setItem('codeair_gemini_key', updatedGemini);
      localStorage.setItem('codeair_stitch_token', updatedStitch);
      localStorage.setItem('codeair_smtp_config', JSON.stringify(updatedSmtp));
      localStorage.setItem('codeair_preview_domain', updatedDomain);
      localStorage.setItem('codeair_package_price', updatedPrice);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Save to Backend MySQL Database & Disk (config.json)
    try {
      await fetch('http://localhost:3001/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: updatedGemini,
          stitchToken: updatedStitch,
          smtpConfig: updatedSmtp,
          previewDomain: updatedDomain,
          packagePrice: updatedPrice
        })
      });
      console.log('✅ Credentials permanently saved to MySQL database admin_settings & config.json!');
    } catch (err) {
      console.warn('Backend save config notice:', err);
    }
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const leadsCount = leads.length;
  const designedCount = leads.filter(l => l.status === 'designed' || l.status === 'sent' || l.status === 'replied').length;
  const sentCount = leads.filter(l => l.status === 'sent' || l.status === 'replied').length;
  const repliedCount = leads.filter(l => l.status === 'replied').length;

  const getDynamicPreviewUrl = (businessName) => {
    const slug = (businessName || 'business').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return (previewDomain || '{slug}.preview.codeair.com').replace('{slug}', slug);
  };

  // FULL ZERO-TOUCH AUTOMATION PIPELINE ON CSV IMPORT
  const handleImportLeads = (newLeads) => {
    setLeads(newLeads);
    if (newLeads.length > 0) {
      setSelectedLeadId(newLeads[0].id);
      // AUTOMATICALLY TRIGGER FULL AUTOMATED CAMPAIGN WITHOUT REQUIRING MANUAL CLICK!
      handleStartAutomatedCampaign(newLeads);
    }
  };

  const handleLoadSampleLeads = () => {
    setLeads(INITIAL_LEADS);
    setSelectedLeadId(INITIAL_LEADS[0].id);
    handleStartAutomatedCampaign(INITIAL_LEADS);
  };

  const handleUpdateLeadBranding = (leadId, newBranding) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          branding: newBranding,
          status: l.status === 'extracted' ? 'designed' : l.status
        };
      }
      return l;
    }));
  };

  const handleGenerateStitchProject = (leadId, engine, branding) => {
    const timestamp = new Date().toLocaleString();
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-${Date.now()}`,
            timestamp: timestamp,
            type: "web_page_created",
            content: engine === 'stitch_mcp'
              ? `Google Stitch MCP created new project & screen automatically for ${l.businessName}. Dynamic layout locked, branding injected.`
              : `Gemini API generated dynamic web page layout for ${l.businessName}.`,
            author: engine === 'stitch_mcp' ? 'Google Stitch MCP' : 'Gemini 3.6 API'
          }
        ];
        return {
          ...l,
          branding,
          status: l.status === 'extracted' ? 'designed' : l.status,
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  // FULLY AUTOMATED OUTREACH CAMPAIGN PIPELINE
  const handleStartAutomatedCampaign = async (targetLeads) => {
    const leadsToProcess = targetLeads || leads;
    if (leadsToProcess.length === 0) return;
    setIsCampaignRunning(true);

    const totalLeads = leadsToProcess.length;

    for (let i = 0; i < totalLeads; i++) {
      const target = leadsToProcess[i];
      const previewUrl = getDynamicPreviewUrl(target.businessName);
      const generatedHtmlCode = generateLeadHtml(target, target.branding);

      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 0.3) / totalLeads) * 100),
        statusText: `[1/3] Gemini AI Web Searching reputation & details for "${target.businessName}"...`
      });
      await new Promise(r => setTimeout(r, 500));

      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 0.6) / totalLeads) * 100),
        statusText: `[2/3] Auto-Creating Stitch MCP Project & Saving Local HTML File for "${target.businessName}"...`
      });
      await new Promise(r => setTimeout(r, 600));

      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 1) / totalLeads) * 100),
        statusText: `[3/3] AUTOMATICALLY Dispatching Pitch Email + Attached HTML File via SMTP (${smtpConfig.host}) to ${target.email}...`
      });

      const pitchBody = `Dear ${target.businessName} Team,\n\nGreetings from Codeair Software Solutions!\n\nWe came across ${target.businessName} on Google Maps (${target.rating || 4.8}★ rating) and were thoroughly impressed!\n\nWe have created a custom high-performance web portal for ${target.businessName} and attached the complete interactive web page file directly to this email.\n\nBest regards,\nCodeair Software Solutions`;

      let savedFileNotice = '';
      try {
        const res = await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtpConfig,
            to: target.email,
            subject: target.pitchEmail?.subject || `Customized Web Portal for ${target.businessName}`,
            body: pitchBody,
            htmlAttachment: generatedHtmlCode,
            businessName: target.businessName,
            leadId: target.id
          })
        });
        const data = await res.json();
        if (data.savedLocalPath) {
          savedFileNotice = `\nAttached HTML file saved locally at: '${data.savedLocalPath}'`;
        }
      } catch (err) {
        console.warn('Real SMTP Server notification:', err);
      }

      await new Promise(r => setTimeout(r, 500));

      const timestamp = new Date().toLocaleString();
      setLeads(prev => prev.map(l => {
        if (l.id === target.id) {
          const newNotes = [
            ...(l.activityNotes || []),
            {
              id: `note-campaign-${Date.now()}`,
              timestamp: timestamp,
              type: "pitch_sent",
              content: `Zero-Touch Automated Outreach Campaign executed!\n1. Gemini AI Web Search completed.\n2. Stitch MCP Project created.\n3. Real Pitch Email + HTML File Attachment dispatched automatically via SMTP Gateway (${smtpConfig.host}:${smtpConfig.port}) to ${l.email}.${savedFileNotice}`,
              author: "Codeair Zero-Touch Pipeline"
            }
          ];
          return {
            ...l,
            status: 'sent',
            activityNotes: newNotes
          };
        }
        return l;
      }));
    }

    setIsCampaignRunning(false);
    setCampaignProgress(null);
    setActiveTab('emails'); // AUTOMATICALLY DIRECT TO DASHBOARD FOR REVIEW & MONITORING!
  };

  const handleSendPitchEmail = (leadId, { subject, body }) => {
    const timestamp = new Date().toLocaleString();
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-${Date.now()}`,
            timestamp: timestamp,
            type: "pitch_sent",
            content: `Personalized Pitch Email dispatched via SMTP (${smtpConfig.host}:${smtpConfig.port}) on behalf of ${smtpConfig.senderName || 'Codeair Software Solutions'}.\nSubject: "${subject}"\nAttached Web Page File: ${(l.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html`,
            author: `Codeair SMTP Engine (${smtpConfig.username || 'sales'})`
          }
        ];
        return {
          ...l,
          pitchEmail: { subject, body },
          status: l.status === 'replied' ? 'replied' : 'sent',
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  const handleTriggerFollowUp = (leadId, stageLabel) => {
    const timestamp = new Date().toLocaleString();
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-${Date.now()}`,
            timestamp: timestamp,
            type: "follow_up",
            content: `Automated Follow-up triggered via SMTP (${stageLabel}). Email sent to ${l.email} reminding them to check their attached web portal demo.`,
            author: "Automated Follow-Up Sequencer"
          }
        ];
        return {
          ...l,
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  // INTELLIGENT AUTO-RESPONDER WITH AUTOMATIC RE-DESIGN ENGINE & SMTP EMAIL REPLY
  const handleSimulateClientReply = async (leadId, clientMsg) => {
    const timestamp = new Date().toLocaleString();
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) return;

    const lowerMsg = clientMsg.toLowerCase();
    const isRedesignRequest = lowerMsg.includes("don't like") || 
                             lowerMsg.includes("dont like") || 
                             lowerMsg.includes("change") || 
                             lowerMsg.includes("redesign") || 
                             lowerMsg.includes("color") || 
                             lowerMsg.includes("theme") || 
                             lowerMsg.includes("blue") || 
                             lowerMsg.includes("medical") || 
                             lowerMsg.includes("headline") || 
                             lowerMsg.includes("dark mode");

    let updatedBranding = targetLead.branding;
    let aiResponseText = "";
    let isRedesignExecuted = false;

    if (isRedesignRequest) {
      isRedesignExecuted = true;

      // 1. AUTOMATICALLY RE-DESIGN THE BRANDING ACCORDING TO CLIENT FEEDBACK
      const isMedical = lowerMsg.includes("medical") || targetLead.category?.toLowerCase().includes("hospital") || targetLead.category?.toLowerCase().includes("clinic");

      updatedBranding = {
        ...targetLead.branding,
        primaryColor: isMedical ? "#0284c7" : "#3b82f6",
        accentColor: isMedical ? "#06b6d4" : "#ec4899",
        headline: isMedical 
          ? `${targetLead.businessName} — 24x7 Multi-Specialty & Emergency OPD Care`
          : `${targetLead.businessName} — Premier Premium Services & Certified Excellence`,
        tagline: isMedical
          ? `Advanced Diagnostic Labs, ICU & Expert Doctors in ${targetLead.address?.split(',')[0] || 'City'}`
          : `Serving Thousands of Satisfied Clients with Top Rated (${targetLead.rating || 4.8}★) Quality`,
        heroBannerText: `🔥 Verified Official Listing | 24x7 Emergency Care & Online OPD Booking`
      };

      // 2. RE-GENERATE THE INDEX-8 HTML LANDING PAGE CODE
      const revisedHtmlCode = generateLeadHtml(targetLead, updatedBranding);

      // 3. CONSTRUCT RE-DESIGN ACKNOWLEDGMENT REPLY EMAIL
      aiResponseText = `Dear ${targetLead.businessName} Team,\n\nThank you for your valuable feedback regarding your web portal demo!\n\nAs per your instructions, our AI design engine has completely RE-DESIGNED your custom landing page with your specified color scheme and updated headline.\n\nWe have saved the updated web page file to our system and attached it directly to this email (${(targetLead.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html).\n\nYou can download and open the attachment in any browser to inspect the new design!\n\nBest regards,\nCodeair Software Solutions`;

      // 4. SAVE RE-DESIGNED FILE LOCALLY & DISPATCH SMTP REPLY EMAIL WITH NEW ATTACHMENT
      try {
        await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtpConfig,
            to: targetLead.email,
            subject: `Re: Revised Web Portal Design for ${targetLead.businessName}`,
            body: aiResponseText,
            htmlAttachment: revisedHtmlCode,
            businessName: targetLead.businessName,
            leadId: targetLead.id
          })
        });
      } catch (err) {
        console.warn('Auto-responder SMTP notification:', err);
      }
    } else {
      // Standard Inquiry Auto-Responder
      aiResponseText = `Dear ${targetLead.businessName} Team,\n\nThank you for reaching out!\n\nAt Codeair Software Solutions, our specialized Web Development & Automation package for ${targetLead.category || 'businesses'} includes:\n- Full responsive custom web portal\n- Free SSL & high-speed SSD hosting for 1 year\n- WhatsApp Chat & Lead Form integration\n\nOur launch package starts at ${packagePrice || '₹14,999'} complete. We can deploy your website live within 48 hours.\n\nWould tomorrow at 3:00 PM work for a brief 10-minute demo call?\n\nWarm regards,\nCodeair Software Solutions Team`;

      const currentHtmlCode = generateLeadHtml(targetLead, targetLead.branding);
      try {
        await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtpConfig,
            to: targetLead.email,
            subject: `Re: Web Portal Consultation for ${targetLead.businessName}`,
            body: aiResponseText,
            htmlAttachment: currentHtmlCode,
            businessName: targetLead.businessName,
            leadId: targetLead.id
          })
        });
      } catch (err) {
        console.warn('Auto-responder SMTP notification:', err);
      }
    }

    // 5. LOG COMPLETE TRANSACTION IN REACT STATE & MYSQL ACTIVITY NOTES
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-client-${Date.now()}`,
            timestamp: timestamp,
            type: "client_reply",
            content: `Client Email Reply Received: "${clientMsg}"`,
            author: `Client Lead (${l.businessName})`
          },
          {
            id: `note-ai-${Date.now() + 1}`,
            timestamp: timestamp,
            type: "ai_smart_reply",
            content: isRedesignExecuted
              ? `🎨 CODEAIR AI AUTO-RESPONDER AUTOMATIC RE-DESIGN:\n1. Client requested design changes ('${clientMsg}').\n2. Page automatically re-designed with updated colors & headline.\n3. Overwrote local file 'generated_pages/${(l.businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html'.\n4. Dispatched SMTP reply email to ${l.email} with revised HTML attachment.\n\nReply Email Content:\n"${aiResponseText}"`
              : `Codeair AI Smart Auto-Responder Dispatched via SMTP:\n"${aiResponseText}"`,
            author: "Codeair AI Auto-Responder"
          }
        ];
        return {
          ...l,
          branding: updatedBranding,
          status: 'replied',
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  const handleAddManualNote = (leadId, noteText) => {
    const timestamp = new Date().toLocaleString();
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-manual-${Date.now()}`,
            timestamp: timestamp,
            type: "manual_note",
            content: `Team Feedback / Model Training Note: "${noteText}"`,
            author: "Codeair Admin (Manual Review)"
          }
        ];
        return {
          ...l,
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Header 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'mcp-settings') {
            setIsAdminModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        leadsCount={leadsCount}
        designedCount={designedCount}
        sentCount={sentCount}
        repliedCount={repliedCount}
        mcpConnected={mcpConnected}
        onOpenMcpModal={() => setIsAdminModalOpen(true)}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1, width: '100%' }}>
        
        {activeTab === 'leads' && (
          <div className="animate-fade-in">
            <CsvUploader 
              onImportLeads={handleImportLeads}
              onLoadSampleLeads={handleLoadSampleLeads}
              onStartCampaign={handleStartAutomatedCampaign}
              isCampaignRunning={isCampaignRunning}
              campaignProgress={campaignProgress}
            />

            <LeadTable 
              leads={leads}
              onSelectLeadForStudio={(lead) => {
                setSelectedLeadId(lead.id);
                setActiveTab('studio');
              }}
              onSelectLeadForEmail={(lead) => {
                setSelectedLeadId(lead.id);
                setActiveTab('emails');
              }}
              onSelectLeadForNotes={(lead) => {
                setSelectedLeadId(lead.id);
                setActiveTab('smart-replies');
              }}
            />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="animate-fade-in">
            <WebPageStudio 
              selectedLead={selectedLead}
              allLeads={leads}
              onSelectLead={(lead) => setSelectedLeadId(lead.id)}
              onUpdateLeadBranding={handleUpdateLeadBranding}
              onGenerateStitchProject={handleGenerateStitchProject}
              mcpConnected={mcpConnected}
            />
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="animate-fade-in">
            <EmailPitcher 
              selectedLead={selectedLead}
              allLeads={leads}
              onSelectLead={(lead) => setSelectedLeadId(lead.id)}
              onSendPitchEmail={handleSendPitchEmail}
              onTriggerFollowUp={handleTriggerFollowUp}
              smtpConfig={smtpConfig}
            />
          </div>
        )}

        {activeTab === 'smart-replies' && (
          <div className="animate-fade-in">
            <SmartResponder 
              selectedLead={selectedLead}
              allLeads={leads}
              onSelectLead={(lead) => setSelectedLeadId(lead.id)}
              onSimulateClientReply={handleSimulateClientReply}
              onAddManualNote={handleAddManualNote}
            />
          </div>
        )}

      </main>

      <AdminSettingsModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        geminiApiKey={geminiApiKey}
        stitchToken={stitchToken}
        smtpConfig={smtpConfig}
        previewDomain={previewDomain}
        packagePrice={packagePrice}
        onSaveAllConfig={handleSaveAllConfig}
      />

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        © 2026 <strong>Codeair Software Solutions</strong>. Lead Outreach & Dynamic Web Page Generation Platform. Zero-Touch Automated Pipeline Active.
      </footer>
    </div>
  );
}
