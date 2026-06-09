import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { toast } from 'react-toastify';
import { Save, Plus, Trash2, BookOpen, Briefcase, Code, Award, Target } from 'lucide-react';

const ManageEducationCareer = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lists
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [futureGoals, setFutureGoals] = useState([]);

  // Goal input buffer
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest('/profile/education-career');
        if (res.success && res.data) {
          const d = res.data;
          setEducation(d.education || []);
          setExperience(d.experience || []);
          setSkills(d.skills || []);
          setCertifications(d.certifications || []);
          setFutureGoals(d.futureGoals || []);
        }
      } catch (err) {
        toast.error('Failed to load professional history details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- EDUCATION ---
  const handleAddEdu = () => {
    setEducation([...education, { school: '', degree: '', stream: '', startYear: '', endYear: '', percentageOrCgpa: '', achievements: '' }]);
  };
  const handleRemoveEdu = (index) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };
  const handleEduChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  // --- EXPERIENCE ---
  const handleAddExp = () => {
    setExperience([...experience, { company: '', role: '', type: 'Full-Time', duration: '', description: '' }]);
  };
  const handleRemoveExp = (index) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };
  const handleExpChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  // --- SKILLS ---
  const handleAddSkill = () => {
    setSkills([...skills, { name: '', level: 'Intermediate', category: 'Technical' }]);
  };
  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };
  const handleSkillChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  // --- CERTIFICATIONS ---
  const handleAddCert = () => {
    setCertifications([...certifications, { title: '', issuer: '', date: '', link: '', credentialId: '' }]);
  };
  const handleRemoveCert = (index) => {
    setCertifications(certifications.filter((_, idx) => idx !== index));
  };
  const handleCertChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  // --- GOALS ---
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFutureGoals([...futureGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };
  const handleRemoveGoal = (index) => {
    setFutureGoals(futureGoals.filter((_, idx) => idx !== index));
  };

  // --- SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      education,
      experience,
      skills,
      certifications,
      futureGoals,
    };

    try {
      const res = await apiRequest('/profile/education-career', {
        method: 'PUT',
        body: payload,
      });

      if (res.success) {
        toast.success('Professional history details saved!');
      }
    } catch (err) {
      toast.error(err.message || 'Error saving timeline updates');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-transparent">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Education & Career</h2>
        <p className="text-muted small">Update career experience, degrees list, certificates link, skills set, and future goals list</p>
      </div>

      <form onSubmit={handleSave}>
        
        {/* Experience management */}
        <div className="glass-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-gold mb-0 d-flex align-items-center gap-2">
              <Briefcase size={20} />
              <span>Work Experience ({experience.length})</span>
            </h5>
            <button type="button" onClick={handleAddExp} className="btn btn-glass btn-sm d-flex align-items-center gap-1">
              <Plus size={16} />
              <span>Add Record</span>
            </button>
          </div>

          {experience.map((exp, idx) => (
            <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
              <div className="row g-3 align-items-end mb-2">
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Company Name</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={exp.company}
                    onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Role Title</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={exp.role}
                    onChange={(e) => handleExpChange(idx, 'role', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Position Type</label>
                  <select
                    className="form-select glass-input"
                    value={exp.type}
                    onChange={(e) => handleExpChange(idx, 'type', e.target.value)}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label text-white-50 small">Duration Period</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={exp.duration}
                    onChange={(e) => handleExpChange(idx, 'duration', e.target.value)}
                    placeholder="e.g. Jan 2024 - Present"
                    required
                  />
                </div>
                <div className="col-md-1 text-center">
                  <button type="button" onClick={() => handleRemoveExp(idx)} className="btn btn-outline-danger btn-sm p-2 w-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label text-white-50 small">Job Description</label>
                <textarea
                  rows="2"
                  className="form-control glass-input"
                  value={exp.description}
                  onChange={(e) => handleExpChange(idx, 'description', e.target.value)}
                  placeholder="Key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
          {experience.length === 0 && <p className="text-muted small text-center mb-0">No job records listed yet.</p>}
        </div>

        {/* Education management */}
        <div className="glass-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-gold mb-0 d-flex align-items-center gap-2">
              <BookOpen size={20} />
              <span>Education Records ({education.length})</span>
            </h5>
            <button type="button" onClick={handleAddEdu} className="btn btn-glass btn-sm d-flex align-items-center gap-1">
              <Plus size={16} />
              <span>Add Record</span>
            </button>
          </div>

          {education.map((edu, idx) => (
            <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
              <div className="row g-3 align-items-end mb-2">
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">School/College Name</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.school}
                    onChange={(e) => handleEduChange(idx, 'school', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Degree / Standard</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.degree}
                    onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-white-50 small">Stream / Subject</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.stream}
                    onChange={(e) => handleEduChange(idx, 'stream', e.target.value)}
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label text-white-50 small">Start Yr</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.startYear}
                    onChange={(e) => handleEduChange(idx, 'startYear', e.target.value)}
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label text-white-50 small">End Yr</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.endYear}
                    onChange={(e) => handleEduChange(idx, 'endYear', e.target.value)}
                  />
                </div>
                <div className="col-md-1 text-center">
                  <button type="button" onClick={() => handleRemoveEdu(idx)} className="btn btn-outline-danger btn-sm p-2 w-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Percentage / CGPA</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.percentageOrCgpa}
                    onChange={(e) => handleEduChange(idx, 'percentageOrCgpa', e.target.value)}
                    placeholder="e.g. 9.2 CGPA or 94.6%"
                  />
                </div>
                <div className="col-md-9">
                  <label className="form-label text-white-50 small">Academic Achievements</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={edu.achievements}
                    onChange={(e) => handleEduChange(idx, 'achievements', e.target.value)}
                    placeholder="Awards, medals, rank or projects details..."
                  />
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && <p className="text-muted small text-center mb-0">No education records listed yet.</p>}
        </div>

        {/* Skills management */}
        <div className="glass-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-gold mb-0 d-flex align-items-center gap-2">
              <Code size={20} />
              <span>Skill Sets ({skills.length})</span>
            </h5>
            <button type="button" onClick={handleAddSkill} className="btn btn-glass btn-sm d-flex align-items-center gap-1">
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="row g-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="col-lg-6">
                <div className="p-3 bg-black rounded border border-secondary d-flex align-items-end gap-2">
                  <div className="flex-grow-1">
                    <label className="form-label text-white-50 small">Skill Name</label>
                    <input
                      type="text"
                      className="form-control glass-input"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label text-white-50 small">Level</label>
                    <select
                      className="form-select glass-input"
                      value={skill.level}
                      onChange={(e) => handleSkillChange(idx, 'level', e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label text-white-50 small">Category</label>
                    <input
                      type="text"
                      className="form-control glass-input"
                      value={skill.category}
                      onChange={(e) => handleSkillChange(idx, 'category', e.target.value)}
                      placeholder="e.g. Frontend"
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="btn btn-outline-danger btn-sm p-2 mb-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {skills.length === 0 && <p className="text-muted small text-center mb-0 mt-2">No skills items listed yet.</p>}
        </div>

        {/* Certifications details & Goals */}
        <div className="row g-4 mb-4">
          {/* Certs column */}
          <div className="col-lg-6">
            <div className="glass-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-gold mb-0 d-flex align-items-center gap-2">
                  <Award size={20} />
                  <span>Certifications</span>
                </h5>
                <button type="button" onClick={handleAddCert} className="btn btn-glass btn-sm d-flex align-items-center gap-1">
                  <Plus size={16} />
                  <span>Add Cert</span>
                </button>
              </div>

              {certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-black rounded border border-secondary mb-3">
                  <div className="row g-2 align-items-end mb-2">
                    <div className="col">
                      <label className="form-label text-white-50 small">Title</label>
                      <input
                        type="text"
                        className="form-control glass-input"
                        value={cert.title}
                        onChange={(e) => handleCertChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>
                    <button type="button" onClick={() => handleRemoveCert(idx)} className="btn btn-outline-danger btn-sm p-2 col-auto mb-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small">Issuer</label>
                      <input
                        type="text"
                        className="form-control glass-input"
                        value={cert.issuer}
                        onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small">Credential URL</label>
                      <input
                        type="url"
                        className="form-control glass-input"
                        value={cert.link}
                        onChange={(e) => handleCertChange(idx, 'link', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {certifications.length === 0 && <p className="text-muted small text-center mb-0">No certificates listed yet.</p>}
            </div>
          </div>

          {/* Goals column */}
          <div className="col-lg-6">
            <div className="glass-card h-100">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <Target size={20} />
                <span>Career Goals ({futureGoals.length})</span>
              </h5>

              <div className="d-flex gap-2 mb-4">
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="Enter a new career goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                />
                <button type="button" onClick={handleAddGoal} className="btn btn-gold px-3">
                  Add
                </button>
              </div>

              <ul className="list-group list-group-flush bg-transparent">
                {futureGoals.map((goal, idx) => (
                  <li key={idx} className="list-group-item bg-transparent text-white border-secondary px-0 py-2 d-flex justify-content-between align-items-center">
                    <span className="small">{goal}</span>
                    <button type="button" onClick={() => handleRemoveGoal(idx)} className="btn text-danger p-0 border-0">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              {futureGoals.length === 0 && <p className="text-muted small text-center mb-0">No goal points added yet.</p>}
            </div>
          </div>
        </div>

        {/* Save button */}
        <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
          {submitting ? (
            <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
          ) : (
            <>
              <Save size={18} />
              <span>Save Professional Timeline</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ManageEducationCareer;
