import rawIndex8Html from '../templates/index-8.html?raw';

export const generateLeadHtml = (lead, branding) => {
  if (!lead) return rawIndex8Html;

  const businessName = lead.businessName || 'Orisa';
  const category = lead.category || 'UI/UX Agency';
  const email = lead.email || 'hello@orisa.com';
  const phone = lead.phone || '(212) 555-7398';
  const address = lead.address || '245 Fifth Avenue, Suite 1800, New York, NY 10016, USA';

  const headline = branding?.headline || `${businessName} — Human-Centered Experiences, Interactive Design`;

  let html = rawIndex8Html;

  // Literal exact text replacements inside raw index-8.html file
  html = html.replace(/Orisa - Advancing Startup Innovation/g, `${businessName} - ${category}`);
  html = html.replace(/HUMAN-CENTERED EXPERIENCES, INTERACTIVE DESIGN/g, headline.toUpperCase());
  html = html.replace(/hello@orisa\.com/g, email);
  html = html.replace(/\(212\) 555-7398/g, phone);
  html = html.replace(/\+212 - 555-7398/g, phone);
  html = html.replace(/245 Fifth Avenue, Suite 1800 <br>\s*New York, NY 10016, USA/g, address);
  html = html.replace(/245 Fifth Avenue, Suite 1800<br \/>New York, NY 10016, USA/g, address);
  html = html.replace(/Orisa © 2026/g, `${businessName} © 2026`);

  // Brand Name replacements in exact header and hero section elements
  html = html.replace(/<p class="h6 fw-700 fz-24 mb-0">Orisa<\/p>/g, `<p class="h6 fw-700 fz-24 mb-0">${businessName}</p>`);
  html = html.replace(/<span class="h8-word text-scale-anim">ORISA<\/span>/g, `<span class="h8-word text-scale-anim">${businessName.toUpperCase()}</span>`);

  return html;
};
