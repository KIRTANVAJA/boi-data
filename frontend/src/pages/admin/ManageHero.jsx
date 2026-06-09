import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaUser } from 'react-icons/fa';

const ManageHero = () => {
  const { portfolioData, updateSection } = usePortfolioData();
  const { personal } = portfolioData;

  const [fullName, setFullName] = useState(personal.fullName || '');
  const [professionalTitle, setProfessionalTitle] = useState(personal.professionalTitle || '');
  const [age, setAge] = useState(personal.age || '');
  const [dob, setDob] = useState(personal.dob || '');
  const [location, setLocation] = useState(personal.location || '');
  const [statusBadge, setStatusBadge] = useState(personal.statusBadge || '');
  const [avatarImage, setAvatarImage] = useState(personal.avatarImage || '');
  
  const [height, setHeight] = useState(personal.height || '');
  const [weight, setWeight] = useState(personal.weight || '');
  const [bloodGroup, setBloodGroup] = useState(personal.bloodGroup || '');
  const [maritalStatus, setMaritalStatus] = useState(personal.maritalStatus || '');
  const [motherTongue, setMotherTongue] = useState(personal.motherTongue || '');
  const [religion, setReligion] = useState(personal.religion || '');

  // Social Links
  const [github, setGithub] = useState(personal.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(personal.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(personal.socialLinks?.twitter || '');
  const [instagram, setInstagram] = useState(personal.socialLinks?.instagram || '');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('personal', {
      fullName,
      professionalTitle,
      age: parseInt(age, 10) || 0,
      dob,
      location,
      statusBadge,
      avatarImage,
      height,
      weight,
      bloodGroup,
      maritalStatus,
      motherTongue,
      religion,
      socialLinks: { github, linkedin, twitter, instagram }
    });
    toast.success('Hero Section & Personal Info updated in LocalStorage!');
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Hero & Personal Info</h2>
        <p className="text-muted small">Update profile titles, status badges, vital statistics, and social links</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <FaUser /> Hero & Profile Overview
              </h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Full Name *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Professional Designation *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Status Badge</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={statusBadge}
                    onChange={(e) => setStatusBadge(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Location *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Avatar Image URL / Local Path *</label>
                  <input
                    type="text"
                    className="form-control glass-input mb-2"
                    value={avatarImage}
                    onChange={(e) => setAvatarImage(e.target.value)}
                    placeholder="e.g. /assets/avatar.jpg or URL"
                    required
                  />
                  <label className="form-label text-white-50 small d-block">Or Upload Local Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control glass-input"
                    onChange={(e) => handleImageUpload(e, setAvatarImage)}
                  />
                </div>
              </div>
            </div>

            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4">Vital Statistics Details</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Age *</label>
                  <input
                    type="number"
                    className="form-control glass-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Date of Birth</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="e.g. April 15, 2000"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Blood Group</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="e.g. O+"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Height</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 5'10''"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Weight</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 72 kg"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Marital Status</label>
                  <select className="form-select glass-input" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Mother Tongue</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Religion</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card mb-4 text-center">
              <h5 className="text-gold mb-3 text-start">Profile Image Preview</h5>
              <img
                src={avatarImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
                alt="Avatar preview"
                className="rounded-circle mb-3"
                style={{ width: '140px', height: '140px', objectFit: 'cover', border: '3px solid var(--gold-primary)' }}
              />
            </div>

            <div className="glass-card">
              <h5 className="text-gold mb-4">Social Accounts</h5>
              <div className="mb-3">
                <label className="form-label text-white-50 small">GitHub URL</label>
                <input type="url" className="form-control glass-input" value={github} onChange={(e) => setGithub(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">LinkedIn URL</label>
                <input type="url" className="form-control glass-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Twitter URL</label>
                <input type="url" className="form-control glass-input" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Instagram URL</label>
                <input type="url" className="form-control glass-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-gold w-100 py-3 mt-4 d-flex align-items-center justify-content-center gap-2">
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageHero;
