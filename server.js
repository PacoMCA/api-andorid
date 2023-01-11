const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.json({
    extended: true
}));

dotenv.config({
    path: './config/config.env'
})

connectDB();

//Metodos GET POST PUT DELETE
app.use('/api/todo/auth', require('./routes/user.js'))

const port = process.env.PORT || 3000;


app.listen(port, console.log(`server running on port: ${port}`.red.underline.bold));