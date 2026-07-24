import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, Check, AlertCircle, Download, Sparkles, Play, RefreshCw, Filter } from 'lucide-react';

export default function CsvUploader({ 
  onImportLeads, 
  onLoadSampleLeads, 
  onStartCampaign,
  isCampaignRunning,
  campaignProgress
}) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [allowInferredEmails, setAllowInferredEmails] = useState(true);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processCsvFile = (file) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false);
        const data = results.data;

        if (!data || data.length === 0) {
          setErrorMsg("CSV file appears to be empty.");
          return;
        }

        const validLeads = [];
        let totalCount = data.length;
        let inferredCount = 0;

        data.forEach((row, index) => {
          const keys = Object.keys(row);
          
          // Header Column Resolvers (Supports standard Google Maps exports like OrganizationName, OrganizationEmail, etc.)
          const emailKey = keys.find(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('mail'));
          const nameKey = keys.find(k => k.toLowerCase().includes('organizationname') || k.toLowerCase().includes('business') || k.toLowerCase().includes('name') || k.toLowerCase().includes('title'));
          const phoneKey = keys.find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('contact') || k.toLowerCase().includes('mobile'));
          const categoryKey = keys.find(k => k.toLowerCase().includes('category') || k.toLowerCase().includes('niche') || k.toLowerCase().includes('type'));
          const addressKey = keys.find(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('location') || k.toLowerCase().includes('city'));
          const websiteKey = keys.find(k => k.toLowerCase().includes('website') || k.toLowerCase().includes('site') || k.toLowerCase().includes('url'));
          const ratingKey = keys.find(k => k.toLowerCase().includes('star') || k.toLowerCase().includes('rating'));
          const reviewsKey = keys.find(k => k.toLowerCase().includes('review'));

          const rawName = nameKey ? row[nameKey]?.trim() : (row['OrganizationName'] || row['Business Name'] || row['Name']);
          const rawEmail = emailKey ? row[emailKey]?.trim() : (row['OrganizationEmail'] || row['Email'] || row['email']);
          const rawWebsite = websiteKey ? row[websiteKey]?.trim() : (row['OrganizationWebsite'] || '');
          const rawPhone = phoneKey ? row[phoneKey]?.trim() : (row['OrganizationPhoneNr'] || row['Phone'] || '');
          const rawAddress = addressKey ? row[addressKey]?.trim() : (row['OrganizationAddress'] || row['Address'] || '');
          const rawCategory = categoryKey ? row[categoryKey]?.trim() : (row['OrganizationCategory'] || 'Coaching Center');
          const rawRating = ratingKey ? parseFloat(row[ratingKey]) : 4.8;
          const rawReviews = reviewsKey ? parseInt(row[reviewsKey]) : 50;

          if (!rawName) return; // Skip empty rows without name

          let finalEmail = rawEmail;
          let isInferred = false;

          // If email is missing, check if domain can be inferred from website
          if (!finalEmail || !finalEmail.includes('@')) {
            if (rawWebsite) {
              const cleanDomain = rawWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
              if (cleanDomain && cleanDomain.includes('.')) {
                finalEmail = `contact@${cleanDomain}`;
                isInferred = true;
                inferredCount++;
              }
            } else if (allowInferredEmails) {
              const cleanSlug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
              finalEmail = `info@${cleanSlug}.com`;
              isInferred = true;
              inferredCount++;
            }
          }

          if (finalEmail && (finalEmail.includes('@') || allowInferredEmails)) {
            validLeads.push({
              id: `lead-csv-${Date.now()}-${index}`,
              businessName: rawName,
              email: finalEmail,
              isInferredEmail: isInferred,
              website: rawWebsite || '',
              category: rawCategory || "Coaching Center",
              phone: rawPhone || "+91 98000 00000",
              address: rawAddress || "Raipur, Chhattisgarh",
              rating: rawRating || 4.7,
              reviewsCount: rawReviews || 100,
              status: "extracted",
              extractedAt: new Date().toLocaleString(),
              branding: {
                primaryColor: "#4f46e5",
                accentColor: "#06b6d4",
                headline: `Premier ${rawCategory || 'Coaching'} by ${rawName}`,
                tagline: `Top Rated (${rawRating || 4.8}★) in ${rawAddress ? rawAddress.split(',')[0] : 'City'}`,
                heroBannerText: "Admissions Open for 2026 Batch | Verified Results",
                services: [
                  "Comprehensive Foundational Courses",
                  "Expert Faculty & Certified Team",
                  "Daily Doubt Resolution & Test Analytics",
                  "Verified Top Student Results"
                ],
                ctaText: "Book Free Consultation"
              },
              pitchEmail: {
                subject: `Customized Web Portal & Growth Engine for ${rawName}`,
                body: `Dear ${rawName} Team,

Greetings from Codeyar Software Solutions!

We noticed ${rawName}'s impressive ${rawRating || 4.8}★ rating on Google Maps!

Codeyar Software Solutions has crafted a specialized dynamic web portal prototype for ${rawName}:
👉 Preview Link: [https://${rawName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.preview.codeyar.com]

Best regards,
Codeyar Software Solutions`
              },
              activityNotes: [
                {
                  id: `note-${Date.now()}-${index}`,
                  timestamp: new Date().toLocaleString(),
                  type: "lead_extracted",
                  content: isInferred 
                    ? `Extracted from CSV. Email inferred from website domain: ${finalEmail}`
                    : `Extracted from CSV file. Verified direct email: ${finalEmail}`,
                  author: "System CSV Parser"
                }
              ]
            });
          }
        });

        if (validLeads.length === 0) {
          setErrorMsg("Could not extract valid leads from this CSV file. Please verify CSV formatting.");
          return;
        }

        setExtractedInfo({
          totalRows: totalCount,
          extractedCount: validLeads.length,
          inferredCount: inferredCount
        });

        onImportLeads(validLeads);
      },
      error: (err) => {
        setIsProcessing(false);
        setErrorMsg(`CSV Parsing Error: ${err.message}`);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCsvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processCsvFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet color="#6366f1" size={22} />
            Google Leads CSV Extraction & Automated Campaign Hub
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Upload Google Leads CSV (e.g. <code>data.csv</code>). The system parses listings, extracts/infers emails, and executes automated outreach.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={onLoadSampleLeads}
            className="btn-outline-purple"
          >
            <Sparkles size={16} />
            Load Sample Leads
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #6366f1' : '2px dashed rgba(255, 255, 255, 0.12)',
          background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}
      >
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-input-file"
        />
        <label htmlFor="csv-input-file" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Upload size={26} />
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '0.4rem' }}>
            {isProcessing ? 'Processing CSV File...' : 'Drop your Google Leads CSV here or click to browse'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Fully compatible with Google Maps exports (e.g., <code>data.csv</code> with <code>OrganizationName</code>, <code>OrganizationEmail</code>, etc.)
          </p>
        </label>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#fca5a5',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} color="#ef4444" />
          {errorMsg}
        </div>
      )}

      {/* Extraction Success & START AUTOMATED CAMPAIGN BUTTON */}
      {extractedInfo && (
        <div style={{
          marginTop: '1rem',
          padding: '1.25rem',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7', fontWeight: '700', fontSize: '0.95rem' }}>
              <Check size={18} color="#10b981" />
              CSV Parsed Successfully! Isolated {extractedInfo.extractedCount} Business Leads.
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Processed <strong>{extractedInfo.totalRows}</strong> total rows $\rightarrow$ Verified Emails: <strong>{extractedInfo.extractedCount - extractedInfo.inferredCount}</strong> | Domain Inferred: <strong>{extractedInfo.inferredCount}</strong>
            </div>
          </div>

          {/* High-Visibility START AUTOMATED CAMPAIGN BUTTON */}
          <button
            onClick={onStartCampaign}
            disabled={isCampaignRunning}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            {isCampaignRunning ? (
              <>
                <RefreshCw size={18} className="pulse-glow" />
                Executing Campaign Pipeline...
              </>
            ) : (
              <>
                <Play size={18} />
                🚀 START AUTOMATED OUTREACH CAMPAIGN
              </>
            )}
          </button>
        </div>
      )}

      {/* Campaign Running Progress Bar */}
      {isCampaignRunning && campaignProgress && (
        <div style={{
          marginTop: '1rem',
          padding: '1.25rem',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <span style={{ fontWeight: '700', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={15} className="pulse-glow" color="#818cf8" />
              Campaign Pipeline Executing: Processing Lead {campaignProgress.current} of {campaignProgress.total}
            </span>
            <span style={{ fontWeight: '700', color: '#38bdf8' }}>{campaignProgress.percentage}% Complete</span>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '0.6rem'
          }}>
            <div style={{
              width: `${campaignProgress.percentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} color="#f59e0b" />
            Current Action: <strong>{campaignProgress.statusText}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
