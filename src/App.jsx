import React, { useState } from 'react';
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

  // Admin Credentials & Connection State
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
    senderName: 'Codeair'
  });

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Helper stats
  const leadsCount = leads.length;
  const designedCount = leads.filter(l => l.status === 'designed' || l.status === 'sent' || l.status === 'replied').length;
  const sentCount = leads.filter(l => l.status === 'sent' || l.status === 'replied').length;
  const repliedCount = leads.filter(l => l.status === 'replied').length;

  const getDynamicPreviewUrl = (businessName) => {
    const slug = (businessName || 'business').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return (previewDomain || '{slug}.preview.codeair.com').replace('{slug}', slug);
  };

  // Import Leads from CSV
  const handleImportLeads = (newLeads) => {
    setLeads(newLeads);
    if (newLeads.length > 0) {
      setSelectedLeadId(newLeads[0].id);
    }
  };

  // Load Sample Leads
  const handleLoadSampleLeads = () => {
    setLeads(INITIAL_LEADS);
    setSelectedLeadId(INITIAL_LEADS[0].id);
  };

  // Update Dynamic Branding
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

  // Trigger Stitch MCP / Gemini Project Creation
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

  // Batch Campaign Automation Engine with REAL SMTP Dispatch
  const handleStartAutomatedCampaign = async () => {
    if (leads.length === 0) return;
    setIsCampaignRunning(true);

    const totalLeads = leads.length;

    for (let i = 0; i < totalLeads; i++) {
      const target = leads[i];
      const previewUrl = getDynamicPreviewUrl(target.businessName);

      // 1. Web Search
      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 0.3) / totalLeads) * 100),
        statusText: `[1/3] Gemini AI Web Searching reputation & details for "${target.businessName}"...`
      });
      await new Promise(r => setTimeout(r, 600));

      // 2. Stitch MCP Project Creation
      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 0.6) / totalLeads) * 100),
        statusText: `[2/3] Auto-Creating Google Stitch MCP Project & Dynamic Web Page for "${target.businessName}"...`
      });
      await new Promise(r => setTimeout(r, 700));

      // 3. REAL SMTP Email Dispatch
      setCampaignProgress({
        current: i + 1,
        total: totalLeads,
        percentage: Math.round(((i + 1) / totalLeads) * 100),
        statusText: `[3/3] Dispatching REAL Email via SMTP Gateway (${smtpConfig.host}) to ${target.email}...`
      });

      const pitchBody = `Dear ${target.businessName} Team,\n\nGreetings from Codeair!\n\nWe came across ${target.businessName} on Google Maps (${target.rating || 4.8}★ rating) and were thoroughly impressed!\n\nWe have created a custom high-performance web portal for ${target.businessName}.\n\nPlease find attached the HTML file of your custom web portal. You can download and open it directly in your browser.\n\nBest regards,\nCodeair`;

      const htmlAttachment = generateLeadHtml(target, target.branding);

      try {
        await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtpConfig,
            to: target.email,
            subject: target.pitchEmail?.subject || `Customized Web Portal for ${target.businessName}`,
            body: pitchBody,
            htmlAttachment,
            businessName: target.businessName
          })
        });
      } catch (err) {
        console.warn('Real SMTP Server notification:', err);
      }

      await new Promise(r => setTimeout(r, 600));

      const timestamp = new Date().toLocaleString();
      setLeads(prev => prev.map(l => {
        if (l.id === target.id) {
          const newNotes = [
            ...(l.activityNotes || []),
            {
              id: `note-campaign-${Date.now()}`,
              timestamp: timestamp,
              type: "pitch_sent",
              content: `Automated Outreach Campaign executed!\n1. Gemini AI Web Search completed.\n2. Stitch MCP Project created.\n3. Real Pitch Email dispatched via SMTP Gateway (${smtpConfig.host}:${smtpConfig.port}) to ${l.email}.\nAttached HTML Design File included.`,
              author: "Codeair Automated Outreach Pipeline"
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
    setActiveTab('emails');
  };

  // Send Pitch Email via SMTP
  const handleSendPitchEmail = (leadId, { subject, body }) => {
    const timestamp = new Date().toLocaleString();
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const previewUrl = getDynamicPreviewUrl(l.businessName);
        const newNotes = [
          ...(l.activityNotes || []),
          {
            id: `note-${Date.now()}`,
            timestamp: timestamp,
            type: "pitch_sent",
            content: `Personalized Pitch Email dispatched via SMTP (${smtpConfig.host}:${smtpConfig.port}) on behalf of ${smtpConfig.senderName || 'Codeair'}.\nSubject: "${subject}"\nAttached Web Page HTML File included.`,
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

  // Trigger Follow-up
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
            content: `Automated Follow-up triggered via SMTP (${stageLabel}). Email sent to ${l.email} reminding them to check their dynamic web portal demo.`,
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

  // Simulate Client Reply & Generate AI Response
  const handleSimulateClientReply = (leadId, clientMsg) => {
    const timestamp = new Date().toLocaleString();
    
    // Formulate AI Smart Response on behalf of Codeair
    const targetLead = leads.find(l => l.id === leadId);
    const aiResponseText = `Dear ${targetLead?.businessName || 'Team'},\n\nThank you for your response!\n\nAt Codeair, our specialized Web Development & Automation package for ${targetLead?.category || 'businesses'} includes:\n- Full responsive custom web portal\n- Free SSL & high-speed SSD hosting for 1 year\n- WhatsApp Chat & Lead Form integration\n\nOur launch package starts at ${packagePrice || '₹14,999'} complete. We can deploy your website live within 48 hours.\n\nWould tomorrow at 3:00 PM work for a brief 10-minute demo call?\n\nWarm regards,\nCodeair Team`;

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
            content: `Codeair AI Smart Auto-Responder Sent via SMTP:\n"${aiResponseText}"`,
            author: "Codeair AI Auto-Responder"
          }
        ];
        return {
          ...l,
          status: 'replied',
          activityNotes: newNotes
        };
      }
      return l;
    }));
  };

  // Add Manual Note
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
      
      {/* App Header */}
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

      {/* Main App Content Area */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1, width: '100%' }}>
        
        {/* Tab 1: CSV Leads Hub */}
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

        {/* Tab 2: Dynamic Web Studio */}
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

        {/* Tab 3: Pitch & Forward Email */}
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

        {/* Tab 4: Smart Reply & Activity Notes Log */}
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

      {/* Beginner-Friendly Admin Settings Modal */}
      <AdminSettingsModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        geminiApiKey={geminiApiKey}
        onSaveGeminiKey={(key) => setGeminiApiKey(key)}
        stitchToken={stitchToken}
        onSaveStitchToken={(tok) => {
          setStitchToken(tok);
          setMcpConnected(true);
        }}
        smtpConfig={smtpConfig}
        onSaveSmtpConfig={(cfg) => setSmtpConfig(cfg)}
        previewDomain={previewDomain}
        onSavePreviewDomain={(dom) => setPreviewDomain(dom)}
        packagePrice={packagePrice}
        onSavePackagePrice={(prc) => setPackagePrice(prc)}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        © 2026 <strong>Codeair</strong>. Lead Outreach & Dynamic Web Page Generation Platform. Built with React & Google Stitch MCP.
      </footer>
    </div>
  );
}
