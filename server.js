import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure local directory exists for saving generated HTML landing pages
const GENERATED_PAGES_DIR = path.join(process.cwd(), 'generated_pages');
if (!fs.existsSync(GENERATED_PAGES_DIR)) {
  fs.mkdirSync(GENERATED_PAGES_DIR, { recursive: true });
}

// Persistent Server Configuration File Path
const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');

// Default initial config
const DEFAULT_CONFIG = {
  geminiApiKey: '',
  stitchToken: '',
  previewDomain: '{slug}.preview.codeair.com',
  packagePrice: '₹14,999',
  smtpConfig: {
    host: 'smtp.gmail.com',
    port: '587',
    security: 'TLS',
    username: '',
    password: '',
    senderName: 'Codeair Software Solutions'
  }
};

// 1. Endpoint: Read Saved Persistent Credentials from Disk
app.get('/api/get-config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const fileData = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      const parsedConfig = JSON.parse(fileData);
      return res.json({ success: true, config: { ...DEFAULT_CONFIG, ...parsedConfig } });
    } else {
      return res.json({ success: true, config: DEFAULT_CONFIG });
    }
  } catch (err) {
    console.error('Error reading config file:', err);
    return res.json({ success: true, config: DEFAULT_CONFIG });
  }
});

// 2. Endpoint: Save Credentials Persistently to Disk
app.post('/api/save-config', (req, res) => {
  try {
    const newConfig = req.body;
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    console.log(`💾 PERSISTENT CONFIGURATION SAVED TO DISK AT: ${CONFIG_FILE_PATH}`);
    return res.json({ 
      success: true, 
      message: 'Admin Credentials & SMTP settings saved permanently to disk!' 
    });
  } catch (err) {
    console.error('Error writing config file:', err);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to save configuration to disk: ${err.message}` 
    });
  }
});

// 3. Endpoint: Test SMTP Handshake
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, security, username, password } = req.body;

  if (!host || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required SMTP fields: host, username, or password.' 
    });
  }

  const isSecure = security === 'SSL' || port === 465 || port === '465';

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port) || 587,
      secure: isSecure,
      auth: {
        user: username,
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();
    return res.json({ 
      success: true, 
      message: `SMTP Handshake Verified! Authenticated with ${host}:${port} as ${username}` 
    });
  } catch (err) {
    console.error('SMTP Connection Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: `SMTP Connection Failed: ${err.message}` 
    });
  }
});

// 4. Endpoint: Export & Save HTML File directly to Disk
app.post('/api/export-html', (req, res) => {
  const { htmlContent, businessName } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameter: htmlContent.' 
    });
  }

  try {
    const cleanSlug = (businessName || 'client-lead').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const htmlFileName = `${cleanSlug}-landing-page.html`;
    const localSavedFilePath = path.join(GENERATED_PAGES_DIR, htmlFileName);

    fs.writeFileSync(localSavedFilePath, htmlContent, 'utf-8');
    console.log(`💾 REAL HTML WEBPAGE FILE SAVED ON DISK AT: ${localSavedFilePath}`);

    return res.json({
      success: true,
      fileName: htmlFileName,
      savedLocalPath: localSavedFilePath,
      message: `HTML page successfully generated and saved to disk at '${localSavedFilePath}'`
    });
  } catch (err) {
    console.error('HTML Export Error:', err);
    return res.status(500).json({
      success: false,
      error: `Failed to save HTML file to disk: ${err.message}`
    });
  }
});

// 5. Endpoint: Save HTML Webpage Locally & Send Real Email with Attachment & Formatted Header/Footer
app.post('/api/send-email', async (req, res) => {
  const { smtpConfig, to, subject, body, htmlAttachment, businessName } = req.body;

  if (!smtpConfig || !to || !subject || !body) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: smtpConfig, recipient email, subject, or body.' 
    });
  }

  const { host, port, security, username, password, senderName } = smtpConfig;
  const isSecure = security === 'SSL' || port === 465 || port === '465';

  try {
    const cleanSlug = (businessName || 'client-lead').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const htmlFileName = `${cleanSlug}-landing-page.html`;
    const localSavedFilePath = path.join(GENERATED_PAGES_DIR, htmlFileName);

    // REAL LOCAL SAVING: Write the HTML webpage design to disk!
    let savedLocalPathNotice = '';
    if (htmlAttachment) {
      fs.writeFileSync(localSavedFilePath, htmlAttachment, 'utf-8');
      savedLocalPathNotice = localSavedFilePath;
      console.log(`✅ REAL WEBPAGE SAVED LOCALLY AT: ${localSavedFilePath}`);
    }

    // Attachments array
    const attachments = [];

    // Add local HTML webpage as real physical attachment
    if (fs.existsSync(localSavedFilePath)) {
      attachments.push({
        filename: htmlFileName,
        path: localSavedFilePath,
        contentType: 'text/html'
      });
    }

    // Attach logo image inline
    let logoAttachedInline = false;
    const logoWebpPath = path.join(process.cwd(), 'public', 'logo-dark.webp');
    const logoPngPath = path.join(process.cwd(), 'public', 'logo-dark.png');
    let chosenLogoPath = null;

    if (fs.existsSync(logoPngPath)) {
      chosenLogoPath = logoPngPath;
    } else if (fs.existsSync(logoWebpPath)) {
      chosenLogoPath = logoWebpPath;
    }

    if (chosenLogoPath) {
      attachments.push({
        filename: path.basename(chosenLogoPath),
        path: chosenLogoPath,
        cid: 'codeair_logo'
      });
      logoAttachedInline = true;
    }

    const transporter = nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port: parseInt(port) || 587,
      secure: isSecure,
      auth: {
        user: username,
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // EMAIL BODY HTML WITH SPECIFIED HEADER AND FOOTER DESIGN
    const emailHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #090d16; font-family: Arial, Helvetica, sans-serif; color: #f8fafc; }
    .email-container { max-width: 650px; margin: 20px auto; background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .email-header { padding: 20px 25px; border-bottom: 1px solid rgba(255,255,255,0.1); background: #090d16; }
    .email-content { padding: 30px 25px; line-height: 1.6; font-size: 15px; color: #e2e8f0; white-space: pre-line; }
    .attachment-box { margin: 0 25px 25px 25px; padding: 15px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; color: #6ee7b7; font-size: 13px; }
    .email-footer { padding: 25px; background: #040711; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.8; }
    .footer-links a { color: #94a3b8; text-decoration: underline; margin: 0 8px; }
    .footer-address { margin: 10px 0; color: #cbd5e1; font-weight: 500; }
    .footer-copy { color: #64748b; }
    .footer-copy a { color: #38bdf8; text-decoration: none; font-weight: bold; }
    .social-btn { text-decoration: none; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 4px; display: inline-block; }
    .btn-linkedin { color: #38bdf8; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); }
    .btn-instagram { color: #ec4899; background: rgba(236, 72, 153, 0.12); border: 1px solid rgba(236, 72, 153, 0.3); }
    .btn-facebook { color: #818cf8; background: rgba(129, 140, 248, 0.12); border: 1px solid rgba(129, 140, 248, 0.3); }
  </style>
</head>
<body>
  <div class="email-container">
    
    <!-- HEADER: LOGO LEFT | SOCIAL ICONS RIGHT -->
    <div class="email-header">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <!-- Logo on the left -->
          <td align="left" style="vertical-align: middle;">
            <a href="https://codeair.tech" target="_blank" style="text-decoration: none;">
              ${logoAttachedInline 
                ? `<img src="cid:codeair_logo" alt="Codeair Software Solutions" style="height: 38px; width: auto; border: 0; display: block;" />`
                : `<span style="font-size: 20px; font-weight: bold; color: #ffffff;">Codeair <span style="color: #8b5cf6;">Software</span></span>`
              }
            </a>
          </td>
          <!-- Social Icons on the right -->
          <td align="right" style="vertical-align: middle;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding-left: 6px;">
                  <a href="https://linkedin.com/company/codeairofficial" target="_blank" class="social-btn btn-linkedin">LinkedIn ↗</a>
                </td>
                <td style="padding-left: 6px;">
                  <a href="https://instagram.com/company/codeairofficial" target="_blank" class="social-btn btn-instagram">Instagram ↗</a>
                </td>
                <td style="padding-left: 6px;">
                  <a href="https://facebook.com/company/codeairofficial" target="_blank" class="social-btn btn-facebook">Facebook ↗</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- MAIN BODY CONTENT -->
    <div class="email-content">
      ${body}
    </div>

    <!-- ATTACHMENT NOTICE -->
    <div class="attachment-box">
      📎 <strong>Real File Attached:</strong> We have saved your custom web portal file <code>${htmlFileName}</code> locally on disk and attached it to this email. You can open the attachment directly in any web browser!
    </div>

    <!-- FOOTER DESIGN -->
    <div class="email-footer">
      <!-- 1st Row: Legal Pages Links -->
      <div class="footer-links">
        <a href="https://codeair.tech/legal/privacy-policy" target="_blank">Privacy Policy</a> |
        <a href="https://codeair.tech/legal/terms-of-service" target="_blank">Terms of Services</a> |
        <a href="https://codeair.tech/about" target="_blank">About Us</a> |
        <a href="https://codeair.tech/contact" target="_blank">Contact Us</a>
      </div>

      <!-- 2nd Row: Office Address -->
      <div class="footer-address">
        📍 Office 4074, Currency Tower, Telibandha, Raipur (C.G) - 492001
      </div>

      <!-- 3rd Row: Copyright Credits & Hyperlink -->
      <div class="footer-copy">
        © 2026 Codeair Software Solutions. All rights reserved. Powered by <a href="https://codeair.tech" target="_blank">codeair.tech</a>
      </div>
    </div>

  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"${senderName || 'Codeair Software Solutions'}" <${username}>`,
      to: to,
      subject: subject,
      text: body,
      html: emailHtmlBody,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Real Email Dispatched to ${to} (Message-ID: ${info.messageId})`);

    return res.json({ 
      success: true, 
      messageId: info.messageId, 
      response: info.response,
      savedLocalPath: savedLocalPathNotice,
      fileName: htmlFileName,
      message: `Real email with attached ${htmlFileName} successfully sent to ${to}!`
    });
  } catch (err) {
    console.error('Email Dispatch Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to dispatch real email via SMTP: ${err.message}` 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Real SMTP Email Gateway Server running on http://localhost:${PORT}`);
});
