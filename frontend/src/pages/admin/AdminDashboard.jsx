import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, BarElement
} from 'chart.js';
import { Eye, Mail, MessageSquare, ShieldAlert, Award, Briefcase } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, Title, Tooltip, Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await apiRequest('/request/analytics/dashboard');
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-transparent">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Fallback defaults if no database values or local analytics have loaded
  const totalViews = stats?.totalViews || 0;
  const totalRequests = stats?.totalRequests || 0;
  const pendingRequests = stats?.pendingRequests || 0;

  // 1. Prepare Line Chart for Visitor Trends
  const trendLabels = stats?.viewsTrend?.map(t => t._id) || [];
  const trendData = stats?.viewsTrend?.map(t => t.count) || [];
  
  const lineChartData = {
    labels: trendLabels.length > 0 ? trendLabels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Daily Page Views',
        data: trendData.length > 0 ? trendData : [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // 2. Prepare Pie Chart for Device Distribution
  const deviceLabels = stats?.deviceDistribution?.map(d => d._id) || ['Desktop', 'Mobile', 'Tablet'];
  const deviceCounts = stats?.deviceDistribution?.map(d => d.count) || [0, 0, 0];

  const doughnutChartData = {
    labels: deviceLabels,
    datasets: [
      {
        data: deviceCounts.some(c => c > 0) ? deviceCounts : [1, 0, 0], // fallback placeholder
        backgroundColor: ['#D4AF37', '#AA771C', '#FCF6BA'],
        borderColor: '#000000',
        borderWidth: 2,
      }
    ]
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Overview Dashboard</h2>
        <p className="text-muted small">Live analytics, messages monitoring, and configuration highlights</p>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="admin-card-metric d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Total Site Hits</span>
              <h3 className="fw-bold text-white mb-0 mt-1">{totalViews}</h3>
            </div>
            <div className="text-gold bg-black border border-secondary p-3 rounded-3">
              <Eye size={24} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-card-metric d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Inbox Total Queries</span>
              <h3 className="fw-bold text-white mb-0 mt-1">{totalRequests}</h3>
            </div>
            <div className="text-gold bg-black border border-secondary p-3 rounded-3">
              <Mail size={24} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-card-metric d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small d-block">Pending Action Items</span>
              <h3 className="fw-bold text-danger mb-0 mt-1">{pendingRequests}</h3>
            </div>
            <div className="text-danger bg-black border border-danger p-3 rounded-3">
              <ShieldAlert size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="glass-card h-100">
            <h5 className="text-gold mb-4">Traffic Performance</h5>
            <div style={{ height: '300px' }} className="d-flex align-items-center justify-content-center">
              <Line 
                data={lineChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', stepSize: 1 } }
                  },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card h-100">
            <h5 className="text-gold mb-4">Device Statistics</h5>
            <div style={{ height: '280px' }} className="d-flex align-items-center justify-content-center">
              <Doughnut 
                data={doughnutChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#fff' } } }
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="row g-4">
        {/* Recent Message submissions */}
        <div className="col-lg-6">
          <div className="glass-card h-100">
            <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
              <MessageSquare size={18} />
              <span>Recent Enquiries</span>
            </h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover table-borderless align-middle small">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-muted">Sender</th>
                    <th className="text-muted">Subject</th>
                    <th className="text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentRequests?.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <strong>{req.name}</strong>
                        <span className="text-muted d-block small">{req.email}</span>
                      </td>
                      <td>{req.subject}</td>
                      <td>
                        <span className={`badge ${
                          req.status === 'Pending' ? 'bg-danger' : req.status === 'Read' ? 'bg-secondary' : 'bg-success'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentRequests || stats.recentRequests.length === 0) && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">No recent queries.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log list */}
        <div className="col-lg-6">
          <div className="glass-card h-100">
            <h5 className="text-gold mb-4 d-flex align-items-center gap-2">
              <ShieldAlert size={18} />
              <span>CMS Audit Log (Recent Operations)</span>
            </h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover table-borderless align-middle small">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-muted">Admin User</th>
                    <th className="text-muted">Operation</th>
                    <th className="text-muted">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentLogs?.map((log) => (
                    <tr key={log._id}>
                      <td className="text-gold fw-semibold">{log.adminUser}</td>
                      <td>
                        <span className="badge bg-dark border border-secondary text-white-50">{log.action}</span>
                      </td>
                      <td className="text-muted truncate" style={{ maxWidth: '200px' }}>{log.details}</td>
                    </tr>
                  ))}
                  {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">No recent audit logs.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
