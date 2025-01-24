const express = require('express');
const mongoose = require('mongoose');

const connectToDB = async() => {

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to DB');

    } catch (error) {
        console.log("MongoDB connection error", error)
    }
}

module.exports = {
    connectToDB
}