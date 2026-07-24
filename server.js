import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 1. Endpoint: Test SMTP Server Handshake
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
      message: `SMTP Handshake Verified! Successfully authenticated with ${host}:${port} as ${username}` 
    });
  } catch (err) {
    console.error('SMTP Connection Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: `SMTP Connection Failed: ${err.message}` 
    });
  }
});

// 2. Endpoint: Send Real Email via SMTP
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

    const mailOptions = {
      from: `"${senderName || 'Codeair'}" <${username}>`,
      to: to,
      subject: subject,
      text: body,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="background: #0f172a; color: #ffffff; padding: 15px 20px; border-radius: 6px 6px 0 0;">
            <h2 style="margin: 0; font-size: 18px;">${senderName || 'Codeair'}</h2>
          </div>
          <div style="padding: 20px 0; white-space: pre-line;">
            ${body}
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center;">
            Sent on behalf of Codeair • Web & Automation Experts
          </div>
        </div>
      `,
      ...(htmlAttachment ? {
        attachments: [
          {
            filename: `${(businessName || 'web-portal').toLowerCase().replace(/[^a-z0-9]/g, '-')}-design.html`,
            content: htmlAttachment
          }
        ]
      } : {})
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Real Email Dispatched:', info.messageId);

    return res.json({ 
      success: true, 
      messageId: info.messageId, 
      response: info.response,
      message: `Real email successfully dispatched to ${to}!`
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
