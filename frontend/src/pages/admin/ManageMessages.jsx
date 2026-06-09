import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api.js';
import { toast } from 'react-toastify';
import { Trash2, Check, Mail, MessageSquare, ChevronDown } from 'lucide-react';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await apiRequest('/request/contact');
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      toast.error('Failed to load guest queries inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/request/contact/${id}`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      if (res.success) {
        toast.success(`Message status updated to ${newStatus}`);
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry request?')) return;
    try {
      const res = await apiRequest(`/request/contact/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.info('Message deleted');
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4">
        <h2 className="fw-bold text-gold-gradient mb-1">Guest Inbox</h2>
        <p className="text-muted small">Manage feedback, marriage biodata proposal enquiries, and business requests</p>
      </div>

      <div className="glass-card">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-muted text-center mb-0 py-4">Your message inbox is currently empty.</p>
        ) : (
          <div className="list-group list-group-flush bg-transparent">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg._id;
              return (
                <div 
                  key={msg._id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  className={`list-group-item bg-transparent text-white px-0 py-3 ${msg.status === 'Pending' ? 'fw-bold' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                      style={{ cursor: 'pointer' }}
                      className="flex-grow-1"
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className={`badge ${
                          msg.status === 'Pending' ? 'bg-danger' : msg.status === 'Read' ? 'bg-secondary' : 'bg-success'
                        }`}>
                          {msg.status}
                        </span>
                        <strong className="text-white fs-6">{msg.name}</strong>
                        <span className="text-muted small">({msg.email})</span>
                      </div>
                      <div className="text-gold small mb-1">Subject: {msg.subject}</div>
                      <p className={`text-white-50 small mb-0 ${isExpanded ? '' : 'text-truncate'}`} style={{ maxWidth: '600px' }}>
                        {msg.message}
                      </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {/* Action status changes */}
                      {msg.status === 'Pending' && (
                        <button 
                          onClick={() => handleStatusChange(msg._id, 'Read')}
                          title="Mark as Read"
                          className="btn btn-glass btn-sm p-2 text-warning"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {msg.status !== 'Replied' && (
                        <button 
                          onClick={() => handleStatusChange(msg._id, 'Replied')}
                          title="Mark as Replied"
                          className="btn btn-gold btn-sm py-1 px-2"
                        >
                          Replied
                        </button>
                      )}
                      
                      <button onClick={() => handleDelete(msg._id)} className="btn btn-outline-danger btn-sm p-2">
                        <Trash2 size={16} />
                      </button>

                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                        className="btn btn-link text-muted p-1 border-0"
                      >
                        <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 p-3 bg-black rounded border border-secondary text-white small animate-fade-up">
                      <div className="mb-2"><strong>Received On:</strong> {new Date(msg.createdAt).toLocaleString()}</div>
                      <div><strong>Full Query Content:</strong></div>
                      <p className="mt-1 text-muted text-break">{msg.message}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
