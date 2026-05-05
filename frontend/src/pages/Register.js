import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'Author' });
    const [showSuccess, setShowSuccess] = useState(false); // Success popup state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            // Browser ka alert hata kar custom popup show karein
            setShowSuccess(true);
        } catch (err) {
            alert(err.response?.data?.error || "Registration Failed");
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card-box">
                <div className="auth-header-text">
                    <h2>Create Account</h2>
                </div>
                <form className="auth-main-form" onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="Author">Author</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Organiser">Organiser</option>
                    </select>
                    <button type="submit" className="auth-submit-btn">Register</button>
                </form>
                <p style={{marginTop: '20px', fontSize: '14px'}}>
                    Already have an account? <span style={{color: '#4e54c8', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>

            {/* --- Success Popup (Center Mein) --- */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
                    alignItems: 'center', zIndex: 100000, backdropFilter: 'blur(5px)'
                }}>
                    <div className="auth-card-box" style={{maxWidth: '350px', textAlign: 'center', padding: '30px'}}>
                        <h3 style={{color: '#4f46e5', marginBottom: '15px'}}>✅ Success!</h3>
                        <p style={{marginBottom: '25px', color: '#333'}}>Your account has been created successfully.</p>
                        <button 
                            className="auth-submit-btn" 
                            onClick={() => navigate('/login')}
                            style={{width: '100%'}}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;