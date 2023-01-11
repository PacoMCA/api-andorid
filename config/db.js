const mongoose = require('mongoose');

const connectDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected succefull: ${conn.connection.host}`.cyan.bold);
}

module.exports = connectDB;