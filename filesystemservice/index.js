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
    const { name } = req.body;
    const path = 'storage/' + file.originalname
    if(s.existsSync(path)){
        res.status(401).json({ error: 'File already exists' });
    }
    const query = 'INSERT INTO PATHS (NAME, PATH) VALUES (?, ?)';
    connection.query(query, [name, path], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Video inserted successfully', id: result.insertId });
    });
    fs.renameSync(file.path, 'storage/' + file.originalname);
    res.send('File uploaded successfully');
});



app.get('/videos/:NAME', (req, res) => {
    const videoName = req.params.NAME;
    const query = 'SELECT * FROM PATH WHERE NAME = ?';
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
        const filename = req.params.filename;
        const file = fs.createReadStream(results[0].PATH);
        file.pipe(res);
    });
});

app.listen(3000, () => {
    console.log('File service listening on port 3000');
});