const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// Initialize Express app
const app = express();
const port = 3000;


// Use CORS for allowing cross-origin requests
app.use(bodyParser.json());
app.use(cors());




// Connect to SQLite database
const dbPath = path.join(__dirname, 'database', 'new_show_logs.db');
const db = new sqlite3.Database(dbPath, (err) => {
   if (err) {
       console.error('Error opening database:',
       err.message);
   } else {
       console.log('Connected to SQLite database');
       //creating table if it doesn't exist
       db.run(`CREATE TABLE IF NOT EXISTS Shows (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           title TEXT,
           genre TEXT,
           rating INTEGER,
           review TEXT
       )`);
      
   }
});


app.get('/api/Shows', (req, res) => {
   const {sortBy} = req.query;


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
           console.error('Error retrieving data:',
           err.message);
           res.status(500).send('Error retrieving data');
       } else {
           res.status(200).json(rows);
       }
   });
});


//Get all logs


app.get('/api/Shows', (req, res) => {
   db.all('SELECT * FROM Shows', [], (err, rows) => {
       if (err) {
           console.error('Error retrieving data:',
           err.message);
           res.status(500).send('Error retrieving data');


       } else {
           res.status(200).json(rows);
       }
   });
});


// Get a single review by ID
app.get('/api/Shows/:id', (req, res) => {
   const { id } = req.params;
   db.get('SELECT * FROM Shows WHERE id = ?', [id], (err, row) => {
       if (err) {
           console.error('Error retrieving data:', err.message);
           res.status(500).send('Error retrieving data');
       } else if (!row) {
           res.status(404).send('Expense not found');
       } else {
           res.status(200).json(row);
       }
   });
});


// Create a new review
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


// Update an existing review
app.put('/api/Shows/:id', (req, res) => {
   const { id } = req.params;
   const { title, genre, rating, review } = req.body;
   db.run(`UPDATE Shows SET title = ?, genre = ?, rating = ? review id = ?`,
       [title, genre, rating, review],
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


// Start the server
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});