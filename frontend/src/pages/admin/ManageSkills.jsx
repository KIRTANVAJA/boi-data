import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageSkills = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { skills } = portfolioData;

  const [name, setName] = useState('');
  const [levelPercent, setLevelPercent] = useState(80);
  const [category, setCategory] = useState('Frontend');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) {
      toast.warning('Please enter skill name');
      return;
    }

    addItem('skills', { name, levelPercent: parseInt(levelPercent, 10), category });
    toast.success('Skill tag added successfully!');
    setName('');
    setLevelPercent(80);
  };

  const handleUpdate = (index, field, value) => {
    const parsedVal = field === 'levelPercent' ? parseInt(value, 10) : value;
    updateItem('skills', index, { [field]: parsedVal });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this skill tag?')) {
      deleteItem('skills', index);
      toast.info('Skill removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Skills Matrix</h2>
        <p className="text-muted small">Update language capabilities, developer platforms, and cloud operations metrics</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Add Skill Item</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Skill Name *</label>
                <input type="text" className="form-control glass-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Next.js" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Category Group *</label>
                <select className="form-select glass-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Soft">Soft Skills</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small d-flex justify-content-between">
                  <span>Proficiency Level *</span>
                  <span className="text-gold">{levelPercent}%</span>
                </label>
                <input type="range" className="form-range" min="10" max="100" step="5" value={levelPercent} onChange={(e) => setLevelPercent(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Add Skill Tag
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Configured Skills ({skills.length})</h5>
            
            {skills.map((skill, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3 d-flex align-items-center gap-3">
                <div className="flex-grow-1">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-5">
                      <label className="form-label text-white-50 small" style={{ fontSize: '0.75rem' }}>Skill Name</label>
                      <input type="text" className="form-control glass-input" value={skill.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-white-50 small" style={{ fontSize: '0.75rem' }}>Category</label>
                      <select className="form-select glass-input" value={skill.category} onChange={(e) => handleUpdate(idx, 'category', e.target.value)}>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Soft">Soft Skills</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-white-50 small d-flex justify-content-between" style={{ fontSize: '0.75rem' }}>
                        <span>Level</span>
                        <span className="text-gold">{skill.levelPercent}%</span>
                      </label>
                      <input type="range" className="form-range" min="10" max="100" step="5" value={skill.levelPercent} onChange={(e) => handleUpdate(idx, 'levelPercent', e.target.value)} />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleDelete(idx)} className="btn text-danger p-0 border-0 mt-3">
                  <FaTrash />
                </button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-muted small text-center mb-0 py-3">No skills logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSkills;
