import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageGallery = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { gallery } = portfolioData;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Workspace');
  const [url, setUrl] = useState('');

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !url) {
      toast.warning('Please enter image title and image URL');
      return;
    }

    addItem('gallery', { title, category, url });
    toast.success('Media image logged in gallery!');
    setTitle('');
    setCategory('Workspace');
    setUrl('');
  };

  const handleUpdate = (index, field, value) => {
    updateItem('gallery', index, { [field]: value });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this gallery image?')) {
      deleteItem('gallery', index);
      toast.info('Image removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Gallery Media</h2>
        <p className="text-muted small">Manage catalog photos, certifications snapshots, and travel snaps showcase</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Upload Gallery Image</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Image Title / Caption *</label>
                <input type="text" className="form-control glass-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Album Category *</label>
                <input type="text" className="form-control glass-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Workspace, Milestones" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Image Source URL / Local Path *</label>
                <input type="text" className="form-control glass-input mb-2" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. /assets/gallery.jpg or URL" required />
                <label className="form-label text-white-50 small d-block">Or Upload Local Image</label>
                <input type="file" accept="image/*" className="form-control glass-input" onChange={(e) => handleImageUpload(e, setUrl)} />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Log Image
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Current Gallery Images ({gallery.length})</h5>
            
            <div className="row g-3">
              {gallery.map((item, idx) => (
                <div key={idx} className="col-sm-6 col-md-4">
                  <div className="position-relative bg-black rounded border border-secondary p-0 overflow-hidden" style={{ height: '150px' }}>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', top: '8px', left: '8px' }} className="badge bg-gold text-black">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)' }}
                      className="btn text-danger btn-sm p-1 rounded-circle border-0"
                    >
                      <FaTrash size={14} />
                    </button>
                    <div 
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        padding: '10px'
                      }}
                    >
                      <span className="text-white small fw-semibold d-block truncate">{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <p className="text-muted small text-center py-4 w-100">No photos logged yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;
