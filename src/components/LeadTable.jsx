import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Send, 
  FileText, 
  Search, 
  Filter, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function LeadTable({ 
  leads, 
  onSelectLeadForStudio, 
  onSelectLeadForEmail, 
  onSelectLeadForNotes 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'extracted':
        return <span className="badge badge-extracted"><Clock size={12} /> Email Extracted</span>;
      case 'designed':
        return <span className="badge badge-designed"><Sparkles size={12} /> Web Page Ready</span>;
      case 'sent':
        return <span className="badge badge-sent"><Send size={12} /> Pitch Email Sent</span>;
      case 'replied':
        return <span className="badge badge-replied"><CheckCircle2 size={12} /> Client Replied</span>;
      default:
        return <span className="badge badge-extracted">{status}</span>;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Table Header & Search Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 color="#8b5cf6" size={20} />
            Extracted Business Leads Directory
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> listings with verified emails
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search business or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
            />
          </div>

          {/* Category Filter */}
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="all">All Niche Categories</option>
            <option value="Coaching Institute">Coaching Institutes</option>
            <option value="Hospital/Clinic">Hospitals & Clinics</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Fitness/Gym">Fitness & Gyms</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="extracted">Extracted</option>
            <option value="designed">Web Page Ready</option>
            <option value="sent">Pitch Sent</option>
            <option value="replied">Client Replied</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Business Name & Niche</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Contact Info</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Location</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Custom Landing Page</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No lead listings found matching your search parameters.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Business Name & Niche */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                      {lead.businessName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span style={{
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: '#a5b4fc',
                        fontSize: '0.75rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        {lead.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#fde047' }}>★ {lead.rating} ({lead.reviewsCount})</span>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: '500' }}>
                      <Mail size={13} />
                      {lead.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      <Phone size={13} />
                      {lead.phone}
                    </div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} color="var(--text-dim)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.address}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1rem' }}>
                    {getStatusBadge(lead.status)}
                  </td>

                  {/* Custom Page Link */}
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => onSelectLeadForStudio(lead)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#c4b5fd',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye size={13} />
                      View Design Preview
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => onSelectLeadForEmail(lead)}
                        title="Prepare & Forward Pitch Email"
                        className="btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <Send size={13} />
                        Pitch
                      </button>

                      <button
                        onClick={() => onSelectLeadForNotes(lead)}
                        title="View Activity & AI Notes Log"
                        className="btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <MessageSquare size={13} color="#6366f1" />
                        Notes ({lead.activityNotes?.length || 0})
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
