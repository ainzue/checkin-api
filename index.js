const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1); // hentikan server jika DB gagal
  }
  console.log("Connected to MySQL");
});


// POST check-in
app.post('/checkin', (req, res) => {
  const { user_id, latitude, longitude, timestamp } = req.body;
  const sql = 'INSERT INTO checkins (user_id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, latitude, longitude, timestamp], err => {
    if (err) return res.status(500).send('Database error');
    res.send('Check-in successful');
  });
});

// GET all check-ins
app.get('/checkins', (req, res) => {
  db.query('SELECT * FROM checkins ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).send('Fetch error');
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

