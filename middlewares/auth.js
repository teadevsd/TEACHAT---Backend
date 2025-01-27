const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        console.log("All Cookies:", req.cookies); // Log all cookies for debugging

        // Get token from either cookies or Authorization header (Bearer token)
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({
                message: "Provide token",
                error: true,
                success: false,
            });
        }

        console.log("Token being verified:", token);
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        console.log("Decoded token:", decoded);

        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired, please log in again",
                error: true,
                success: false,
            });
        }

        return res.status(401).json({
            message: "Invalid or malformed token",
            error: true,
            success: false,
        });
    }
};

