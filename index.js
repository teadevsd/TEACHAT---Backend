const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const { connectToDB } = require('./config/connectDB');
dotenv.config();

const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');

connectToDB()

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend origin
    credentials: true, // Allow credentials (cookies, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/user', userRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));