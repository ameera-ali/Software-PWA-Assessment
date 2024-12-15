const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Open the SQLite database (show_logs.db)
const db = new sqlite3.Database('./show_logs.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

app.use(cors());  // Allow Cross-Origin Resource Sharing
app.use(express.json());  // For parsing application/json

// Get all shows from the database
app.get('/api/shows', (req, res) => {
    db.all('SELECT * FROM Shows', [], (err, rows) => {
        if (err) {
            console.error("Error retrieving shows:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);  // Send the shows as a JSON response
    });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

