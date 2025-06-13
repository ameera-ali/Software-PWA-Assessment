const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database', 'new_show_logs.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');

    // Create Users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

    // Create Shows table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      genre TEXT,
      rating INTEGER,
      review TEXT
    )`);
  }
});

// SIGN UP endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Username and password required");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) return res.status(409).send("Username already exists");
        return res.status(500).send("Database error");
      }
      res.status(201).json({ id: this.lastID });
    });
  } catch {
    res.status(500).send("Server error");
  }
});

// LOGIN endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Username and password required");

  db.get(`SELECT * FROM Users WHERE username = ?`, [username], async (err, row) => {
    if (err) return res.status(500).send("Database error");
    if (!row) return res.status(401).send("Invalid username or password");

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).send("Invalid username or password");

    res.status(200).send("Login successful");
  });
});

// --- Shows API ---

// Get all shows with optional sorting
app.get('/api/Shows', (req, res) => {
  const { sortBy } = req.query;
  let query = 'SELECT * FROM Shows';

  if (sortBy) {
    const validColumns = ['title', 'genre', 'rating', 'review'];
    if (validColumns.includes(sortBy)) {
      query += ` ORDER BY ${sortBy}`;
    } else {
      return res.status(400).send('Invalid sort parameter');
    }
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving data:', err.message);
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(rows);
    }
  });
});

// Get show by ID
app.get('/api/Shows/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Shows WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error retrieving data:', err.message);
      res.status(500).send('Error retrieving data');
    } else if (!row) {
      res.status(404).send('Show not found');
    } else {
      res.status(200).json(row);
    }
  });
});

// Create a new show
app.post('/api/Shows', (req, res) => {
  const { title, genre, rating, review } = req.body;
  db.run(`INSERT INTO Shows (title, genre, rating, review) VALUES (?, ?, ?, ?)`,
    [title, genre, rating, review],
    function (err) {
      if (err) {
        console.error('Error inserting data:', err.message);
        res.status(500).send('Error inserting data');
      } else {
        res.status(201).json({ id: this.lastID });
      }
    });
});

// Update an existing show
app.put('/api/Shows/:id', (req, res) => {
  const { id } = req.params;
  const { title, genre, rating, review } = req.body;
  db.run(`UPDATE Shows SET title = ?, genre = ?, rating = ?, review = ? WHERE id = ?`,
    [title, genre, rating, review, id],
    function (err) {
      if (err) {
        console.error('Error updating data:', err.message);
        res.status(500).send('Error updating data');
      } else {
        res.status(200).send('Updated successfully');
      }
    });
});

// Delete a show
app.delete('/api/Shows/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Shows WHERE id = ?`, id, function (err) {
    if (err) {
      console.error('Error deleting data:', err.message);
      res.status(500).send('Error deleting data');
    } else {
      res.status(200).send('Deleted successfully');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
