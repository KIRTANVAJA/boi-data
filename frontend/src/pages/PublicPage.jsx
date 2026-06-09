import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext.jsx';
import { apiRequest } from '../utils/api.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import {
  User, Calendar, Activity, MapPin, Heart, Mail, Phone, BookOpen,
  Briefcase, Award, Zap, Code, Plus, ExternalLink, Github, Linkedin,
  Twitter, Instagram, Compass, MessageSquare, Download, Share2, Eye
} from 'lucide-react';

const PublicPage = () => {
  const { settings, trackView } = useSettings();
  const [profile, setProfile] = useState(null);
  const [family, setFamily] = useState(null);
  const [educationCareer, setEducationCareer] = useState(null);
  const [lifestyle, setLifestyle] = useState(null);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter project category
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeAlbum, setActiveAlbum] = useState('All');

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lightbox State
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxType, setLightboxType] = useState('image');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, familyRes, edCarRes, lifestyleRes, projectsRes, achievementsRes, galleryRes] = await Promise.all([
          apiRequest('/profile'),
          apiRequest('/profile/family'),
          apiRequest('/profile/education-career'),
          apiRequest('/profile/lifestyle'),
          apiRequest('/portfolio/projects'),
          apiRequest('/portfolio/achievements'),
          apiRequest('/portfolio/gallery'),
        ]);

        if (profileRes.success) setProfile(profileRes.data);
        if (familyRes.success) setFamily(familyRes.data);
        if (edCarRes.success) setEducationCareer(edCarRes.data);
        if (lifestyleRes.success) setLifestyle(lifestyleRes.data);
        if (projectsRes.success) setProjects(projectsRes.data);
        if (achievementsRes.success) setAchievements(achievementsRes.data);
        if (galleryRes.success) setGallery(galleryRes.data);

        // Track page view for analytics
        trackView('/');
      } catch (err) {
        console.error('Failed to load portfolio details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.warning('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/request/contact', {
        method: 'POST',
        body: { name, email, subject, message },
      });
      toast.success('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to deliver message');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black text-warning">
        <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-gold-gradient fw-bold">Compiling Digital Profile...</h5>
      </div>
    );
  }

  // Section Ordering and Visibility
  const sections = settings?.sectionOrder || [
    'hero', 'personal', 'family', 'education', 'career', 'projects', 'achievements', 'gallery', 'lifestyle', 'contact'
  ];

  // Helper lists for Tag filtering
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags || []))];
  const filteredProjects = selectedTag === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(selectedTag));

  // Helper lists for Album filtering
  const allAlbums = ['All', ...new Set(gallery.map(g => g.albumName || 'General'))];
  const filteredGallery = activeAlbum === 'All'
    ? gallery
    : gallery.filter(g => g.albumName === activeAlbum);

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-black text-white">
      {/* Floating Header */}
      <Navbar profileName={profile?.fullName} activeSections={sections} />

      {/* Main sections render based on order */}
      <div className="container py-4 flex-grow-1">
        {sections.includes('hero') && profile && (
          <section id="hero" className="row align-items-center justify-content-between py-5 mb-5 animate-fade-up">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="badge badge-glow bg-transparent text-gold px-3 py-2 rounded-pill small mb-3">
                ✨ {profile.statusBadge || 'Active'}
              </span>
              <h1 className="display-4 fw-extrabold text-gold-gradient mb-2">{profile.fullName}</h1>
              <h3 className="h4 text-white-50 mb-3">{profile.professionalTitle}</h3>
              <p className="lead text-muted mb-4">{profile.shortIntro}</p>

              {/* Social links */}
              <div className="d-flex gap-3 mb-4 fs-5">
                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-white hover-gold">
                    <Github size={24} />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white hover-gold">
                    <Linkedin size={24} />
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-white hover-gold">
                    <Twitter size={24} />
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-white hover-gold">
                    <Instagram size={24} />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap gap-3">
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-gold px-4 py-3">
                  Let's Connect
                </button>
                <button onClick={handlePrint} className="btn btn-glass d-flex align-items-center gap-2 px-4 py-3">
                  <Download size={18} className="text-gold" />
                  <span>Download CV / Print</span>
                </button>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <div 
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-15px',
                    right: '-15px',
                    bottom: '-15px',
                    border: '2px dashed var(--gold-primary)',
                    borderRadius: '50%',
                    opacity: 0.3,
                    animation: 'spin 40s linear infinite',
                  }}
                />
                <img
                  src={profile.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                  alt={profile.fullName}
                  style={{ width: '320px', height: '320px', objectFit: 'cover', border: '4px solid var(--gold-primary)' }}
                  className="rounded-circle shadow-lg position-relative"
                />
              </div>
            </div>
          </section>
        )}

        {/* Personal Details Section */}
        {sections.includes('personal') && profile && (
          <section id="personal" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Biodata Summary</h2>
            <div className="row g-4">
              {[
                { label: 'Full Name', val: profile.fullName, icon: <User size={20} /> },
                { label: 'Nickname', val: profile.nickname, icon: <Heart size={20} /> },
                { label: 'Age', val: profile.age ? `${profile.age} Years` : null, icon: <Activity size={20} /> },
                { label: 'Date of Birth', val: getFormattedDate(profile.dob), icon: <Calendar size={20} /> },
                { label: 'Gender', val: profile.gender, icon: <Activity size={20} /> },
                { label: 'Height', val: profile.height, icon: <Activity size={20} /> },
                { label: 'Weight', val: profile.weight, icon: <Activity size={20} /> },
                { label: 'Blood Group', val: profile.bloodGroup, icon: <Activity size={20} /> },
                { label: 'Marital Status', val: profile.maritalStatus, icon: <Heart size={20} /> },
                { label: 'Religion', val: profile.religion, icon: <Compass size={20} /> },
                { label: 'Mother Tongue', val: profile.motherTongue, icon: <User size={20} /> },
                { label: 'Location', val: profile.location, icon: <MapPin size={20} /> },
              ].map((item, idx) => {
                if (!item.val) return null;
                return (
                  <div key={idx} className="col-md-6 col-lg-3">
                    <div className="glass-card h-100 d-flex align-items-center gap-3">
                      <div className="text-gold p-2 bg-black rounded border border-secondary">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-muted small">{item.label}</div>
                        <div className="fw-semibold text-white">{item.val}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Family Section */}
        {sections.includes('family') && family && (
          <section id="family" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Family Profile</h2>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="glass-card h-100">
                  <h4 className="text-gold mb-4 border-bottom border-secondary pb-2">Parents</h4>
                  <div className="mb-3">
                    <span className="text-muted small d-block">Father Details</span>
                    <strong className="text-white d-block">{family.fatherDetails?.name || 'N/A'}</strong>
                    <span className="text-white-50 small">{family.fatherDetails?.occupation || 'N/A'}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted small d-block">Mother Details</span>
                    <strong className="text-white d-block">{family.motherDetails?.name || 'N/A'}</strong>
                    <span className="text-white-50 small">{family.motherDetails?.occupation || 'N/A'}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted small d-block">Family Structure</span>
                    <span className="badge bg-gold text-black mt-1">{family.familyType} Family</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="glass-card h-100">
                  <h4 className="text-gold mb-4 border-bottom border-secondary pb-2">Siblings & Details</h4>
                  
                  {family.brothers?.length > 0 && (
                    <div className="mb-3">
                      <span className="text-muted small d-block mb-1">Brothers</span>
                      {family.brothers.map((bro, idx) => (
                        <div key={idx} className="bg-black p-2 rounded border border-secondary mb-1">
                          <strong className="text-white">{bro.name}</strong> - <span className="text-white-50 small">{bro.occupation}</span>
                          <span className="badge bg-secondary ms-2">{bro.maritalStatus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {family.sisters?.length > 0 && (
                    <div className="mb-3">
                      <span className="text-muted small d-block mb-1">Sisters</span>
                      {family.sisters.map((sis, idx) => (
                        <div key={idx} className="bg-black p-2 rounded border border-secondary mb-1">
                          <strong className="text-white">{sis.name}</strong> - <span className="text-white-50 small">{sis.occupation}</span>
                          <span className="badge bg-secondary ms-2">{sis.maritalStatus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <span className="text-muted small d-block">Family Background</span>
                    <p className="text-white-50 small mt-1">{family.familyBackground || 'No description provided.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Education & Career Timeline Section */}
        {sections.includes('education') && educationCareer && (
          <section id="education" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-5">Professional Timeline</h2>
            <div className="row g-5">
              {/* Experience Column */}
              <div className="col-lg-6">
                <h4 className="text-gold mb-4 d-flex align-items-center gap-2">
                  <Briefcase size={22} />
                  <span>Work Experience</span>
                </h4>
                <div className="timeline-gold ms-2">
                  {educationCareer.experience?.map((exp, idx) => (
                    <div key={idx} className="position-relative mb-4 pb-2">
                      <div className="timeline-dot" />
                      <span className="badge bg-secondary text-white-50 small mb-1">{exp.duration}</span>
                      <h5 className="fw-semibold text-white mb-0">{exp.role}</h5>
                      <div className="text-gold small mb-2">{exp.company} | <span className="text-white-50">{exp.type}</span></div>
                      <p className="text-muted small">{exp.description}</p>
                    </div>
                  ))}
                  {(!educationCareer.experience || educationCareer.experience.length === 0) && (
                    <p className="text-muted small">No experience records found.</p>
                  )}
                </div>
              </div>

              {/* Education Column */}
              <div className="col-lg-6">
                <h4 className="text-gold mb-4 d-flex align-items-center gap-2">
                  <BookOpen size={22} />
                  <span>Education Details</span>
                </h4>
                <div className="timeline-gold ms-2">
                  {educationCareer.education?.map((edu, idx) => (
                    <div key={idx} className="position-relative mb-4 pb-2">
                      <div className="timeline-dot" />
                      <span className="badge bg-secondary text-white-50 small mb-1">{edu.startYear} - {edu.endYear}</span>
                      <h5 className="fw-semibold text-white mb-0">{edu.degree}</h5>
                      <div className="text-gold small mb-2">{edu.school}</div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-dark border border-warning text-gold">{edu.percentageOrCgpa}</span>
                        <span className="text-muted small">{edu.achievements}</span>
                      </div>
                    </div>
                  ))}
                  {(!educationCareer.education || educationCareer.education.length === 0) && (
                    <p className="text-muted small">No education records found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills grid */}
            {educationCareer.skills?.length > 0 && (
              <div className="mt-5">
                <h4 className="text-gold mb-4 d-flex align-items-center gap-2 justify-content-center">
                  <Code size={22} />
                  <span>Core Expertise & Skills</span>
                </h4>
                <div className="glass-card">
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {educationCareer.skills.map((skill, idx) => (
                      <div key={idx} className="bg-black border border-secondary px-3 py-2 rounded d-flex align-items-center gap-2">
                        <span className="text-gold fw-semibold small">{skill.name}</span>
                        <span className="badge bg-dark text-muted small">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certifications and Future Goals */}
            <div className="row g-4 mt-4">
              {educationCareer.certifications?.length > 0 && (
                <div className="col-md-6">
                  <div className="glass-card h-100">
                    <h5 className="text-gold mb-3 d-flex align-items-center gap-2">
                      <Award size={20} />
                      <span>Certifications</span>
                    </h5>
                    <ul className="list-group list-group-flush bg-transparent">
                      {educationCareer.certifications.map((cert, idx) => (
                        <li key={idx} className="list-group-item bg-transparent text-white border-secondary px-0 py-2 d-flex justify-content-between align-items-center">
                          <div>
                            <strong className="d-block small">{cert.title}</strong>
                            <span className="text-white-50 small">{cert.issuer}</span>
                          </div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noreferrer" className="text-gold hover-glow">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {educationCareer.futureGoals?.length > 0 && (
                <div className="col-md-6">
                  <div className="glass-card h-100">
                    <h5 className="text-gold mb-3 d-flex align-items-center gap-2">
                      <Zap size={20} />
                      <span>Career Path & Goals</span>
                    </h5>
                    <ul className="list-unstyled">
                      {educationCareer.futureGoals.map((goal, idx) => (
                        <li key={idx} className="d-flex align-items-start gap-2 mb-2">
                          <span className="text-gold mt-1">•</span>
                          <span className="text-muted small">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {sections.includes('projects') && projects.length > 0 && (
          <section id="projects" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Featured Work</h2>
            
            {/* Filter Tags */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`btn ${selectedTag === tag ? 'btn-gold' : 'btn-glass'} py-1 px-3`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="row g-4">
              {filteredProjects.map((proj) => (
                <div key={proj._id} className="col-md-6 col-lg-4">
                  <div className="glass-card h-100 d-flex flex-column p-0 overflow-hidden">
                    <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                      <img
                        src={proj.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'}
                        alt={proj.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div className="p-4 flex-grow-1 d-flex flex-column">
                      <h5 className="text-white fw-bold mb-2">{proj.title}</h5>
                      <p className="text-muted small flex-grow-1">{proj.description}</p>
                      
                      {/* Tags */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {proj.tags?.map(t => (
                          <span key={t} className="badge bg-dark text-white-50 border border-secondary small">{t}</span>
                        ))}
                      </div>

                      {/* Project Links */}
                      <div className="d-flex gap-2">
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm d-flex align-items-center gap-1 flex-fill justify-content-center">
                            <Github size={14} />
                            <span>Source</span>
                          </a>
                        )}
                        {proj.demoLink && (
                          <a href={proj.demoLink} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm d-flex align-items-center gap-1 flex-fill justify-content-center">
                            <ExternalLink size={14} />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {sections.includes('achievements') && achievements.length > 0 && (
          <section id="achievements" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Milestones & Recognitions</h2>
            <div className="row g-4">
              {achievements.map((ach) => (
                <div key={ach._id} className="col-md-6 col-lg-4">
                  <div className="glass-card h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-gold text-black small">{ach.category}</span>
                      <span className="text-muted small">{getFormattedDate(ach.date)}</span>
                    </div>
                    <h5 className="text-white fw-semibold mb-2">{ach.title}</h5>
                    <p className="text-muted small mb-0">{ach.description}</p>
                    {ach.documentUrl && (
                      <button 
                        onClick={() => { setLightboxSrc(ach.documentUrl); setLightboxType('image'); }}
                        className="btn btn-link text-gold small p-0 mt-3 hover-glow text-decoration-none"
                      >
                        View Certificate Document →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {sections.includes('gallery') && gallery.length > 0 && (
          <section id="gallery" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Media Portfolio</h2>
            
            {/* Filter Albums */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {allAlbums.map(album => (
                <button
                  key={album}
                  className={`btn ${activeAlbum === album ? 'btn-gold' : 'btn-glass'} py-1 px-3`}
                  onClick={() => setActiveAlbum(album)}
                >
                  {album}
                </button>
              ))}
            </div>

            <div className="row g-3">
              {filteredGallery.map((item) => (
                <div key={item._id} className="col-sm-6 col-md-4 col-lg-3">
                  <div 
                    onClick={() => { setLightboxSrc(item.mediaUrl); setLightboxType(item.mediaType); }}
                    style={{ cursor: 'pointer', height: '180px', position: 'relative', overflow: 'hidden' }}
                    className="glass-card p-0 rounded-3 border border-secondary"
                  >
                    {item.mediaType === 'video' ? (
                      <div className="w-100 h-100 bg-black d-flex align-items-center justify-content-center">
                        <span className="badge bg-gold text-black">Play Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    <div 
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        padding: '10px'
                      }}
                    >
                      <span className="text-white small fw-semibold truncate d-block">{item.title || 'View Media'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lifestyle details section */}
        {sections.includes('lifestyle') && lifestyle && (
          <section id="lifestyle" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Interests & Hobbies</h2>
            <div className="row g-4">
              {/* Hobbies Card */}
              {lifestyle.hobbies?.length > 0 && (
                <div className="col-md-6 col-lg-4">
                  <div className="glass-card h-100">
                    <h5 className="text-gold mb-3">Activities & Hobbies</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {lifestyle.hobbies.map((hob, idx) => (
                        <span key={idx} className="badge bg-dark border border-secondary text-white small px-2 py-1">{hob}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Interests Card */}
              {lifestyle.interests?.length > 0 && (
                <div className="col-md-6 col-lg-4">
                  <div className="glass-card h-100">
                    <h5 className="text-gold mb-3">Interests & Research</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {lifestyle.interests.map((int, idx) => (
                        <span key={idx} className="badge bg-dark border border-secondary text-white-50 small px-2 py-1">{int}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Languages known Card */}
              {lifestyle.languages?.length > 0 && (
                <div className="col-md-6 col-lg-4">
                  <div className="glass-card h-100">
                    <h5 className="text-gold mb-3">Spoken Languages</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {lifestyle.languages.map((lang, idx) => (
                        <span key={idx} className="badge bg-black border border-warning text-gold small px-2 py-1">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact section */}
        {sections.includes('contact') && profile && (
          <section id="contact" className="py-5 mb-5">
            <h2 className="text-center text-gold-gradient fw-bold mb-4">Get In Touch</h2>
            <div className="row g-5">
              {/* Contact info column */}
              <div className="col-lg-5">
                <div className="glass-card h-100">
                  <h4 className="text-gold mb-4">Contact Details</h4>
                  
                  {profile.contactInfo?.email && (
                    <div className="mb-4 d-flex align-items-center gap-3">
                      <div className="text-gold p-2 bg-black border border-secondary rounded">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Write Email</span>
                        <a href={`mailto:${profile.contactInfo.email}`} className="text-white hover-gold text-decoration-none fw-semibold">
                          {profile.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.contactInfo?.phone && (
                    <div className="mb-4 d-flex align-items-center gap-3">
                      <div className="text-gold p-2 bg-black border border-secondary rounded">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Phone Support</span>
                        <a href={`tel:${profile.contactInfo.phone}`} className="text-white hover-gold text-decoration-none fw-semibold">
                          {profile.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.contactInfo?.address && (
                    <div className="mb-4 d-flex align-items-center gap-3">
                      <div className="text-gold p-2 bg-black border border-secondary rounded">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Mailing Address</span>
                        <p className="text-white small mb-0 fw-semibold">{profile.contactInfo.address}</p>
                      </div>
                    </div>
                  )}

                  {/* QR Code sharing section */}
                  <div className="pt-4 border-top border-secondary text-center">
                    <h6 className="text-gold mb-3 d-flex align-items-center justify-content-center gap-2">
                      <Share2 size={16} />
                      <span>Scan Profile to Share</span>
                    </h6>
                    <div className="bg-white p-3 d-inline-block rounded-3 shadow">
                      <QRCodeSVG value={window.location.href} size={110} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form column */}
              <div className="col-lg-7">
                <div className="glass-card h-100">
                  <h4 className="text-gold mb-4">Send Message Request</h4>
                  <form onSubmit={handleContactSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-gold small">Your Name *</label>
                        <input
                          type="text"
                          className="form-control glass-input"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-gold small">Your Email *</label>
                        <input
                          type="email"
                          className="form-control glass-input"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-gold small">Subject</label>
                        <input
                          type="text"
                          className="form-control glass-input"
                          placeholder="Message subject summary"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-gold small">Message Content *</label>
                        <textarea
                          rows="4"
                          className="form-control glass-input"
                          placeholder="Type your message description here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-gold w-100 mt-4 d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
                      {submitting ? (
                        <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
                      ) : (
                        <>
                          <MessageSquare size={16} />
                          <span>Deliver Message Request</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Map Embed Ifram */}
            {profile.contactInfo?.mapEmbedUrl && (
              <div className="mt-5 rounded-4 overflow-hidden border border-secondary shadow-lg" style={{ height: '350px' }}>
                <iframe
                  title="Google Map Location"
                  src={profile.contactInfo.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </section>
        )}
      </div>

      {/* Lightbox full preview dialog */}
      {lightboxSrc && (
        <div 
          onClick={() => setLightboxSrc(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', cursor: 'pointer'
          }}
        >
          {lightboxType === 'video' ? (
            <video src={lightboxSrc} controls autoPlay style={{ maxWidth: '100%', maxHeight: '90vh' }} onClick={e => e.stopPropagation()} />
          ) : (
            <img src={lightboxSrc} alt="Lightbox Preview" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}

      {/* Footer copyright */}
      <Footer profileName={profile?.fullName} />
    </div>
  );
};

export default PublicPage;
