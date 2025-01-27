const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/generateAccessToken');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                error: true,
                success: false,
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists",
                error: true,
                success: false,
            });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate token after successful registration
        const token = generateAccessToken(newUser._id); // Use 'token'
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        
          

        return res.json({
            message: "Successfully registered!",
            error: false,
            success: true,
            data: { user: newUser, accessToken: token },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            message: error.message || "User registration failed",
            error: true,
            success: false,
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // Accept either username or email as "identifier"

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Username/Email and password are required",
                error: true,
                success: false,
            });
        }

        // Check if identifier is an email
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

        // Find user by email or username
        const user = isEmail 
            ? await User.findOne({ email: identifier }) 
            : await User.findOne({ username: identifier });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                message: "Invalid username/email or password",
                error: true,
                success: false,
            });
        }

        // Generate access token
        const accessToken = generateAccessToken(user._id);

        // Set cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.json({
            message: "Successfully logged in",
            error: false,
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};
