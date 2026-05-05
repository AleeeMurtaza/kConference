import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Landing() {
    const navigate = useNavigate();

    const team = [
        { name: "Ali", img: "ali.jpg" },
        { name: "Hamza",  img: "hamza.jpg" },
        { name: "Zaid", img: "zaid.jpg" }, // Add zaid.jpg to public/images/
        { name: "Zain",  img: "zain.jpg" },
        { name: "Maryam",  img: "maryam.jpg" } // Add maryam.jpg to public/images/
    ];

    return (
        <div className="landing-wrapper">
            <nav className="landing-nav">
                <div className="nav-logo">KConference <span>2026</span></div>
                <div className="nav-actions">
                    <div className="nav-links">
                        <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
                        <button onClick={() => navigate('/register')} className="nav-btn btn-primary">Get Started</button>
                    </div>
                </div>
            </nav>

            <header className="landing-hero">
                <div className="hero-overlay">
                    <h1>International Research Portal</h1>
                    <p>Connecting researchers, reviewers, and organizers in one Agile-driven platform.</p>
                    <div className="hero-btns">
                        <button onClick={() => navigate('/register')} className="btn-main">Submit Manuscript</button>
                    </div>
                </div>
            </header>

            <section className="landing-team">
                <h2>Our Expert Team</h2>
                <div className="team-container">
                    {team.map((member, index) => (
                        <div key={index} className="member-card">
                            <div className="member-avatar">
    {member.img ? (
        <img 
            src={`/images/${member.img}`} 
            alt={member.name} 
            className="team-img" // Ye class CSS apply karegi
            onError={(e) => { e.target.style.display = 'none'; }} 
        />
    ) : null}
    <span className="avatar-letter">{member.name[0]}</span>
</div>
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Landing;