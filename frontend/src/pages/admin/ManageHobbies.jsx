import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash, FaLanguage, FaHeart } from 'react-icons/fa';

const ManageHobbies = () => {
  const { portfolioData, updateSection } = usePortfolioData();
  const { lifestyle } = portfolioData;

  const [newLang, setNewLang] = useState('');
  const [hobbyName, setHobbyName] = useState('');
  const [hobbyDesc, setHobbyDesc] = useState('');

  const languages = lifestyle?.languages || [];
  const hobbies = lifestyle?.hobbies || [];

  const handleAddLanguage = (e) => {
    e.preventDefault();
    const trimmed = newLang.trim();
    if (!trimmed) {
      toast.warning('Please enter a language tag');
      return;
    }
    if (languages.includes(trimmed)) {
      toast.warning('Language already exists!');
      return;
    }

    const updatedLangs = [...languages, trimmed];
    updateSection('lifestyle', { ...lifestyle, languages: updatedLangs });
    toast.success('Spoken language logged!');
    setNewLang('');
  };

  const handleDeleteLanguage = (index) => {
    const updatedLangs = languages.filter((_, idx) => idx !== index);
    updateSection('lifestyle', { ...lifestyle, languages: updatedLangs });
    toast.info('Language tag removed');
  };

  const handleAddHobby = (e) => {
    e.preventDefault();
    if (!hobbyName || !hobbyDesc) {
      toast.warning('Please fill in both name and description');
      return;
    }

    const updatedHobbies = [...hobbies, { name: hobbyName, description: hobbyDesc }];
    updateSection('lifestyle', { ...lifestyle, hobbies: updatedHobbies });
    toast.success('Hobby added successfully!');
    setHobbyName('');
    setHobbyDesc('');
  };

  const handleUpdateHobby = (index, field, value) => {
    const currentHobbies = [...hobbies];
    if (index >= 0 && index < currentHobbies.length) {
      currentHobbies[index] = { ...currentHobbies[index], [field]: value };
      updateSection('lifestyle', { ...lifestyle, hobbies: currentHobbies });
    }
  };

  const handleDeleteHobby = (index) => {
    if (window.confirm('Delete this hobby item?')) {
      const updatedHobbies = hobbies.filter((_, idx) => idx !== index);
      updateSection('lifestyle', { ...lifestyle, hobbies: updatedHobbies });
      toast.info('Hobby item removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Hobbies & Interests</h2>
        <p className="text-muted small">Manage your spoken languages, lifestyle hobbies, and personal interests</p>
      </div>

      <div className="row g-4">
        {/* Left Forms */}
        <div className="col-lg-4">
          
          {/* Spoken Languages Form */}
          <div className="glass-card mb-4">
            <h5 className="text-gold mb-3 d-flex align-items-center gap-2">
              <FaLanguage /> Spoken Languages
            </h5>
            <form onSubmit={handleAddLanguage} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="e.g. Spanish (Fluent)"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                />
                <button type="submit" className="btn btn-gold px-3">
                  <FaPlus />
                </button>
              </div>
            </form>
            
            {/* Languages Tags List */}
            <div className="d-flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span 
                  key={idx} 
                  className="badge bg-black border border-warning text-gold px-3 py-2 rounded d-flex align-items-center gap-2"
                >
                  <span>{lang}</span>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteLanguage(idx)}
                    className="btn text-danger p-0 border-0 bg-transparent"
                    style={{ fontSize: '0.8rem', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {languages.length === 0 && <span className="text-muted small">No languages configured.</span>}
            </div>
          </div>

          {/* Add Hobby Form */}
          <div className="glass-card">
            <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
              <FaHeart /> Add Lifestyle Hobby
            </h5>
            <form onSubmit={handleAddHobby}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Hobby Name *</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={hobbyName}
                  onChange={(e) => setHobbyName(e.target.value)}
                  placeholder="e.g. Street Photography"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Description *</label>
                <textarea
                  className="form-control glass-input"
                  rows="3"
                  value={hobbyDesc}
                  onChange={(e) => setHobbyDesc(e.target.value)}
                  placeholder="e.g. Capturing cityscape lighting and structural geometries."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
              >
                <FaPlus /> Add Hobby Card
              </button>
            </form>
          </div>

        </div>

        {/* Hobbies list */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Configured Hobbies & Activities ({hobbies.length})</h5>

            {hobbies.map((hob, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-gold text-black">Hobby Card #{idx + 1}</span>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteHobby(idx)} 
                    className="btn text-danger p-0 border-0"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Hobby Title</label>
                    <input 
                      type="text" 
                      className="form-control glass-input" 
                      value={hob.name} 
                      onChange={(e) => handleUpdateHobby(idx, 'name', e.target.value)} 
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Description</label>
                    <textarea 
                      className="form-control glass-input" 
                      rows="2" 
                      value={hob.description} 
                      onChange={(e) => handleUpdateHobby(idx, 'description', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
            {hobbies.length === 0 && <p className="text-muted small text-center mb-0 py-3">No hobbies logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHobbies;
