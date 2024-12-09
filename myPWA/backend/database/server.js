const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Initialise the app

const app = express()
const PORT = 5000;

//Middleware
app.use(express.json());
app.use(cors());

//connect to SQLite Database
const db = new sqlite3.Database('./show_logs.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    }else {
        console.log('Connected to SQLite database');
    }

    });

// Creating show_logs table 

db.run(`
    CREATE TABLE IF NOT EXISTS show_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        rating INTEGER DEFAULT 0
        description TEXT NOT NULL,
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    }
});

// Get all show logs
app.get('/show_logs', (req, res) => {
    db.all('SELECT * FROM show_logs', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

//getting a single show log by the ID
app.get('/show_logs/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM show_logs WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json(row);
        }
    });
});

//adding a new show log 
app.post('/show_logs', (req, res) => {
    const { title, genre, description, rating } = req.body;
    const query = `INSERT INTO show_logs (title, genre, rating, description) VALUES (?, ?, ?, ?)`;
    db.run(query, [title, genre, description, rating || 0], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, id: this.lastID });
        }
    });
});

// update an existing show log 
app.put('/show_logs/:id', (req, res) => {
    const { id } = req.params;
    const { title, genre, rating, description } = req.body;
    const query = `UPDATE show_logs SET title = ?, genre = ?, rating = ?, description = ? WHERE id = ?`;
    db.run(query, [title, genre, description, rating, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json({ success: true });
        }
    });
});


// Delete a show log
app.delete('/show_logs/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM show_logs WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json({ success: true });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
