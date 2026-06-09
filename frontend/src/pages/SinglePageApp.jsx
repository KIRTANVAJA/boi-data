import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData.js';
import Navbar from '../components/Navbar.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { QRCodeSVG } from 'qrcode.react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// React Icons
import {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaDownload, FaMapPin,
  FaEnvelope, FaPhone, FaArrowUp, FaAngleRight, FaAward, FaCalendarAlt,
  FaHeart, FaUsers, FaDumbbell, FaCamera, FaPlane, FaLaptopCode
} from 'react-icons/fa';

const SinglePageApp = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState('All');

  const { personal, about, education, experience, skills, projects, certifications, family, lifestyle, gallery, contact } = portfolioData;

  useEffect(() => {
    // Initialize AOS scroll animations
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Scroll listener for back-to-top button visibility
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Gallery tabs lists
  const galleryTabs = ['All', ...new Set(gallery.map(item => item.category))];
  const filteredGallery = activeGalleryTab === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeGalleryTab);

  return (
    <div className="min-vh-100 d-flex flex-column bg-black text-white position-relative">
      
      {/* 1. Navbar Header */}
      <Navbar fullName={personal.fullName} />

      {/* Main Single Page Content */}
      <div className="container py-5 flex-grow-1">
        
        {/* 1. Hero Section */}
        <section id="hero" className="row align-items-center justify-content-between py-5 mb-5 overflow-hidden">
          <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
            <span className="badge badge-glow bg-transparent text-gold px-3 py-2 rounded-pill mb-3">
              ✨ {personal.statusBadge}
            </span>
            <h1 className="display-4 fw-extrabold text-gold-gradient mb-2">{personal.fullName}</h1>
            <h3 className="h4 text-white-50 mb-3">{personal.professionalTitle}</h3>
            
            <div className="mb-4 d-flex flex-wrap gap-4 text-white-50 small">
              <span className="d-flex align-items-center gap-2"><FaCalendarAlt className="text-gold" /> Age: {personal.age} Years</span>
              <span className="d-flex align-items-center gap-2"><FaMapPin className="text-gold" /> {personal.location}</span>
            </div>
            
            <p className="lead text-muted mb-4">{about.biography}</p>

            {/* Social binds */}
            <div className="d-flex gap-3 mb-4 fs-4">
              {personal.socialLinks.github && (
                <a href={personal.socialLinks.github} target="_blank" rel="noreferrer" className="text-white hover-gold">
                  <FaGithub />
                </a>
              )}
              {personal.socialLinks.linkedin && (
                <a href={personal.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white hover-gold">
                  <FaLinkedin />
                </a>
              )}
              {personal.socialLinks.twitter && (
                <a href={personal.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-white hover-gold">
                  <FaTwitter />
                </a>
              )}
              {personal.socialLinks.instagram && (
                <a href={personal.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-white hover-gold">
                  <FaInstagram />
                </a>
              )}
            </div>

            {/* Print/Download Resume actions */}
            <div className="d-flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-gold px-4 py-3">
                Let's Connect
              </button>
              <button onClick={handlePrint} className="btn btn-glass d-flex align-items-center gap-2 px-4 py-3">
                <FaDownload className="text-gold" />
                <span>Print Biodata Sheet</span>
              </button>
            </div>
          </div>

          <div className="col-lg-5 text-center" data-aos="fade-left">
            <div className="position-relative d-inline-block">
              <div
                style={{
                  position: 'absolute', top: '-15px', left: '-15px', right: '-15px', bottom: '-15px',
                  border: '2px dashed var(--gold-primary)', borderRadius: '50%', opacity: 0.25,
                  animation: 'spin 50s linear infinite'
                }}
              />
              <img
                src={personal.avatarImage}
                alt={personal.fullName}
                style={{ width: '310px', height: '310px', objectFit: 'cover', border: '4px solid var(--gold-primary)' }}
                className="rounded-circle shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* 2. About Me */}
        <section id="about" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">About Me</h2>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-10">
              <div className="glass-card">
                <div className="row g-4">
                  <div className="col-md-6 border-end border-secondary">
                    <h5 className="text-gold mb-3">Personal Profile</h5>
                    <p className="text-muted mb-0">{about.biography}</p>
                    <div className="row g-2 mt-3 text-white-50 small">
                      <div className="col-6"><strong>Height:</strong> {personal.height}</div>
                      <div className="col-6"><strong>Weight:</strong> {personal.weight}</div>
                      <div className="col-6"><strong>Blood:</strong> {personal.bloodGroup}</div>
                      <div className="col-6"><strong>Status:</strong> {personal.maritalStatus}</div>
                      <div className="col-6"><strong>Tongue:</strong> {personal.motherTongue}</div>
                      <div className="col-6"><strong>Religion:</strong> {personal.religion}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-gold mb-3">Career Ambitions & Goals</h5>
                    <ul className="list-unstyled">
                      {about.careerGoals.map((goal, idx) => (
                        <li key={idx} className="d-flex align-items-start gap-2 mb-3 text-muted">
                          <FaAngleRight className="text-gold mt-1 flex-shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Education Timeline */}
        <section id="education" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Educational Timeline</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="timeline-gold ms-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="position-relative mb-5 pb-2" data-aos="fade-up" data-aos-delay={idx * 100}>
                    <div className="timeline-dot" />
                    <span className="badge bg-secondary text-white-50 mb-2">{edu.duration}</span>
                    <h5 className="fw-semibold text-white mb-1">{edu.degree}</h5>
                    <div className="text-gold small mb-2">{edu.school}</div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-dark border border-warning text-gold">{edu.percentageOrCgpa}</span>
                      <p className="text-muted small mb-0">{edu.achievements}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Experience Timeline */}
        <section id="experience" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Experience History</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="timeline-gold ms-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="position-relative mb-5 pb-2" data-aos="fade-up" data-aos-delay={idx * 100}>
                    <div className="timeline-dot" />
                    <span className="badge bg-secondary text-white-50 mb-2">{exp.duration} | <span className="text-gold">{exp.type}</span></span>
                    <h5 className="fw-semibold text-white mb-1">{exp.role}</h5>
                    <div className="text-gold small mb-2">{exp.company}</div>
                    <p className="text-muted small">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Skills Section */}
        <section id="skills" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Skill Matrix</h2>
          </div>
          <div className="row g-4">
            {[
              { title: "Frontend Skills", list: skills.frontend },
              { title: "Backend Stacks", list: skills.backend },
              { title: "Cloud & Ops", list: skills.cloud },
              { title: "Soft Credentials", list: skills.soft }
            ].map((cat, idx) => (
              <div key={idx} className="col-md-6" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <div className="glass-card h-100">
                  <h5 className="text-gold mb-4 border-bottom border-secondary pb-2">{cat.title}</h5>
                  {cat.list.map((skill, sIdx) => (
                    <div key={sIdx} className="mb-3">
                      <div className="d-flex justify-content-between text-white-50 small mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.levelPercent}%</span>
                      </div>
                      <div className="progress bg-dark" style={{ height: '6px' }}>
                        <div
                          className="progress-bar progress-bar-gold"
                          style={{ width: `${skill.levelPercent}%`, transition: 'width 1s ease' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Projects Showcase */}
        <section id="projects" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Featured Projects</h2>
          </div>
          <div className="row g-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <div className="glass-card h-100 p-0 overflow-hidden d-flex flex-column">
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div className="p-4 flex-grow-1 d-flex flex-column">
                    <h5 className="text-white fw-bold mb-2">{proj.title}</h5>
                    <p className="text-muted small flex-grow-1">{proj.description}</p>
                    
                    {/* Tags list */}
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {proj.tags.map(t => (
                        <span key={t} className="badge bg-dark border border-secondary text-white-50 small">{t}</span>
                      ))}
                    </div>

                    {/* Repository links */}
                    <div className="d-flex gap-2">
                      <a href={proj.githubLink} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                        <FaGithub /> Repo
                      </a>
                      <a href={proj.demoLink} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Certifications */}
        <section id="certifications" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Certifications & Credentials</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {certifications.map((cert, idx) => (
              <div key={idx} className="col-md-6" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <div className="glass-card d-flex align-items-center gap-3">
                  <div className="text-gold fs-2 p-3 bg-black border border-secondary rounded-3">
                    <FaAward />
                  </div>
                  <div className="flex-grow-1">
                    <strong className="text-white d-block">{cert.title}</strong>
                    <span className="text-white-50 small d-block">{cert.issuer} | {cert.date}</span>
                    <span className="text-muted small d-block font-monospace mt-1">ID: {cert.credentialId}</span>
                  </div>
                  <div>
                    <a href={cert.link} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
                      Verify
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Family Details */}
        <section id="family" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Family Details</h2>
          </div>
          <div className="row g-4">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="glass-card h-100">
                <h4 className="text-gold mb-4 border-bottom border-secondary pb-2 d-flex align-items-center gap-2">
                  <FaUsers /> Parents Profile
                </h4>
                <div className="mb-4">
                  <span className="text-muted small d-block">Father Details</span>
                  <strong className="text-white d-block">{family.fatherDetails.name}</strong>
                  <span className="text-white-50 small">{family.fatherDetails.occupation}</span>
                </div>
                <div className="mb-4">
                  <span className="text-muted small d-block">Mother Details</span>
                  <strong className="text-white d-block">{family.motherDetails.name}</strong>
                  <span className="text-white-50 small">{family.motherDetails.occupation}</span>
                </div>
                <div>
                  <span className="text-muted small d-block mb-1">Family Structure</span>
                  <span className="badge bg-gold text-black">{family.familyType} Family</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <div className="glass-card h-100 d-flex flex-column">
                <h4 className="text-gold mb-4 border-bottom border-secondary pb-2 d-flex align-items-center gap-2">
                  <FaHeart /> Siblings & Values
                </h4>
                
                {family.siblings.length > 0 && (
                  <div className="mb-4 flex-grow-1">
                    <span className="text-muted small d-block mb-2">Siblings</span>
                    {family.siblings.map((sib, idx) => (
                      <div key={idx} className="bg-black p-3 rounded border border-secondary mb-2">
                        <strong className="text-white">{sib.name}</strong> ({sib.role})
                        <div className="text-white-50 small mt-1">{sib.occupation} | <span className="text-gold">{sib.maritalStatus}</span></div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <span className="text-muted small d-block">Family Background</span>
                  <p className="text-white-50 small mb-0 mt-1">{family.backgroundText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Hobbies & Lifestyle */}
        <section id="hobbies" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Hobbies & Interests</h2>
          </div>
          <div className="row g-4">
            {lifestyle.hobbies.map((hob, idx) => {
              let icon = <FaLaptopCode />;
              if (hob.name.includes("Gym")) icon = <FaDumbbell />;
              else if (hob.name.includes("Photography")) icon = <FaCamera />;
              else if (hob.name.includes("Travel")) icon = <FaPlane />;
              
              return (
                <div key={idx} className="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay={idx * 100}>
                  <div className="glass-card h-100 text-center">
                    <div className="text-gold fs-2 mb-3 bg-black border border-secondary p-3 rounded-circle d-inline-block">
                      {icon}
                    </div>
                    <h5 className="text-white fw-bold mb-2">{hob.name}</h5>
                    <p className="text-muted small mb-0">{hob.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Spoken Languages known */}
          <div className="mt-4 text-center" data-aos="fade-up">
            <span className="text-muted small me-2">Spoken Languages:</span>
            {lifestyle.languages.map(lang => (
              <span key={lang} className="badge bg-black border border-warning text-gold mx-1 px-3 py-2">{lang}</span>
            ))}
          </div>
        </section>

        {/* 10. Gallery */}
        <section id="gallery" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Gallery Portfolio</h2>
          </div>

          {/* Filters tabs */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {galleryTabs.map(tab => (
              <button
                key={tab}
                className={`btn ${activeGalleryTab === tab ? 'btn-gold' : 'btn-glass'} py-1 px-3`}
                onClick={() => setActiveGalleryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="row g-3">
            {filteredGallery.map((item, idx) => (
              <div key={idx} className="col-sm-6 col-md-4 col-lg-3" data-aos="zoom-in">
                <div
                  onClick={() => setLightboxSrc(item.url)}
                  style={{ cursor: 'pointer', height: '180px', position: 'relative', overflow: 'hidden' }}
                  className="glass-card p-0 rounded-3 border border-secondary"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '10px'
                    }}
                  >
                    <span className="text-white small fw-semibold d-block truncate">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Contact Section */}
        <section id="contact" className="py-5 mb-5" data-aos="fade-up">
          <div className="text-center">
            <h2 className="section-title text-gold-gradient fw-bold">Get In Touch</h2>
          </div>
          <div className="row g-5">
            {/* Contact details */}
            <div className="col-lg-5" data-aos="fade-right">
              <div className="glass-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="text-gold mb-4">Contact Coordinate Details</h4>
                  
                  <div className="mb-4 d-flex align-items-center gap-3">
                    <div className="text-gold p-3 bg-black border border-secondary rounded-3 fs-5">
                      <FaEnvelope />
                    </div>
                    <div>
                      <span className="text-muted small d-block">Write Email</span>
                      <a href={`mailto:${contact.email}`} className="text-white hover-gold text-decoration-none fw-semibold">
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="mb-4 d-flex align-items-center gap-3">
                    <div className="text-gold p-3 bg-black border border-secondary rounded-3 fs-5">
                      <FaPhone />
                    </div>
                    <div>
                      <span className="text-muted small d-block">Phone Support</span>
                      <a href={`tel:${contact.phone}`} className="text-white hover-gold text-decoration-none fw-semibold">
                        {contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mb-4 d-flex align-items-center gap-3">
                    <div className="text-gold p-3 bg-black border border-secondary rounded-3 fs-5">
                      <FaMapPin />
                    </div>
                    <div>
                      <span className="text-muted small d-block">Mailing Address</span>
                      <p className="text-white small mb-0 fw-semibold">{contact.address}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code section */}
                <div className="pt-4 border-top border-secondary text-center qrcode-card">
                  <h6 className="text-gold mb-3">Scan Profile to Share</h6>
                  <div className="bg-white p-3 d-inline-block rounded-3 shadow">
                    <QRCodeSVG value={window.location.href} size={110} />
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="col-lg-7" data-aos="fade-left">
              <div className="glass-card h-100 p-0 overflow-hidden border border-secondary shadow-lg" style={{ minHeight: '300px' }}>
                <iframe
                  title="Google Map location coordinates"
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '350px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 12. Footer Copyright */}
      <footer className="bg-black py-4 mt-auto border-top border-secondary">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">
          <div className="text-muted small">
            &copy; {new Date().getFullYear()} {personal.fullName}. All rights reserved. Powered by React & Bootstrap.
          </div>
          <div className="d-flex gap-3 fs-5">
            {personal.socialLinks.github && (
              <a href={personal.socialLinks.github} target="_blank" rel="noreferrer" className="text-muted hover-gold">
                <FaGithub />
              </a>
            )}
            {personal.socialLinks.linkedin && (
              <a href={personal.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-muted hover-gold">
                <FaLinkedin />
              </a>
            )}
            {personal.socialLinks.twitter && (
              <a href={personal.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-muted hover-gold">
                <FaTwitter />
              </a>
            )}
            {personal.socialLinks.instagram && (
              <a href={personal.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted hover-gold">
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* Back-to-Top sticky FAB */}
      {showScrollBtn && (
        <button onClick={scrollToTop} className="back-to-top">
          <FaArrowUp />
        </button>
      )}

      {/* Lightbox popups */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

    </div>
  );
};

export default SinglePageApp;
