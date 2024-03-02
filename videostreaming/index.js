
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath;
    if (req.url === '/index.html' || req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/login.html') {
        filePath = path.join(__dirname, 'login.html');
    } else {
        res.writeHead(404);
        res.end('File not found');
        return;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
