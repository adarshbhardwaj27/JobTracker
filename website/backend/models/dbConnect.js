const mongoose = require('mongoose');
const dotenv = require('dotenv');

const DB = process.env.MONGOOSE_URL;
console.log('DB--', DB);
mongoose
    .connect(DB)
    .then(() => {
        console.log('DB connection established');
    })
    .catch((err) => {
        console.log('DB CONNECTION FAILED');
        console.log('ERR: ', err);
    });