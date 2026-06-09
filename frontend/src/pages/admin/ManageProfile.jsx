import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { toast } from 'react-toastify';
import { Save, User, MapPin, Heart, HelpCircle } from 'lucide-react';

const ManageProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [statusBadge, setStatusBadge] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [motherTongue, setMotherTongue] = useState('');
  const [religion, setReligion] = useState('');
  const [location, setLocation] = useState('');

  // Social Links
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  // Contact Info
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest('/profile');
        if (res.success && res.data) {
          const d = res.data;
          setProfile(d);
          setFullName(d.fullName || '');
          setNickname(d.nickname || '');
          setProfessionalTitle(d.professionalTitle || '');
          setShortIntro(d.shortIntro || '');
          setStatusBadge(d.statusBadge || '');
          setProfileImage(d.profileImage || '');
          setAge(d.age || '');
          setDob(d.dob ? d.dob.substring(0, 10) : '');
          setGender(d.gender || '');
          setHeight(d.height || '');
          setWeight(d.weight || '');
          setBloodGroup(d.bloodGroup || '');
          setMaritalStatus(d.maritalStatus || '');
          setMotherTongue(d.motherTongue || '');
          setReligion(d.religion || '');
          setLocation(d.location || '');
          
          setGithub(d.socialLinks?.github || '');
          setLinkedin(d.socialLinks?.linkedin || '');
          setTwitter(d.socialLinks?.twitter || '');
          setInstagram(d.socialLinks?.instagram || '');

          setEmail(d.contactInfo?.email || '');
          setPhone(d.contactInfo?.phone || '');
          setWhatsapp(d.contactInfo?.whatsapp || '');
          setAddress(d.contactInfo?.address || '');
          setMapEmbedUrl(d.contactInfo?.mapEmbedUrl || '');
        }
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('nickname', nickname);
      formData.append('professionalTitle', professionalTitle);
      formData.append('shortIntro', shortIntro);
      formData.append('statusBadge', statusBadge);
      formData.append('age', age);
      formData.append('dob', dob);
      formData.append('gender', gender);
      formData.append('height', height);
      formData.append('weight', weight);
      formData.append('bloodGroup', bloodGroup);
      formData.append('maritalStatus', maritalStatus);
      formData.append('motherTongue', motherTongue);
      formData.append('religion', religion);
      formData.append('location', location);
      
      formData.append('socialLinks[github]', github);
      formData.append('socialLinks[linkedin]', linkedin);
      formData.append('socialLinks[twitter]', twitter);
      formData.append('socialLinks[instagram]', instagram);

      formData.append('contactInfo[email]', email);
      formData.append('contactInfo[phone]', phone);
      formData.append('contactInfo[whatsapp]', whatsapp);
      formData.append('contactInfo[address]', address);
      formData.append('contactInfo[mapEmbedUrl]', mapEmbedUrl);

      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await apiRequest('/profile', {
        method: 'PUT',
        body: formData,
      });

      if (res.success) {
        toast.success('Profile configurations updated!');
        if (res.data.profileImage) {
          setProfileImage(res.data.profileImage);
        }
        setImageFile(null);
      }
    } catch (err) {
      toast.error(err.message || 'Error saving profile edits');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gold-gradient mb-1">Personal Profile</h2>
          <p className="text-muted small">Update bio details, location coordinates, hero content, and contact information</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4">
          
          {/* Main Info Card */}
          <div className="col-lg-8">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <User size={18} />
                <span>Primary Metadata & Hero Section</span>
              </h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Full Profile Name *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Nickname</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Professional Designation *</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g. Lead Architect & Full Stack Designer"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Status Badge Label</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={statusBadge}
                    onChange={(e) => setStatusBadge(e.target.value)}
                    placeholder="e.g. Available for Projects"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Short Bio Introduction</label>
                  <textarea
                    rows="3"
                    className="form-control glass-input"
                    value={shortIntro}
                    onChange={(e) => setShortIntro(e.target.value)}
                    placeholder="Summarize your professional values and career overview..."
                  />
                </div>
              </div>
            </div>

            {/* Vital Statistics Details */}
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <Heart size={18} />
                <span>Vital Statistics / Bio parameters</span>
              </h5>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Age</label>
                  <input
                    type="number"
                    className="form-control glass-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control glass-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Gender</label>
                  <select className="form-select glass-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
                  <label className="form-label text-white-50 small">Marital Status</label>
                  <select className="form-select glass-input" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                    <option value="">Select Option</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Mother Tongue</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    placeholder="e.g. Hindi, English"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-50 small">Religion</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder="e.g. Hindu"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Current Location</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                  />
                </div>
              </div>
            </div>

            {/* Social Binds links */}
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <HelpCircle size={18} />
                <span>Social Media Integrations</span>
              </h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">GitHub URL</label>
                  <input
                    type="url"
                    className="form-control glass-input"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-control glass-input"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Twitter / X URL</label>
                  <input
                    type="url"
                    className="form-control glass-input"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Instagram URL</label>
                  <input
                    type="url"
                    className="form-control glass-input"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Side Column (Profile Image and Contact Details) */}
          <div className="col-lg-4">
            
            {/* Avatar Image Selection Card */}
            <div className="glass-card mb-4 text-center">
              <h5 className="text-gold mb-4 text-start">Profile Picture</h5>
              <div className="mb-3">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                  alt="Preview avatar"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid var(--gold-primary)' }}
                  className="rounded-circle mb-3 shadow"
                />
              </div>
              
              <div className="mb-3">
                <input
                  type="file"
                  id="avatarUpload"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-glass btn-sm w-100"
                  onClick={() => document.getElementById('avatarUpload').click()}
                >
                  Upload New Avatar Image
                </button>
                {imageFile && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-danger mt-2 text-decoration-none"
                    onClick={() => setImageFile(null)}
                  >
                    Cancel Selection
                  </button>
                )}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="glass-card">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <MapPin size={18} />
                <span>Contact Details</span>
              </h5>
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-white-50 small">Primary Email</label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="col-12">
                  <label className="form-label text-white-50 small">Phone Number</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Office / Home Address</label>
                  <textarea
                    rows="2"
                    className="form-control glass-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-white-50 small">Google Map Embed URL</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={mapEmbedUrl}
                    onChange={(e) => setMapEmbedUrl(e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
              </div>
            </div>

            {/* Save Panel Sticky Action */}
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;
