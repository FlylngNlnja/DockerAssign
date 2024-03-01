const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const app = express();
app.use(bodyParser.json());
const fileStorageServiceUrl = 'http://file-storage-service:3000';
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { NAME, PATH } = req.body;
        const fileData = new FormData();
        fileData.append('video', fs.createReadStream(req.file.path));
        const fileUploadResponse = await axios.post(`${fileStorageServiceUrl}/upload`, fileData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const videoUrl = fileUploadResponse.data.url;
        const metadataResponse = await axios.post('http://file-storage-service:3000/storeVideo', {
            NAME,
            PATH
        });
        res.json(metadataResponse.data);
    } catch (error) {
        console.error('Error uploading video:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Video upload service listening on port 3000');
});