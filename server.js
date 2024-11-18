require('dotenv').config();

const API_KEY = process.env.API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
const EMAIL_USER = process.env.EMAIL_USER; // Sender email
const EMAIL_PASS = process.env.EMAIL_PASS; // Sender email password
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;


const express = require('express');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(express.static('public'));


// Random keywords array
const keywords = ['nature', 'city', 'space', 'animals', 'abstract'];

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

app.get('/send-random-image', async (req, res) => {
    try {
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
        const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${randomKeyword}&cx=${SEARCH_ENGINE_ID}&key=${API_KEY}&searchType=image&num=1&start=${Math.floor(Math.random() * 10) + 1}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const imageUrl = data.items[0].link;

            // Send email with the image
            const mailOptions = {
                from: EMAIL_USER,
                to: RECIPIENT_EMAIL,
                subject: 'Random Image from Your Website',
                html: `<p>Here is a random image fetched from Google:</p><p><img src="${imageUrl}" alt="Random Image" style="max-width:100%; height:auto;"></p><p>Direct Link: <a href="${imageUrl}">${imageUrl}</a></p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({ error: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.json({ message: 'Image sent to your email successfully!' });
                }
            });
        } else {
            res.status(404).json({ error: 'No images found' });
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
