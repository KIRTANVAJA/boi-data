import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PortfolioDataProvider } from './context/PortfolioDataContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Styling theme imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';

// Pages
import PublicPage from './pages/public/PublicPage.jsx';

// Admin CMS sub-pages
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageHero from './pages/admin/ManageHero.jsx';
import ManageAbout from './pages/admin/ManageAbout.jsx';
import ManageEducation from './pages/admin/ManageEducation.jsx';
import ManageExperience from './pages/admin/ManageExperience.jsx';
import ManageSkills from './pages/admin/ManageSkills.jsx';
import ManageProjects from './pages/admin/ManageProjects.jsx';
import ManageCertifications from './pages/admin/ManageCertifications.jsx';
import ManageFamily from './pages/admin/ManageFamily.jsx';
import ManageGallery from './pages/admin/ManageGallery.jsx';
import ManageContact from './pages/admin/ManageContact.jsx';
import ManageVisibility from './pages/admin/ManageVisibility.jsx';
import ManageHobbies from './pages/admin/ManageHobbies.jsx';

function App() {
  return (
    <PortfolioDataProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* 1. Public Single Page view */}
            <Route path="/" element={<PublicPage />} />

            {/* 2. Protected Dashboard area */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="visibility" element={<ManageVisibility />} />
              <Route path="hero" element={<ManageHero />} />
              <Route path="about" element={<ManageAbout />} />
              <Route path="education" element={<ManageEducation />} />
              <Route path="experience" element={<ManageExperience />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="certifications" element={<ManageCertifications />} />
              <Route path="family" element={<ManageFamily />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="hobbies" element={<ManageHobbies />} />
              <Route path="contact" element={<ManageContact />} />
            </Route>

            {/* Redirections fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastContainer position="bottom-right" theme="dark" />
      </AdminAuthProvider>
    </PortfolioDataProvider>
  );
}

export default App;
