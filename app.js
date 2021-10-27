const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoute = require('./routes/posts')

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('connect to db');
})

//Middleware

app.use(express.json())
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => {
    console.log('server');
})