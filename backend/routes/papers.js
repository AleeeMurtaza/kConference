const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');

// 1. Multer Configuration (File Upload Settings)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// --- ROUTES ---

// 2. Paper Submit Route (Author ke liye)
router.post('/submit', upload.single('paper'), async (req, res) => {
  try {
    const { title, author_id } = req.body;
    const filePath = req.file.path;

    const newPaper = await pool.query(
      "INSERT INTO papers (title, file_path, author_id, status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
      [title, filePath, author_id]
    );

    res.json({ message: "Paper Submitted!", paper: newPaper.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in submission");
  }
});

// 3. Get My Submissions (Sirf login Author ko apne paper dikhane ke liye)
router.get('/my-submissions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM papers WHERE author_id = $1 ORDER BY id DESC",
      [userId]
    );
    res.json(result.rows); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching submissions");
  }
});

// 4. Get All Submissions (Reviewer aur Organiser ke liye saare authors ka data)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT papers.*, users.username as author_name FROM papers JOIN users ON papers.author_id = users.id ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching all papers");
  }
});

// 5. Update Status & Feedback (Reviewer ke liye - FIX IS HERE)
router.patch('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body; // Frontend se 'status' aur 'comments' aayenge

    const updatedPaper = await pool.query(
      "UPDATE papers SET status = $1, reviewer_comments = $2 WHERE id = $3 RETURNING *",
      [status, comments, id]
    );

    if (updatedPaper.rows.length === 0) {
      return res.status(404).json({ error: "Paper not found" });
    }

    res.json({ message: "Status and Feedback updated!", paper: updatedPaper.rows[0] });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).send("Server Error updating status");
  }
});

module.exports = router;