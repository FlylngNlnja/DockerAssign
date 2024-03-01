const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const fs = require("fs");
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
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
app.post('/save-video', (req, res) => {
    const { name, path } = req.body;
    const query = 'INSERT INTO PATHS (NAME, PATH) VALUES (?, ?)';
    connection.query(query, [name, path], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ status:"200", message: 'Video metadata inserted successfully', id: result.insertId });
    });
});

app.listen(3000, () => {
    console.log('Video upload service listening on port 3000');
});