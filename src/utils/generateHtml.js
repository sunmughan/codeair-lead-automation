export const generateLeadHtml = (lead, branding) => {
  const isMedical = lead?.category?.toLowerCase().includes('hospital') || lead?.category?.toLowerCase().includes('clinic') || lead?.category?.toLowerCase().includes('doctor');
  const leadCity = lead?.address 
    ? (lead.address.includes(',') ? lead.address.split(',')[lead.address.split(',').length - 2]?.trim() || 'City' : lead.address)
    : 'Local Region';

  const servicesHtml = branding?.services?.map((svc, i) => `
    <div style="background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(99, 102, 241, 0.15); color: #818cf8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
          0${i + 1}
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0;">${svc}</h3>
      </div>
      <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5; margin: 0;">
        Comprehensive quality execution designed for maximum client satisfaction and guaranteed results in ${leadCity}.
      </p>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lead?.businessName || 'Business'} - Custom Web Portal</title>
  <style>
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #030712;
      color: #f8fafc;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div style="width: 100%; max-width: 1200px; margin: 0 auto; background: #0f172a; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);">
    
    <!-- Top Announcement Bar -->
    <div style="background: linear-gradient(90deg, ${branding?.primaryColor || '#6366f1'} 0%, ${branding?.accentColor || '#ec4899'} 100%); color: #ffffff; padding: 0.5rem 1rem; text-align: center; font-size: 0.8rem; font-weight: 700;">
      ⚡ ${branding?.heroBannerText || ''} ⚡
    </div>

    <!-- Header Navigation Bar -->
    <div style="padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(15, 23, 42, 0.95);">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, ${branding?.primaryColor || '#6366f1'} 0%, ${branding?.accentColor || '#ec4899'} 100%); display: flex; align-items: center; justify-content: center; font-size: 22px;">
          ${isMedical ? '🩺' : '🎓'}
        </div>
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">
            ${lead?.businessName || 'Business Name'}
          </h3>
          <span style="font-size: 0.72rem; color: #38bdf8; font-weight: 600;">
            ★ ${lead?.rating || 4.8} Rated • ${lead?.category || 'Business'} • ${leadCity}
          </span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="tel:${lead?.phone || ''}" style="color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
          📞 ${lead?.phone || ''}
        </a>
        <button style="background: ${branding?.accentColor || '#ec4899'}; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
          Direct Contact
        </button>
      </div>
    </div>

    <!-- HERO SECTION -->
    <div style="padding: 4rem 2.5rem; text-align: center; background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 60%); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
      <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.35rem 1rem; border-radius: 30px; font-size: 0.8rem; color: #c7d2fe; font-weight: 600; margin-bottom: 1.5rem;">
        🛡️ Verified Listing in ${leadCity} • ${lead?.reviewsCount || 100}+ Client Reviews
      </div>
      <h1 style="font-size: 2.5rem; font-weight: 900; line-height: 1.2; max-width: 850px; margin: 0 auto 1.25rem auto; color: #ffffff; letter-spacing: -0.03em;">
        ${branding?.headline || ''}
      </h1>
      <p style="font-size: 1.1rem; color: #94a3b8; max-width: 650px; margin: 0 auto 2rem auto; line-height: 1.6;">
        ${branding?.tagline || ''}
      </p>
      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <button style="background: linear-gradient(135deg, ${branding?.primaryColor || '#6366f1'} 0%, ${branding?.accentColor || '#ec4899'} 100%); color: #ffffff; border: none; padding: 0.9rem 2rem; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer;">
          ${branding?.ctaText || ''} →
        </button>
        <button style="background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.9rem 1.5rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer;">
          💬 WhatsApp Direct Inquiry
        </button>
      </div>

      <!-- DYNAMIC TRUST STATS BAR -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; max-width: 800px; margin: 3rem auto 0 auto; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 16px;">
        <div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #38bdf8;">98.5%</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Client Satisfaction Rate</div>
        </div>
        <div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #a7f3d0;">${lead?.reviewsCount || 100}+</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Verified Positive Reviews</div>
        </div>
        <div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #fde047;">${lead?.rating || 4.8} ★</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Google Rating in ${leadCity}</div>
        </div>
        <div>
          <div style="font-size: 1.4rem; font-weight: 900; color: #f472b6;">100%</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Certified Specialists</div>
        </div>
      </div>
    </div>

    <!-- SERVICES / OFFERINGS GRID -->
    <div style="padding: 3.5rem 2rem; background: #090d16;">
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <span style="font-size: 0.8rem; color: #818cf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          OUR KEY OFFERINGS
        </span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 0.4rem;">
          ${isMedical ? 'Specialized Medical Services & Facilities' : `Core Offerings by ${lead?.businessName || 'Business'}`}
        </h2>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        ${servicesHtml}
      </div>
    </div>

    <!-- DYNAMIC REVIEWS & TESTIMONIALS -->
    <div style="padding: 3.5rem 2rem; background: #0f172a; text-align: center;">
      <div style="font-size: 0.8rem; color: #fde047; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
        ★ ★ ★ ★ ★ VERIFIED REVIEWS IN ${leadCity.toUpperCase()}
      </div>
      <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 2rem;">
        What Clients Say About ${lead?.businessName || 'Us'}
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left;">
        <div style="background: #1e293b; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="color: #fde047; margin-bottom: 0.5rem;">★ ★ ★ ★ ★</div>
          <p style="font-size: 0.85rem; color: #e2e8f0; font-style: italic; line-height: 1.5; margin: 0;">
            "${lead?.businessName || 'This business'} is by far the top choice in ${leadCity}! Their team is extremely professional and dedicated."
          </p>
          <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; margin-top: 0.75rem;">
            — Verified Google Reviewer
          </div>
        </div>
        <div style="background: #1e293b; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="color: #fde047; margin-bottom: 0.5rem;">★ ★ ★ ★ ★</div>
          <p style="font-size: 0.85rem; color: #e2e8f0; font-style: italic; line-height: 1.5; margin: 0;">
            "Outstanding service quality and great communication. Highly recommended to anyone looking for ${lead?.category || 'excellent'} services."
          </p>
          <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; margin-top: 0.75rem;">
            — Client Feedback
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background: #040711; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
      <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.4rem;">
        ${lead?.businessName || 'Business'}
      </div>
      <p style="margin: 0 0 1rem 0; color: #64748b;">
        📍 ${lead?.address || 'Location'} | 📞 ${lead?.phone || 'Phone'}
      </p>
      <div style="color: #818cf8; font-weight: 600;">
        ⚡ Custom High-Converting Web Portal Designed by Codeair
      </div>
    </div>

  </div>
</body>
</html>
  `;
};
