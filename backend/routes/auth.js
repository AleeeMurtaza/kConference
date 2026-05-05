const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// 1. Registration
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, role]
        );
        res.status(201).json({ message: "User registered!" });
    } catch (err) { res.status(500).json({ error: "Email already exists" }); }
});

// 2. Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const validPass = await bcrypt.compare(password, user.password);
            if (validPass) {
                res.json({ userId: user.id, username: user.username, role: user.role, token: "secret-token" });
            } else { res.status(401).json({ error: "Invalid Password" }); }
        } else { res.status(404).json({ error: "User not found" }); }
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
});

// 3. SUPPORT ROUTE (Fixing the Table Name Here)
router.post('/support', async (req, res) => {
    const { email, message } = req.body;
    try {
        // Database mein table name 'support_requests' hai, isliye yahan wahi use kiya hai
        await pool.query(
            "INSERT INTO support_requests (email, message) VALUES ($1, $2)", 
            [email, message]
        );
        res.status(200).json({ message: "Support request received!" });
    } catch (err) {
        console.error("Support Error:", err.message);
        res.status(500).json({ error: "Server Error: Could not save message" });
    }
});

// 4. Get Support List (For Organiser Dashboard)
router.get('/support-list', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM support_requests ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: "Fetch failed" }); 
    }
});

// 5. ORGANISER POWER: Password Reset
router.post('/reset-password-admin', async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
        res.json({ message: "Password updated successfully!" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

// 6. Get All Users for Organiser
router.get('/users-list', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, role FROM users ORDER BY role");
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});
// Get All Support Messages for Organiser
router.get('/support-list', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM support_requests ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Could not fetch support messages" });
    }
});

module.exports = router;