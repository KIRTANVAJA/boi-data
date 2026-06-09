import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageCertifications = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { certifications } = portfolioData;

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [credentialId, setCredentialId] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !issuer) {
      toast.warning('Please enter certification title and issuer');
      return;
    }

    addItem('certifications', { title, issuer, date, link, credentialId });
    toast.success('Certification credential logged!');
    setTitle('');
    setIssuer('');
    setDate('');
    setLink('');
    setCredentialId('');
  };

  const handleUpdate = (index, field, value) => {
    updateItem('certifications', index, { [field]: value });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this certification record?')) {
      deleteItem('certifications', index);
      toast.info('Credential removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Certifications</h2>
        <p className="text-muted small">Manage technical credentials, verified qualifications, and licenses</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Add Certification</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Certificate Title *</label>
                <input type="text" className="form-control glass-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Issuing Authority *</label>
                <input type="text" className="form-control glass-input" value={issuer} onChange={(e) => setIssuer(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Issue Date</label>
                <input type="text" className="form-control glass-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Feb 2024" />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Credential URL</label>
                <input type="url" className="form-control glass-input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Verification page URL" />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Credential ID</label>
                <input type="text" className="form-control glass-input" value={credentialId} onChange={(e) => setCredentialId(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Add Credential
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Current Credentials ({certifications.length})</h5>
            
            {certifications.map((cert, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-gold text-black">Certificate #{idx + 1}</span>
                  <button type="button" onClick={() => handleDelete(idx)} className="btn text-danger p-0 border-0">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Certificate Title</label>
                    <input type="text" className="form-control glass-input" value={cert.title} onChange={(e) => handleUpdate(idx, 'title', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Issuing Authority</label>
                    <input type="text" className="form-control glass-input" value={cert.issuer} onChange={(e) => handleUpdate(idx, 'issuer', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Issue Date</label>
                    <input type="text" className="form-control glass-input" value={cert.date} onChange={(e) => handleUpdate(idx, 'date', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Credential ID</label>
                    <input type="text" className="form-control glass-input" value={cert.credentialId} onChange={(e) => handleUpdate(idx, 'credentialId', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Verification Link</label>
                    <input type="url" className="form-control glass-input" value={cert.link} onChange={(e) => handleUpdate(idx, 'link', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {certifications.length === 0 && <p className="text-muted small text-center mb-0 py-3">No certifications logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCertifications;
