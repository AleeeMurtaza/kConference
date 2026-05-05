import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Support Modal States
    const [showSupport, setShowSupport] = useState(false);
    const [supportEmail, setSupportEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.userId) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId); 
                localStorage.setItem('role', res.data.role);
                localStorage.setItem('username', res.data.username);
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.error || "Login Failed");
        }
    };

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ab ye backend ke naye route se connect hoga
            await axios.post('http://localhost:5000/api/auth/support', { email: supportEmail, message });
            alert("✅ Message Sent Successfully!");
            setShowSupport(false);
            setSupportEmail('');
            setMessage('');
        } catch (err) {
            alert("❌ Failed to send. Make sure backend is updated.");
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card-box">
                <h2>KConference Login</h2>
                <form className="auth-main-form" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="auth-submit-btn">Login</button>
                </form>
                <p style={{marginTop: '15px'}}>
                    New here? <span style={{color: '#4e54c8', cursor: 'pointer'}} onClick={() => navigate('/register')}>Register</span>
                </p>
                <p style={{marginTop: '10px', fontSize: '13px'}}>
                    <span style={{textDecoration: 'underline', cursor: 'pointer', color: '#666'}} onClick={() => setShowSupport(true)}>
                        Contact Support / Organizer
                    </span>
                </p>
            </div>

            {/* --- Centered Support Modal --- */}
            {showSupport && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
                    alignItems: 'center', zIndex: 100000, backdropFilter: 'blur(5px)'
                }}>
                    <div className="auth-card-box" style={{maxWidth: '400px', width: '90%', position: 'relative'}}>
                        <h3 style={{marginBottom: '15px'}}>Contact Organizer</h3>
                        <form className="auth-main-form" onSubmit={handleSupportSubmit}>
                            <input 
                                type="email" placeholder="Your Email" required 
                                value={supportEmail} onChange={e => setSupportEmail(e.target.value)} 
                            />
                            <textarea 
                                placeholder="Describe your issue..." required 
                                style={{minHeight: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
                                value={message} onChange={e => setMessage(e.target.value)}
                            />
                            <button type="submit" className="auth-submit-btn">Send Message</button>
                            <button type="button" onClick={() => setShowSupport(false)} style={{background: 'none', color: 'red', border: 'none', cursor: 'pointer', marginTop: '10px'}}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;