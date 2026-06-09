import React from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaFolder, FaGraduationCap, FaAward, FaImage, FaUndoAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { portfolioData, resetToDefault } = usePortfolioData();
  const { education, experience, skills, projects, certifications, gallery } = portfolioData;

  const handleReset = () => {
    const success = resetToDefault();
    if (success) {
      toast.success('Successfully reverted portfolio database back to defaults!');
    }
  };

  const stats = [
    { label: 'Featured Projects', count: projects.length, icon: <FaFolder />, color: 'text-gold' },
    { label: 'Skills Configured', count: skills.length, icon: <FaGraduationCap />, color: 'text-info' },
    { label: 'Credentials & Certs', count: certifications.length, icon: <FaAward />, color: 'text-success' },
    { label: 'Gallery Images', count: gallery.length, icon: <FaImage />, color: 'text-warning' },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Overview Dashboard</h2>
        <p className="text-muted small">Manage configurations, stats metrics, and restore backups in LocalStorage</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {stats.map((item, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className="admin-card-metric d-flex align-items-center justify-content-between p-4 bg-dark rounded border border-secondary">
              <div>
                <span className="text-muted small d-block">{item.label}</span>
                <h3 className="fw-bold text-white mb-0 mt-1">{item.count}</h3>
              </div>
              <div className={`fs-3 bg-black border border-secondary p-3 rounded-3 ${item.color}`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CMS Management Controls Card */}
      <div className="glass-card mb-4">
        <h5 className="text-gold mb-3 d-flex align-items-center gap-2">
          <FaUndoAlt /> System Tools & Resets
        </h5>
        <p className="text-muted small mb-4">
          If you want to clear your local storage modifications and return the profile to the high-fidelity default engineering template details, you can trigger the reset command.
        </p>
        <button
          onClick={handleReset}
          className="btn btn-outline-danger d-flex align-items-center gap-2"
        >
          <FaUndoAlt />
          <span>Reset All Details to default templates</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
