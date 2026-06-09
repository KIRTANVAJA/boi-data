import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ManageFamily = () => {
  const { portfolioData, updateSection } = usePortfolioData();
  const { family } = portfolioData;

  const [fatherName, setFatherName] = useState(family.fatherDetails?.name || '');
  const [fatherOccupation, setFatherOccupation] = useState(family.fatherDetails?.occupation || '');
  const [fatherContact, setFatherContact] = useState(family.fatherDetails?.contact || '');

  const [motherName, setMotherName] = useState(family.motherDetails?.name || '');
  const [motherOccupation, setMotherOccupation] = useState(family.motherDetails?.occupation || '');
  const [motherContact, setMotherContact] = useState(family.motherDetails?.contact || '');

  const [familyType, setFamilyType] = useState(family.familyType || 'Nuclear');
  const [backgroundText, setBackgroundText] = useState(family.backgroundText || '');

  // Siblings list
  const [siblings, setSiblings] = useState(family.siblings || []);

  const handleAddSibling = () => {
    setSiblings([...siblings, { name: '', role: 'Brother', occupation: '', maritalStatus: 'Single' }]);
  };

  const handleRemoveSibling = (index) => {
    setSiblings(siblings.filter((_, idx) => idx !== index));
  };

  const handleSiblingChange = (index, field, value) => {
    const updated = [...siblings];
    updated[index][field] = value;
    setSiblings(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSection('family', {
      familyType,
      backgroundText,
      fatherDetails: { name: fatherName, occupation: fatherOccupation, contact: fatherContact },
      motherDetails: { name: motherName, occupation: motherOccupation, contact: motherContact },
      siblings
    });
    toast.success('Family information updated!');
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Edit Family Profile</h2>
        <p className="text-muted small">Update parents' occupations, siblings lists, structures, and backgrounds</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Parents */}
          <div className="col-lg-6">
            <div className="glass-card mb-4 h-100">
              <h5 className="text-gold mb-4">Parents Details</h5>
              
              <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">Father Details</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Father's Name</label>
                  <input type="text" className="form-control glass-input" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Father's Occupation</label>
                  <input type="text" className="form-control glass-input" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-50 small">Father's Contact</label>
                  <input type="text" className="form-control glass-input" value={fatherContact} onChange={(e) => setFatherContact(e.target.value)} />
                </div>
              </div>

              <h6 className="text-white-50 border-bottom border-secondary pb-2 mb-3">Mother Details</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Mother's Name</label>
                  <input type="text" className="form-control glass-input" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Mother's Occupation</label>
                  <input type="text" className="form-control glass-input" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-50 small">Mother's Contact</label>
                  <input type="text" className="form-control glass-input" value={motherContact} onChange={(e) => setMotherContact(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Structure & Background */}
          <div className="col-lg-6">
            <div className="glass-card mb-4 h-100 d-flex flex-column">
              <h5 className="text-gold mb-4">Structure & Background</h5>
              <div className="mb-4">
                <label className="form-label text-white-50 small">Family Structure Type</label>
                <select className="form-select glass-input" value={familyType} onChange={(e) => setFamilyType(e.target.value)}>
                  <option value="Nuclear">Nuclear Family</option>
                  <option value="Joint">Joint Family</option>
                  <option value="Extended">Extended Family</option>
                </select>
              </div>
              <div className="flex-grow-1">
                <label className="form-label text-white-50 small">Background Summary</label>
                <textarea rows="8" className="form-control glass-input h-75" value={backgroundText} onChange={(e) => setBackgroundText(e.target.value)} placeholder="Summary values, ancestral origins, status, etc..." />
              </div>
            </div>
          </div>

          {/* Siblings */}
          <div className="col-12">
            <div className="glass-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-gold mb-0">Siblings ({siblings.length})</h5>
                <button type="button" onClick={handleAddSibling} className="btn btn-glass btn-sm d-flex align-items-center gap-1">
                  <FaPlus /> Add Sibling
                </button>
              </div>

              {siblings.map((sib, idx) => (
                <div key={idx} className="row g-3 align-items-end mb-3 bg-black p-3 rounded border border-secondary">
                  <div className="col-md-3">
                    <label className="form-label text-white-50 small">Name</label>
                    <input type="text" className="form-control glass-input" value={sib.name} onChange={(e) => handleSiblingChange(idx, 'name', e.target.value)} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-white-50 small">Role / Relation</label>
                    <select className="form-select glass-input" value={sib.role} onChange={(e) => handleSiblingChange(idx, 'role', e.target.value)}>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Elder Brother">Elder Brother</option>
                      <option value="Elder Sister">Elder Sister</option>
                      <option value="Younger Brother">Younger Brother</option>
                      <option value="Younger Sister">Younger Sister</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-white-50 small">Occupation</label>
                    <input type="text" className="form-control glass-input" value={sib.occupation} onChange={(e) => handleSiblingChange(idx, 'occupation', e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label text-white-50 small">Marital Status</label>
                    <select className="form-select glass-input" value={sib.maritalStatus} onChange={(e) => handleSiblingChange(idx, 'maritalStatus', e.target.value)}>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div className="col-md-1 text-center">
                    <button type="button" onClick={() => handleRemoveSibling(idx)} className="btn btn-outline-danger btn-sm p-2 w-100">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {siblings.length === 0 && <p className="text-muted small text-center mb-0">No sibling records logged yet.</p>}
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2">
              <FaSave /> Update Family Info
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageFamily;
