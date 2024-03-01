const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const app = express();
app.use(bodyParser.json());
const fileStorageServiceUrl = 'http://file-storage-service:3000';
const upload = multer({ dest: 'uploads/' });
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql_db_service',
    port: 3306,
    user: 'mainuser',
    password: 'mainpassword',
    database: 'video_streaming'
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.post('/videos', (req, res) => {
    const { videoID } = req.body;
    const query = 'SELECT PATH FROM PATHS WHERE ID = ?';
    connection.query(query, [videoID], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Video not found' });
            return;
        }
        res.json({ path: results[0].PATH });
    });
});


app.listen(3000, () => {
    console.log('Video streaming service listening on port 3000');
});