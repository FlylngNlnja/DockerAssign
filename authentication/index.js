const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const mysqlServiceUrl = 'http://mysql-service:3000';
const secretKey = 'cff70a8b-7038-4b4d-a303-c32aae286a67';
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = 'SELECT id, password FROM users WHERE username = ?';
        connection.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.length === 0 || password !== results[0].password) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const userId = results[0].id;
            const token = jwt.sign({ userId, username }, secretKey);
            res.json({ token });
        });
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        res.status(401).json({ error: 'Invalid username or password' });
    }
});


app.post('/verify', (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error('Error verifying token:', err.message);
                res.status(401).json({ error: 'Invalid token' });
            } else {
                res.json({ valid: true });
            }
        });
    } else{
        res.status(401).json({ error: 'Token is required' });
    }

});


app.listen(3000, () => {
    console.log('Authentication service listening on port 3000');
});