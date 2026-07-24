export const INITIAL_LEADS = [
  {
    id: "lead-101",
    businessName: "Apex Career Institute",
    email: "contact@apexcareerinstitute.com",
    category: "Coaching Institute",
    phone: "+91 98765 43210",
    address: "Sector 14, Near Metro Station, Delhi",
    rating: 4.8,
    reviewsCount: 142,
    status: "replied",
    extractedAt: "2026-07-23 09:30 AM",
    branding: {
      primaryColor: "#4f46e5",
      accentColor: "#06b6d4",
      headline: "Crack IIT-JEE & NEET With Top Rankers",
      tagline: "India's Premier Coaching Institute for Competitive Excellence",
      heroBannerText: "Admissions Open for 2026-27 Batch | 98% Selection Rate",
      services: [
        "IIT-JEE Main & Advanced Mastery Program",
        "NEET UG Medical Special Batches",
        "Class 9-12 Foundation & Board Excellence",
        "Daily Doubt Sessions & AI Test Analytics"
      ],
      ctaText: "Book Free Demo Class"
    },
    pitchEmail: {
      subject: "Customized Web Portal & Student Admission Engine for Apex Career Institute",
      body: `Dear Apex Career Institute Team,

Hope you are doing great!

We came across Apex Career Institute on Google while researching top-rated Coaching Institutes in Delhi. Your 4.8-star rating and student achievements are truly inspiring!

At Codeair Software Solutions, we noticed that a high-converting, modern digital web portal can help you double your online demo class bookings and automate student admissions.

We have designed a custom high-performance web landing page specifically tailored for Apex Career Institute:
👉 Live Preview: [apex-career-institute.preview.codeair.com]

Features included in your custom design:
- Direct Free Demo Class Booking Form
- Course Catalog with Downloadable Syllabus
- Student Testimonial & Results Showcase
- Mobile-optimized Instant WhatsApp Enrollment button

Would you be open to a quick 10-minute call this week to see how we can deploy this live for Apex Career Institute?

Warm regards,
Team Codeair Software Solutions
Web & Automation Experts`
    },
    activityNotes: [
      {
        id: "note-1",
        timestamp: "2026-07-23 09:30 AM",
        type: "lead_extracted",
        content: "Lead extracted from Google Maps CSV export. Valid email contact verified: contact@apexcareerinstitute.com",
        author: "System CSV Parser"
      },
      {
        id: "note-2",
        timestamp: "2026-07-23 10:15 AM",
        type: "web_page_created",
        content: "Dynamic landing page designed via Gemini API & Stitch MCP for Coaching Institute niche.",
        author: "Codeair Engine"
      },
      {
        id: "note-3",
        timestamp: "2026-07-23 11:00 AM",
        type: "pitch_sent",
        content: "Initial personalized pitch email sent via SMTP with dynamic preview link attached.",
        author: "Outreach Bot"
      },
      {
        id: "note-4",
        timestamp: "2026-07-23 02:45 PM",
        type: "client_reply",
        content: "Client replied: 'Hi Codeair Team, we loved the demo page preview! Can you send pricing for full development?'",
        author: "Client Lead (External)"
      },
      {
        id: "note-5",
        timestamp: "2026-07-23 02:46 PM",
        type: "ai_smart_reply",
        content: "AI Smart Responder replied via SMTP: 'Thanks for reaching out! Our full coaching web system package starts at ₹14,999 with 1-year hosting included. Can we schedule a quick call tomorrow at 3 PM?'",
        author: "Codeair AI Auto-Responder"
      }
    ]
  },
  {
    id: "lead-102",
    businessName: "Zenith Scholars Academy",
    email: "info@zenithscholars.org",
    category: "Coaching Institute",
    phone: "+91 98112 88776",
    address: "Kalu Sarai, Hauz Khas, New Delhi",
    rating: 4.7,
    reviewsCount: 98,
    status: "sent",
    extractedAt: "2026-07-23 09:35 AM",
    branding: {
      primaryColor: "#7c3aed",
      accentColor: "#f43f5e",
      headline: "Empowering Minds, Shaping Future Leaders",
      tagline: "Personalized Tutoring & Competitive Exam Preparation",
      heroBannerText: "Scholarship Test Registered Students Get up to 50% Fee Waiver",
      services: [
        "Class 8th to 12th CBSE & ICSE Boards",
        "Olympiad & NTSE Special Preparation",
        "Small Batch Sizes (Max 15 Students)",
        "Weekly Performance Reports for Parents"
      ],
      ctaText: "Register for Scholarship Test"
    },
    pitchEmail: {
      subject: "Interactive Student Portal Proposal for Zenith Scholars Academy",
      body: `Dear Zenith Scholars Academy Team,

Greetings from Codeair Software Solutions!

While searching for leading educational institutes in New Delhi, Zenith Scholars Academy caught our attention for your exceptional track record.

To help Zenith Scholars Academy convert more website visitors into enrolled students, we created a specialized prototype landing page:
👉 Custom Preview: [zenith-scholars.preview.codeair.com]

This interactive prototype features a Scholarship Test Registration Widget, Live Doubt Chat integration, and Parent Testimonial slider.

Let us know if you'd like us to customize this further for Zenith Scholars Academy!

Best regards,
Codeair Software Solutions`
    },
    activityNotes: [
      {
        id: "note-1",
        timestamp: "2026-07-23 09:35 AM",
        type: "lead_extracted",
        content: "Lead extracted from Google CSV export.",
        author: "System CSV Parser"
      },
      {
        id: "note-2",
        timestamp: "2026-07-23 10:20 AM",
        type: "web_page_created",
        content: "Dynamic web page generated for Zenith Scholars Academy.",
        author: "Codeair Engine"
      },
      {
        id: "note-3",
        timestamp: "2026-07-23 11:30 AM",
        type: "pitch_sent",
        content: "Pitch email dispatched via SMTP to info@zenithscholars.org.",
        author: "Outreach Bot"
      }
    ]
  }
];

export const NICHE_TEMPLATES = {
  "Coaching Institute": {
    name: "Coaching Institute / EdTech",
    defaultHeadline: "Transform Your Exam Preparation with Expert Guidance",
    defaultTagline: "Premier Coaching for Competitive Exams & Board Mastery",
    defaultCTA: "Enroll for Free Trial Class",
    featuresTitle: "Why Students Choose Us",
    servicesTitle: "Our Popular Courses & Batches"
  },
  "Hospital/Clinic": {
    name: "Hospital & Medical Clinic",
    defaultHeadline: "Advanced Medical Care for You & Your Loved Ones",
    defaultTagline: "Trusted Multi-Speciality Healthcare with 24/7 Support",
    defaultCTA: "Book Doctor Appointment",
    featuresTitle: "Our Medical Specialties",
    servicesTitle: "Patient Facilities & Care"
  }
};
