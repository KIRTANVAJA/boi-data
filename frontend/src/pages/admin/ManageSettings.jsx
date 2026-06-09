import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { toast } from 'react-toastify';
import { Save, Download, Upload, Sliders, Palette, ShieldCheck, MoveUp, MoveDown } from 'lucide-react';

const ManageSettings = () => {
  const { settings, saveSettings, fetchSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);

  // Theme states
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#D4AF37');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // SEO states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  // Drag Order states
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (settings) {
      setPrimaryColor(settings.theme?.primaryColor || '#000000');
      setAccentColor(settings.theme?.accentColor || '#D4AF37');
      setFontFamily(settings.theme?.fontFamily || 'Inter');
      setIsDarkMode(settings.theme?.isDarkMode ?? true);

      setMetaTitle(settings.seo?.metaTitle || '');
      setMetaDescription(settings.seo?.metaDescription || '');
      setKeywords(settings.seo?.keywords || '');

      setSections(settings.sectionOrder || []);
      setLoading(false);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      theme: { primaryColor, accentColor, fontFamily, isDarkMode },
      seo: { metaTitle, metaDescription, keywords },
      sectionOrder: sections,
    };

    try {
      await saveSettings(payload);
      toast.success('Settings & configuration saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSectionMove = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setSections(updated);
  };

  // Section Drag handlers
  const handleDragStart = (e, idx) => {
    e.dataTransfer.setData('sectionIdx', idx);
  };
  const handleDrop = (e, targetIdx) => {
    const sourceIdx = parseInt(e.dataTransfer.getData('sectionIdx'), 10);
    if (sourceIdx === targetIdx) return;

    const updated = [...sections];
    const [moved] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setSections(updated);
  };

  // Export database backup
  const handleExport = async () => {
    try {
      const res = await apiRequest('/profile/backup/export');
      if (res.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `digital_biodata_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success('Backup file download started!');
      }
    } catch (err) {
      toast.error('Backup export failed: ' + err.message);
    }
  };

  // Import database backup
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('WARNING: Importing this file will overwrite your existing portfolio content. Are you sure?')) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupPayload = JSON.parse(event.target.result);
        const res = await apiRequest('/profile/backup/import', {
          method: 'POST',
          body: { backup: backupPayload },
        });

        if (res.success) {
          toast.success('Database backup restored successfully!');
          fetchSettings(); // reload configurations
        }
      } catch (err) {
        toast.error('Error importing backup: ' + err.message);
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
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
        <h2 className="fw-bold text-gold-gradient mb-1">Theme & Settings</h2>
        <p className="text-muted small">Configure colors, typography styles, meta details for SEO, section orders, and backup tasks.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4">
          
          {/* Theme card */}
          <div className="col-lg-6">
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <Palette size={18} />
                <span>Visual Styling Theme</span>
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Primary Background Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color bg-transparent border-secondary w-100"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Accent Accent Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color bg-transparent border-secondary w-100"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Header Font Family</label>
                  <select className="form-select glass-input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <option value="Outfit">Outfit (Recommended)</option>
                    <option value="Inter">Inter</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small d-block">Dark Mode Toggle</label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={isDarkMode}
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                      id="themeModeSwitch"
                    />
                    <label className="form-check-label text-white small" htmlFor="themeModeSwitch">
                      {isDarkMode ? 'Dark Theme (Enabled)' : 'Light Theme (Enabled)'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Backup operations */}
            <div className="glass-card">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <ShieldCheck size={18} />
                <span>System Backup & Recovery</span>
              </h5>
              
              <div className="d-flex flex-column gap-3">
                <div>
                  <button type="button" onClick={handleExport} className="btn btn-glass d-flex align-items-center gap-2 w-100 justify-content-center">
                    <Download size={18} className="text-gold" />
                    <span>Download JSON Data Backup</span>
                  </button>
                  <span className="text-muted small d-block mt-1 text-center">Downloads all profile details, family logs, projects, and media links.</span>
                </div>

                <div className="border-top border-secondary pt-3">
                  <input
                    type="file"
                    id="importBackupFile"
                    className="d-none"
                    accept=".json"
                    onChange={handleImport}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('importBackupFile').click()}
                    className="btn btn-outline-danger d-flex align-items-center gap-2 w-100 justify-content-center"
                    disabled={importing}
                  >
                    {importing ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <>
                        <Upload size={18} />
                        <span>Restore Backup File</span>
                      </>
                    )}
                  </button>
                  <span className="text-danger small d-block mt-1 text-center font-monospace">Warning: Overwrites existing collections.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEO & Section Ordering */}
          <div className="col-lg-6">
            {/* SEO configuration */}
            <div className="glass-card mb-4">
              <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
                <Sliders size={18} />
                <span>Search Engine Optimization (SEO)</span>
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-white-50 small">Meta Document Title</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-50 small">Meta Description Summary</label>
                  <textarea
                    rows="2"
                    className="form-control glass-input"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-50 small">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section drag reordering list */}
            <div className="glass-card">
              <h5 className="text-gold mb-3">Layout Sections Order</h5>
              <p className="text-muted small mb-3">Drag and drop sections to rearrange the layout order on the live website.</p>
              
              <div className="list-group list-group-flush bg-transparent">
                {sections.map((sec, idx) => (
                  <div
                    key={sec}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, idx)}
                    style={{ cursor: 'move', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    className="list-group-item bg-transparent text-white px-0 py-2 d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-gold fw-bold">#{idx + 1}</span>
                      <span className="text-capitalize small fw-semibold">{sec}</span>
                    </div>

                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleSectionMove(idx, 'up')}
                        className="btn btn-link text-white p-1"
                        disabled={idx === 0}
                      >
                        <MoveUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSectionMove(idx, 'down')}
                        className="btn btn-link text-white p-1"
                        disabled={idx === sections.length - 1}
                      >
                        <MoveDown size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save panel */}
          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
              {submitting ? (
                <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Update All Settings</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default ManageSettings;
