const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const mysql = require('mysql');
const app = express();
const upload = multer({ dest: 'uploads/' });
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
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    fs.renameSync(file.path, 'storage/' + file.originalname);
    res.send('File uploaded successfully');
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const file = fs.createReadStream('storage/' + filename);
    file.pipe(res);
});

app.post('/videos', (req, res) => {
    const { name, url } = req.body;
    const query = 'INSERT INTO PATHS (NAME, PATH) VALUES (?, ?)';
    connection.query(query, [name, url], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Video inserted successfully', id: result.insertId });
    });
});
app.get('/videos', (req, res) => {
    const query = 'SELECT * FROM PATHS';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.post('/storeVideo', (req, res) => {
    const { NAME, PATH } = req.body;
    const query = 'INSERT INTO videos (NAME, PATH) VALUES (?, ?)';
    connection.query(query, [NAME, PATH], (error, results, fields) => {
        if (error) {
            console.error('Error inserting video:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Video metadata stored successfully' });
    });
});

app.get('/videos/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    const query = 'SELECT * FROM videos WHERE name = ?';
    connection.query(query, [videoName], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Video not found' });
            return;
        }
        res.json(results[0]);
    });
});

app.listen(3000, () => {
    console.log('File service listening on port 3000');
});