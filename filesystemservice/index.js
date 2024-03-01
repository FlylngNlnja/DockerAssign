const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const mysql = require('mysql');
const app = express();
const upload = multer({ dest: 'uploads/' });
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
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const dir = 'storage/';
    const path = dir + file.originalname;
    if(fs.existsSync(path)){
        return res.status(401).json({ error: 'File already exists' });
    }
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path, fs.readFileSync(file.path));
    res.json({ status:"200" ,message: path });
});


app.post('/videos/retr', (req, res) => {
    const { videopath } = req.body;
    const file = fs.createReadStream(videopath);
    file.pipe(res);
});

app.listen(3000, () => {    console.log('File service listening on port 3000');
});