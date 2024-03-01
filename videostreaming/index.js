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

app.get('/stream/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const videoMetadataResponse = await axios.get(`${fileStorageServiceUrl}/video/${videoId}`);
        const { videoUrl } = videoMetadataResponse.data;
        const videoFileStream = await axios.get(videoUrl, { responseType: 'stream' });
        videoFileStream.data.pipe(res);
    } catch (error) {
        console.error('Error streaming video:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Video streaming service listening on port 3000');
});