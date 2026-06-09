import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageEducation = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { education } = portfolioData;

  // New item input states
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [duration, setDuration] = useState('');
  const [percentageOrCgpa, setPercentageOrCgpa] = useState('');
  const [achievements, setAchievements] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!school || !degree || !duration) {
      toast.warning('Please enter school name, degree title, and duration');
      return;
    }

    addItem('education', { school, degree, duration, percentageOrCgpa, achievements });
    toast.success('Education milestone added!');
    setSchool('');
    setDegree('');
    setDuration('');
    setPercentageOrCgpa('');
    setAchievements('');
  };

  const handleUpdate = (index, field, value) => {
    updateItem('education', index, { [field]: value });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this education milestone?')) {
      deleteItem('education', index);
      toast.info('Education record removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Education Timeline</h2>
        <p className="text-muted small">Manage school courses, degrees, board percentages, and academic honors</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Add Education Milestone</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Degree / Class Standard *</label>
                <input type="text" className="form-control glass-input" value={degree} onChange={(e) => setDegree(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">School / University Name *</label>
                <input type="text" className="form-control glass-input" value={school} onChange={(e) => setSchool(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Duration Period *</label>
                <input type="text" className="form-control glass-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2018 - 2022" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Percentage / CGPA</label>
                <input type="text" className="form-control glass-input" value={percentageOrCgpa} onChange={(e) => setPercentageOrCgpa(e.target.value)} placeholder="e.g. 9.1 CGPA" />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Achievements</label>
                <textarea className="form-control glass-input" rows="2" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="e.g. Gold medalist" />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Add Milestone
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Current Educational Timeline Records ({education.length})</h5>
            
            {education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-gold text-black">Record #{idx + 1}</span>
                  <button type="button" onClick={() => handleDelete(idx)} className="btn text-danger p-0 border-0">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Degree / Class Standard</label>
                    <input type="text" className="form-control glass-input" value={edu.degree} onChange={(e) => handleUpdate(idx, 'degree', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">School / University</label>
                    <input type="text" className="form-control glass-input" value={edu.school} onChange={(e) => handleUpdate(idx, 'school', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Duration Period</label>
                    <input type="text" className="form-control glass-input" value={edu.duration} onChange={(e) => handleUpdate(idx, 'duration', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Percentage / CGPA</label>
                    <input type="text" className="form-control glass-input" value={edu.percentageOrCgpa} onChange={(e) => handleUpdate(idx, 'percentageOrCgpa', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Academic Achievements</label>
                    <textarea className="form-control glass-input" rows="2" value={edu.achievements} onChange={(e) => handleUpdate(idx, 'achievements', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-muted small text-center mb-0 py-3">No educational records logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEducation;
