import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const role = localStorage.getItem('role') || 'Guest';
    const userId = localStorage.getItem('userId');

    // --- DATA STATES ---
    const [papers, setPapers] = useState([]);
    const [users, setUsers] = useState([]); 
    const [supportMessages, setSupportMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('papers'); 
    
    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Modals
    const [showUpload, setShowUpload] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    
    // Form Inputs
    const [feedback, setFeedback] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [file, setFile] = useState(null);

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        if (!userId || userId === "null") return;
        try {
            // Get Papers based on Role
            const pRes = await axios.get(role === 'Author' 
                ? `http://localhost:5000/api/papers/my-submissions/${userId}` 
                : `http://localhost:5000/api/papers/all`
            );
            setPapers(pRes.data);

            // Get Admin Data if Organiser
            if (role === 'Organiser') {
                const uRes = await axios.get('http://localhost:5000/api/auth/users-list');
                setUsers(uRes.data);
                const sRes = await axios.get('http://localhost:5000/api/auth/support-list');
                setSupportMessages(sRes.data || []);
            }
        } catch (err) { console.error("Fetch Error:", err); }
    }, [userId, role]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- LOGIC ---
    const stats = {
        total: papers.length,
        pending: papers.filter(p => p.status === 'Pending').length,
        approved: papers.filter(p => p.status === 'Approved').length,
        rejected: papers.filter(p => p.status === 'Rejected').length
    };

    const filteredPapers = papers.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Select a PDF file!");
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('author_id', userId);
        formData.append('paper', file);
        try {
            await axios.post('http://localhost:5000/api/papers/submit', formData);
            alert("✅ Submitted!");
            setShowUpload(false);
            fetchData();
        } catch (err) { alert("Upload Failed"); }
    };

    const handleReviewSubmit = async (status) => {
        try {
            await axios.patch(`http://localhost:5000/api/papers/status/${selectedPaper.id}`, { status, comments: feedback });
            alert(`Paper ${status}!`);
            setShowReviewModal(false);
            setFeedback('');
            fetchData();
        } catch (err) { alert("Review Failed"); }
    };

    const handleResetPassword = async (targetId) => {
        const pass = prompt("Enter new password for user:");
        if (!pass) return;
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password-admin', { userId: targetId, newPassword: pass });
            alert("✅ Password Updated!");
        } catch (err) { alert("Reset Failed"); }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-brand">KConference <span>Portal</span></div>
                <div className={`nav-item ${activeTab === 'papers' ? 'active' : ''}`} onClick={() => setActiveTab('papers')}>📄 Manuscripts</div>
                {role === 'Organiser' && (
                    <>
                        <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</div>
                        <div className={`nav-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>✉️ Support</div>
                    </>
                )}
                <div className="nav-item logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>🚪 Logout</div>
            </div>

            <div className="main-content">
                <div className="header-strip">
                    <h2>Welcome, {username}! <span className="role-tag">{role}</span></h2>
                    {role === 'Author' && (
                        <button className="btn-primary" onClick={() => setShowUpload(true)}>+ New Submission</button>
                    )}
                </div>

                {/* Stats Section */}
                <div className="stats-grid">
                    <div className="stat-card"><h3>{stats.total}</h3><p>Total</p></div>
                    <div className="stat-card pending"><h3>{stats.pending}</h3><p>Pending</p></div>
                    <div className="stat-card approved"><h3>{stats.approved}</h3><p>Approved</p></div>
                    <div className="stat-card Rejected"><h3>{stats.approved}</h3><p>Rejected</p></div>
                </div>

                {/* Filter Bar */}
                {activeTab === 'papers' && (
                    <div className="filter-bar">
                        <input type="text" placeholder="Search title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                )}

                {/* Tables */}
                <div className="table-card">
                    {activeTab === 'papers' && (
                        <table className="pro-table">
                            <thead>
                                <tr><th>Title</th><th>Status</th><th>Feedback</th>{role === 'Reviewer' && <th>Action</th>}</tr>
                            </thead>
                            <tbody>
                                {filteredPapers.map(p => (
                                    <tr key={p.id}>
                                        <td><strong>{p.title}</strong></td>
                                        <td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td>
                                        <td>{p.reviewer_comments || "Pending"}</td>
                                        {role === 'Reviewer' && (
                                            <td><button className="btn-review" onClick={() => {setSelectedPaper(p); setShowReviewModal(true)}}>Review</button></td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'users' && role === 'Organiser' && (
                        <table className="pro-table">
                            <thead><tr><th>Username</th><th>Role</th><th>Action</th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}><td>{u.username}</td><td>{u.role}</td>
                                    <td><button className="btn-small" onClick={() => handleResetPassword(u.id)}>Reset Password</button></td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {activeTab === 'support' && role === 'Organiser' && (
    <div className="table-card">
        <h3>Support Messages</h3>
        <table className="pro-table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {supportMessages.length > 0 ? supportMessages.map((msg) => (
                    <tr key={msg.id}>
                        <td>{msg.email}</td>
                        <td>{msg.message}</td>
                        <td>
                            <button className="btn-small" onClick={() => window.location.href=`mailto:${msg.email}`}>
                                Reply
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" style={{textAlign:'center'}}>No messages yet</td></tr>
                )}
            </tbody>
        </table>
    </div>
)}

            {/* Author Upload Modal */}
            {showUpload && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>New Submission</h3>
                        <form onSubmit={handleFileUpload} className="auth-main-form">
                            <input type="text" placeholder="Paper Title" required onChange={e => setNewTitle(e.target.value)} />
                            <input type="file" accept=".pdf" required onChange={e => setFile(e.target.files[0])} />
                            <div className="modal-btns">
                                <button type="submit" className="btn-primary">Upload</button>
                                <button type="button" className="btn-close" onClick={() => setShowUpload(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviewer Modal */}
            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Review: {selectedPaper?.title}</h3>
                        <textarea placeholder="Feedback..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                        <div className="modal-btns">
                            <button className="btn-approve" onClick={() => handleReviewSubmit('Approved')}>Approve</button>
                            <button className="btn-reject" onClick={() => handleReviewSubmit('Rejected')}>Reject</button>
                            <button className="btn-close" onClick={() => setShowReviewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;