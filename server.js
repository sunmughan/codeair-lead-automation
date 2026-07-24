import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure local directory exists for saving generated HTML landing pages
const GENERATED_PAGES_DIR = path.join(process.cwd(), 'generated_pages');
if (!fs.existsSync(GENERATED_PAGES_DIR)) {
  fs.mkdirSync(GENERATED_PAGES_DIR, { recursive: true });
}

// Persistent File Fallback Path
const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');

// MySQL Pool Configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'codeair_automation';

let dbPool = null;

// Initialize MySQL Database & Auto-Create Schema Tables
async function initDb() {
  try {
    // 1. Connection without DB selected to create DB if needed
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();

    // 2. Create Pool with Database
    dbPool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create Tables
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INT PRIMARY KEY DEFAULT 1,
        smtp_host VARCHAR(255) DEFAULT 'smtp.gmail.com',
        smtp_port INT DEFAULT 587,
        smtp_security VARCHAR(10) DEFAULT 'TLS',
        smtp_username VARCHAR(255) DEFAULT '',
        smtp_password VARCHAR(255) DEFAULT '',
        sender_name VARCHAR(255) DEFAULT 'Codeair Software Solutions',
        gemini_api_key TEXT DEFAULT NULL,
        stitch_token TEXT DEFAULT NULL,
        preview_domain VARCHAR(255) DEFAULT '{slug}.preview.codeair.com',
        package_price VARCHAR(50) DEFAULT '₹14,999',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      INSERT IGNORE INTO admin_settings (id, smtp_host, smtp_port, smtp_security, smtp_username, smtp_password, sender_name, preview_domain, package_price)
      VALUES (1, 'smtp.gmail.com', 587, 'TLS', '', '', 'Codeair Software Solutions', '{slug}.preview.codeair.com', '₹14,999');
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(100) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) DEFAULT NULL,
        website VARCHAR(255) DEFAULT NULL,
        category VARCHAR(150) DEFAULT 'Business',
        rating DECIMAL(3, 1) DEFAULT 4.8,
        reviews_count INT DEFAULT 100,
        address TEXT DEFAULT NULL,
        status ENUM('extracted', 'designed', 'sent', 'replied') DEFAULT 'extracted',
        branding_json JSON DEFAULT NULL,
        pitch_subject VARCHAR(255) DEFAULT NULL,
        pitch_body TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id VARCHAR(100) NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body_text TEXT DEFAULT NULL,
        attachment_file_name VARCHAR(255) DEFAULT NULL,
        attachment_local_path TEXT DEFAULT NULL,
        status ENUM('sent', 'failed') DEFAULT 'sent',
        message_id VARCHAR(255) DEFAULT NULL,
        error_message TEXT DEFAULT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS activity_notes (
        id VARCHAR(100) PRIMARY KEY,
        lead_id VARCHAR(100) NOT NULL,
        note_type VARCHAR(50) NOT NULL,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        timestamp VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ MySQL Database & Tables Initialized Successfully!');
  } catch (err) {
    console.warn('⚠️ MySQL Initialization Notice (Will fallback to config.json file):', err.message);
  }
}

initDb();

// Helper: Get Saved Admin Settings (MySQL first, config.json fallback)
async function getSavedAdminConfig() {
  if (dbPool) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM admin_settings WHERE id = 1');
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          geminiApiKey: row.gemini_api_key || '',
          stitchToken: row.stitch_token || '',
          previewDomain: row.preview_domain || '{slug}.preview.codeair.com',
          packagePrice: row.package_price || '₹14,999',
          smtpConfig: {
            host: row.smtp_host || 'smtp.gmail.com',
            port: String(row.smtp_port || 587),
            security: row.smtp_security || 'TLS',
            username: row.smtp_username || '',
            password: row.smtp_password || '',
            senderName: row.sender_name || 'Codeair Software Solutions'
          }
        };
      }
    } catch (e) {
      console.warn('MySQL read error, using file fallback:', e.message);
    }
  }

  // File fallback
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'));
      return parsed;
    } catch (e) {}
  }

  return {
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
}

// 1. Endpoint: Read Saved Persistent Credentials from MySQL / Disk
app.get('/api/get-config', async (req, res) => {
  const config = await getSavedAdminConfig();
  return res.json({ success: true, config });
});

