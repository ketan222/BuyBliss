require('dotenv').config({ path: './.config.env' });
const mongoose = require('mongoose');

const dbConnect = () => {
    // console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB CONNECTED DONE"))
    .catch((err) => {
        console.log("ERROR IN DB CONNECTION", err);
    });
}

module.exports = dbConnect;
