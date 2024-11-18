const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Load environment variables
const API_KEY = process.env.API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// Function to fetch a random image
async function fetchRandomImage() {
    // List of filename-like keywords
    const filenameKeywords = ['IMG_', 'DSC_', 'photo_', 'pic_'];

    // Select a random keyword from the list
    const randomKeyword = filenameKeywords[Math.floor(Math.random() * filenameKeywords.length)];

    const startIndex = Math.floor(Math.random() * 90) + 1; // Random start index between 1 and 90

    // Construct the API URL with the random filename-like keyword
    const url = `https://www.googleapis.com/customsearch/v1?q=${randomKeyword}&cx=${SEARCH_ENGINE_ID}&key=${API_KEY}&searchType=image&num=1&start=${startIndex}`;

    try {
        console.log('Fetching from URL:', url); // Log the URL to check
        const response = await fetch(url);
        const data = await response.json();

        console.log('API Response:', JSON.stringify(data, null, 2)); // Log the API response

        // Check if we have images in the response
        if (data.items && data.items.length > 0) {
            return data.items[0].link; // Return the first image URL
        } else {
            throw new Error('No images found for the given query.');
        }
    } catch (error) {
        console.error('Error fetching image:', error.message);
        throw error; // Throw the error for further handling if needed
    }
}





// Function to send email
async function sendEmail(imageUrl) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: RECIPIENT_EMAIL,
        subject: 'Random Image',
        html: `<p>Here is your random image:</p><img src="${imageUrl}" alt="Random Image" style="max-width:100%; height:auto;"><p><a href="${imageUrl}">${imageUrl}</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}

// Main function to fetch an image and email it
async function main() {
    try {
        console.log('Fetching a random image...');
        const imageUrl = await fetchRandomImage();
        console.log('Image URL:', imageUrl);

        console.log('Sending email...');
        await sendEmail(imageUrl);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the script
main();
