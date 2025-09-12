const mongoose = require('mongoose');
require('dotenv').config();

const dbconnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(
        console.log("Db is connected successfully .")
    )
    .catch((error)=>{
        console.log("Db connection issue");
        console.error(error);
        process.exit(1);
    })
}

module.exports = dbconnect;