import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit2, Save, Award } from 'lucide-react';

const ManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Certificate');
  const [date, setDate] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/portfolio/achievements');
      if (res.success) {
        setAchievements(res.data);
      }
    } catch (err) {
      toast.error('Failed to load achievements list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('Certificate');
    setDate('');
    setDocumentFile(null);
    setCurrentDocumentUrl('');
    setShowForm(true);
  };

  const openEditForm = (ach) => {
    setEditingId(ach._id);
    setTitle(ach.title);
    setDescription(ach.description || '');
    setCategory(ach.category || 'Certificate');
    setDate(ach.date ? ach.date.substring(0, 10) : '');
    setDocumentFile(null);
    setCurrentDocumentUrl(ach.documentUrl || '');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);

    if (documentFile) {
      formData.append('document', documentFile);
    }

    try {
      let res;
      if (editingId) {
        res = await apiRequest(`/portfolio/achievements/${editingId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await apiRequest('/portfolio/achievements', {
          method: 'POST',
          body: formData,
        });
      }

      if (res.success) {
        toast.success(editingId ? 'Achievement updated!' : 'Achievement added successfully!');
        setShowForm(false);
        fetchAchievements();
      }
    } catch (err) {
      toast.error(err.message || 'Error saving achievement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      const res = await apiRequest(`/portfolio/achievements/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.info('Achievement record removed');
        fetchAchievements();
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting achievement');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gold-gradient mb-1">Milestones & Achievements</h2>
          <p className="text-muted small">Manage certificates, awards, and competition rankings</p>
        </div>
        {!showForm && (
          <button onClick={openCreateForm} className="btn btn-gold d-flex align-items-center gap-1">
            <Plus size={18} />
            <span>Add Achievement</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card mb-5">
          <h5 className="text-gold mb-4">{editingId ? 'Edit Achievement Record' : 'Record New Achievement'}</h5>
          
          <form onSubmit={handleFormSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-white-50 small">Title / Name *</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Winner"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label text-white-50 small">Category *</label>
                <select className="form-select glass-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="Award">Award</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Competition">Competition</option>
                  <option value="Recognition">Recognition</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label text-white-50 small">Date Received</label>
                <input
                  type="date"
                  className="form-control glass-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label text-white-50 small">Detailed Description</label>
                <textarea
                  rows="3"
                  className="form-control glass-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elaborate on details, ranks, projects or links..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-white-50 small">Certificate Document (Image or PDF)</label>
                <input
                  type="file"
                  className="form-control glass-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDocumentFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="col-md-6 text-center">
                {(documentFile || currentDocumentUrl) && (
                  <div className="mt-2">
                    <span className="text-muted small d-block mb-1">Document Status</span>
                    {documentFile ? (
                      <span className="badge bg-gold text-black">{documentFile.name} (Ready to Save)</span>
                    ) : (
                      <a href={currentDocumentUrl} target="_blank" rel="noreferrer" className="text-gold small hover-glow text-decoration-none">
                        View Saved Document Attachment ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex gap-2 justify-content-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-glass">
                Cancel
              </button>
              <button type="submit" className="btn btn-gold d-flex align-items-center gap-1" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
                ) : (
                  <>
                    <Save size={16} />
                    <span>{editingId ? 'Save Changes' : 'Create Record'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Card */}
      <div className="glass-card">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status" />
          </div>
        ) : achievements.length === 0 ? (
          <p className="text-muted text-center mb-0 py-4">No achievement records added yet. Click "Add Achievement" to get started.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Attachment</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach) => (
                  <tr key={ach._id}>
                    <td>
                      <strong className="text-white">{ach.title}</strong>
                      <span className="text-muted d-block small truncate" style={{ maxWidth: '300px' }}>{ach.description}</span>
                    </td>
                    <td>
                      <span className="badge bg-gold text-black">{ach.category}</span>
                    </td>
                    <td className="text-white-50 small">
                      {ach.date ? new Date(ach.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {ach.documentUrl ? (
                        <a href={ach.documentUrl} target="_blank" rel="noreferrer" className="text-gold small hover-glow text-decoration-none">
                          View File ↗
                        </a>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => openEditForm(ach)} className="btn btn-glass btn-sm p-2">
                          <Edit2 size={15} className="text-gold" />
                        </button>
                        <button onClick={() => handleDelete(ach._id)} className="btn btn-outline-danger btn-sm p-2">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAchievements;