// 2. Endpoint: Save Credentials Persistently to MySQL & Disk
app.post('/api/save-config', async (req, res) => {
  try {
    const newConfig = req.body;
    const smtp = newConfig.smtpConfig || {};

    // 1. Save to MySQL
    if (dbPool) {
      try {
        await dbPool.query(`
          INSERT INTO admin_settings (id, smtp_host, smtp_port, smtp_security, smtp_username, smtp_password, sender_name, gemini_api_key, stitch_token, preview_domain, package_price)
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            smtp_host = VALUES(smtp_host),
            smtp_port = VALUES(smtp_port),
            smtp_security = VALUES(smtp_security),
            smtp_username = VALUES(smtp_username),
            smtp_password = VALUES(smtp_password),
            sender_name = VALUES(sender_name),
            gemini_api_key = VALUES(gemini_api_key),
            stitch_token = VALUES(stitch_token),
            preview_domain = VALUES(preview_domain),
            package_price = VALUES(package_price);
        `, [
          smtp.host || 'smtp.gmail.com',
          parseInt(smtp.port) || 587,
          smtp.security || 'TLS',
          smtp.username || '',
          smtp.password || '',
          smtp.senderName || 'Codeair Software Solutions',
          newConfig.geminiApiKey || null,
          newConfig.stitchToken || null,
          newConfig.previewDomain || '{slug}.preview.codeair.com',
          newConfig.packagePrice || '₹14,999'
        ]);
        console.log('💾 ADMIN SETTINGS SAVED TO MYSQL DATABASE!');
      } catch (dbErr) {
        console.warn('MySQL save error:', dbErr.message);
      }
    }

    // 2. Save to local config.json fallback
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');

    return res.json({ 
      success: true, 
      message: 'Admin Credentials & SMTP settings saved permanently to MySQL & disk!' 
    });
  } catch (err) {
    console.error('Error saving config:', err);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to save configuration: ${err.message}` 
    });
  }
});

// 3. Endpoint: Test SMTP Handshake
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, security, username, password } = req.body;

  if (!host || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required SMTP fields: Sender Email (username) or App Password.' 
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

// 5. Endpoint: Save HTML Webpage Locally & Send Real Email via SMTP
app.post('/api/send-email', async (req, res) => {
  const { smtpConfig: reqSmtpConfig, to, subject, body, htmlAttachment, businessName, leadId } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: recipient email, subject, or body.' 
    });
  }

  // Load saved credentials from MySQL/disk if request body credentials are incomplete
  const savedConfig = await getSavedAdminConfig();
  const activeSmtp = {
    host: reqSmtpConfig?.host || savedConfig?.smtpConfig?.host || 'smtp.gmail.com',
    port: reqSmtpConfig?.port || savedConfig?.smtpConfig?.port || '587',
    security: reqSmtpConfig?.security || savedConfig?.smtpConfig?.security || 'TLS',
    username: (reqSmtpConfig?.username && reqSmtpConfig.username.trim()) || savedConfig?.smtpConfig?.username || '',
    password: (reqSmtpConfig?.password && reqSmtpConfig.password.trim()) || savedConfig?.smtpConfig?.password || '',
    senderName: reqSmtpConfig?.senderName || savedConfig?.smtpConfig?.senderName || 'Codeair Software Solutions'
  };

  // FIX SMTP "Missing credentials for PLAIN" ERROR:
  if (!activeSmtp.username || !activeSmtp.password) {
    return res.status(400).json({
      success: false,
      error: 'SMTP Authentication Credentials Missing: Please open Admin Settings and enter your SMTP Sender Email (username) & App Password.'
    });
  }

  const isSecure = activeSmtp.security === 'SSL' || activeSmtp.port === 465 || activeSmtp.port === '465';

  try {
    const cleanSlug = (businessName || 'client-lead').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const htmlFileName = `${cleanSlug}-landing-page.html`;
    const localSavedFilePath = path.join(GENERATED_PAGES_DIR, htmlFileName);

    // Write the HTML webpage design to local disk
    let savedLocalPathNotice = '';
    if (htmlAttachment) {
      fs.writeFileSync(localSavedFilePath, htmlAttachment, 'utf-8');
      savedLocalPathNotice = localSavedFilePath;
      console.log(`✅ REAL WEBPAGE SAVED LOCALLY AT: ${localSavedFilePath}`);
    }

    const attachments = [];
    if (fs.existsSync(localSavedFilePath)) {
      attachments.push({
        filename: htmlFileName,
        path: localSavedFilePath,
        contentType: 'text/html'
      });
    }

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
      host: activeSmtp.host,
      port: parseInt(activeSmtp.port) || 587,
      secure: isSecure,
      auth: {
        user: activeSmtp.username,
        pass: activeSmtp.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

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
          <td align="left" style="vertical-align: middle;">
            <a href="https://codeair.tech" target="_blank" style="text-decoration: none;">
              ${logoAttachedInline 
                ? `<img src="cid:codeair_logo" alt="Codeair Software Solutions" style="height: 38px; width: auto; border: 0; display: block;" />`
                : `<span style="font-size: 20px; font-weight: bold; color: #ffffff;">Codeair <span style="color: #8b5cf6;">Software</span></span>`
              }
            </a>
          </td>
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
      <div class="footer-links">
        <a href="https://codeair.tech/legal/privacy-policy" target="_blank">Privacy Policy</a> |
        <a href="https://codeair.tech/legal/terms-of-service" target="_blank">Terms of Services</a> |
        <a href="https://codeair.tech/about" target="_blank">About Us</a> |
        <a href="https://codeair.tech/contact" target="_blank">Contact Us</a>
      </div>

      <div class="footer-address">
        📍 Office 4074, Currency Tower, Telibandha, Raipur (C.G) - 492001
      </div>

      <div class="footer-copy">
        © 2026 Codeair Software Solutions. All rights reserved. Powered by <a href="https://codeair.tech" target="_blank">codeair.tech</a>
      </div>
    </div>

  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"${activeSmtp.senderName || 'Codeair Software Solutions'}" <${activeSmtp.username}>`,
      to: to,
      subject: subject,
      text: body,
      html: emailHtmlBody,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Real Email Dispatched to ${to} (Message-ID: ${info.messageId})`);

    // Log to MySQL email_logs if available
    if (dbPool && leadId) {
      try {
        await dbPool.query(`
          INSERT INTO email_logs (lead_id, recipient_email, subject, body_text, attachment_file_name, attachment_local_path, status, message_id)
          VALUES (?, ?, ?, ?, ?, ?, 'sent', ?);
        `, [leadId, to, subject, body, htmlFileName, localSavedFilePath, info.messageId]);
      } catch (logErr) {
        console.warn('MySQL email_logs write notice:', logErr.message);
      }
    }

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
  console.log(`🚀 Real SMTP Email Gateway & MySQL API Server running on http://localhost:${PORT}`);
});
