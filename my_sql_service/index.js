const express = require('express');
const multer  = require('multer');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});
const connection = mysql.createConnection({
    host: 'mysql_db_service',
    port: 3306,
    user: 'mainuser',
    password: 'mainpassword',
    database: 'video_streaming'
});
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            return;
        }
        console.log('Connected to MySQL database');
    });

app.use(express.json());
app.use(bodyParser.json());
app.post('/upload', (req, res) => {
    const { name,filepath } = req.body;
    if (!filepath) {
        return res.status(400).json({ error: 'File path is required' });
    }
    const query = 'INSERT INTO PATHS (NAME, PATH) VALUES (?, ?)';
    const values = [name, filepath];
    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error inserting into MySQL:', error);
            return res.status(500).json({ error: 'Error inserting into MySQL' });
        }
        console.log('Data inserted into MySQL');
        res.json({ message: 'File path inserted into database' });
    });
});


app.post('/videos/retr', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    const query = 'SELECT PATH FROM PATHS WHERE ID = ?';
    const values = [id];
    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving path from MySQL:', error);
            return res.status(500).json({ error: 'Error retrieving path from MySQL' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Path not found for the given ID' });
        }
        const path = results[0].PATH;
        res.json({ path });
    });
});

app.listen(3000, () => {    console.log('File service listening on port 3000');
});