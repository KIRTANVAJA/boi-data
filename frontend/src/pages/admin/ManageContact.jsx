import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPhone } from 'react-icons/fa';

const ManageContact = () => {
  const { portfolioData, updateSection } = usePortfolioData();
  const { contact } = portfolioData;

  const [email, setEmail] = useState(contact.email || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [address, setAddress] = useState(contact.address || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(contact.mapEmbedUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('contact', { email, phone, address, mapEmbedUrl });
    toast.success('Contact information coordinates saved!');
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Contact Info</h2>
        <p className="text-muted small">Update guest coordinates, communication details, and locations maps</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <FaPhone /> Contact Coordinates
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Primary Email *</label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Phone Number *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Mailing Address *</label>
                  <textarea
                    rows="3"
                    className="form-control glass-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Google Map Embed URL</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={mapEmbedUrl}
                    onChange={(e) => setMapEmbedUrl(e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {mapEmbedUrl && (
              <div className="glass-card mb-4 p-0 overflow-hidden" style={{ height: '220px' }}>
                <iframe
                  title="Google Map location preview"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            )}

            <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2">
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageContact;
