const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
const fileStorageServiceUrl = 'http://file-storage-service:3000';

const authenticateUser = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const authResponse = await axios.post('http://auth-service:3000/verify', { token: authToken });
        if (!authResponse.data.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Error authenticating user:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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
    console.log('Video streaming service listening on port 3000');
});