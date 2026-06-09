import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageAbout = () => {
  const { portfolioData, updateSection } = usePortfolioData();
  const { about } = portfolioData;

  const [biography, setBiography] = useState(about.biography || '');
  const [careerGoals, setCareerGoals] = useState(about.careerGoals || []);
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setCareerGoals([...careerGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index) => {
    setCareerGoals(careerGoals.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('about', {
      biography,
      careerGoals
    });
    toast.success('About Me details updated!');
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit About & Goals</h2>
        <p className="text-muted small">Update your bio introduction and list target career achievements</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-3">Biography Description</h5>
              <textarea
                rows="8"
                className="form-control glass-input"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Write a brief professional introduction..."
                required
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-3">Career Goals</h5>
              
              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="Add a new career goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                />
                <button type="button" onClick={handleAddGoal} className="btn btn-gold">
                  <FaPlus />
                </button>
              </div>

              <ul className="list-group list-group-flush bg-transparent">
                {careerGoals.map((goal, idx) => (
                  <li key={idx} className="list-group-item bg-transparent text-white-50 border-secondary px-0 py-2 d-flex justify-content-between align-items-center">
                    <span className="small">{goal}</span>
                    <button type="button" onClick={() => handleRemoveGoal(idx)} className="btn text-danger p-0 border-0">
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              {careerGoals.length === 0 && <p className="text-muted small text-center py-2">No goal points added yet.</p>}
            </div>

            <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2">
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageAbout;
