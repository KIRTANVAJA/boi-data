import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageProjects = () => {
  const { portfolioData, addItem, updateItem, deleteItem } = usePortfolioData();
  const { projects } = portfolioData;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [image, setImage] = useState('');

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
    if (!title || !description || !tags) {
      toast.warning('Please fill in title, description, and tags');
      return;
    }

    addItem('projects', { title, description, tags, githubLink, demoLink, image });
    toast.success('Project card created!');
    setTitle('');
    setDescription('');
    setTags('');
    setGithubLink('');
    setDemoLink('');
    setImage('');
  };

  const handleUpdate = (index, field, value) => {
    updateItem('projects', index, { [field]: value });
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this project card?')) {
      deleteItem('projects', index);
      toast.info('Project removed');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Projects Showcase</h2>
        <p className="text-muted small">Manage portfolio showcase items. Customize titles, links, and cover images.</p>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Add Project Card</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Project Title *</label>
                <input type="text" className="form-control glass-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Category Tags (Comma separated) *</label>
                <input type="text" className="form-control glass-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React.js, Bootstrap 5" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Project Description *</label>
                <textarea className="form-control glass-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">GitHub Repo Link</label>
                <input type="url" className="form-control glass-input" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Live Demo Link</label>
                <input type="url" className="form-control glass-input" value={demoLink} onChange={(e) => setDemoLink(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Cover Image URL / Local Path</label>
                <input type="text" className="form-control glass-input mb-2" value={image} onChange={(e) => setImage(e.target.value)} placeholder="e.g. /assets/project.jpg or URL" />
                <label className="form-label text-white-50 small d-block">Or Upload Local Image</label>
                <input type="file" accept="image/*" className="form-control glass-input" onChange={(e) => handleImageUpload(e, setImage)} />
              </div>
              <button type="submit" className="btn btn-gold w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Add Project Card
              </button>
            </form>
          </div>
        </div>

        {/* Existing List */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-gold mb-4">Current Projects ({projects.length})</h5>
            
            {projects.map((proj, idx) => (
              <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-gold text-black">Project #{idx + 1}</span>
                  <button type="button" onClick={() => handleDelete(idx)} className="btn text-danger p-0 border-0">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Project Title</label>
                    <input type="text" className="form-control glass-input" value={proj.title} onChange={(e) => handleUpdate(idx, 'title', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Category Tags</label>
                    <input type="text" className="form-control glass-input" value={proj.tags} onChange={(e) => handleUpdate(idx, 'tags', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Description</label>
                    <textarea className="form-control glass-input" rows="2" value={proj.description} onChange={(e) => handleUpdate(idx, 'description', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Repo Link</label>
                    <input type="url" className="form-control glass-input" value={proj.githubLink} onChange={(e) => handleUpdate(idx, 'githubLink', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white-50 small">Live Link</label>
                    <input type="url" className="form-control glass-input" value={proj.demoLink} onChange={(e) => handleUpdate(idx, 'demoLink', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white-50 small">Cover Image URL / Local Path</label>
                    <input type="text" className="form-control glass-input mb-2" value={proj.image} onChange={(e) => handleUpdate(idx, 'image', e.target.value)} />
                    <label className="form-label text-white-50 small d-block">Or Upload Local Image</label>
                    <input type="file" accept="image/*" className="form-control glass-input" onChange={(e) => handleImageUpload(e, (val) => handleUpdate(idx, 'image', val))} />
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-muted small text-center mb-0 py-3">No projects logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjects;
