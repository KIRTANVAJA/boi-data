import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageExperience = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { experience } = portfolioData;

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('Internship');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!role || !company || !duration) {
      toast.warning('Please enter role, company name, and duration');
      return;
    }

    addItem('experience', { role, company, duration, type, description });
    toast.success('Experience record added!');
    setRole('');
    setCompany('');
    setDuration('');
    setType('Internship');
    setDescription('');
  };

  const handleUpdate = (index, field, value) => {
    updateItem('experience', index, { [field]: value });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this experience record?')) {
      deleteItem('experience', index);
      toast.info('Experience record removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Experience History</h2>
        <p className="text-muted small">Manage internships, freelancing, and industrial training logs</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Add Experience</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Role / Job Title *</label>
                <input type="text" className="form-control glass-input" value={role} onChange={(e) => setRole(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Company / Organization *</label>
                <input type="text" className="form-control glass-input" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Period Duration *</label>
                <input type="text" className="form-control glass-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. Jan 2024 - Present" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Experience Type *</label>
                <select className="form-select glass-input" value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Training Program">Training Program</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Description</label>
                <textarea className="form-control glass-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Key duties and deliverables..." />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Add Experience
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Current Experience Records ({experience.length})</h5>
            
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-gold text-black">Record #{idx + 1}</span>
                  <button type="button" onClick={() => handleDelete(idx)} className="btn text-danger p-0 border-0">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Role / Job Title</label>
                    <input type="text" className="form-control glass-input" value={exp.role} onChange={(e) => handleUpdate(idx, 'role', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Company / Institution</label>
                    <input type="text" className="form-control glass-input" value={exp.company} onChange={(e) => handleUpdate(idx, 'company', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Duration Period</label>
                    <input type="text" className="form-control glass-input" value={exp.duration} onChange={(e) => handleUpdate(idx, 'duration', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Type</label>
                    <select className="form-select glass-input" value={exp.type} onChange={(e) => handleUpdate(idx, 'type', e.target.value)}>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Training Program">Training Program</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Job Description</label>
                    <textarea className="form-control glass-input" rows="3" value={exp.description} onChange={(e) => handleUpdate(idx, 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {experience.length === 0 && <p className="text-muted small text-center mb-0 py-3">No experience records logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageExperience;
