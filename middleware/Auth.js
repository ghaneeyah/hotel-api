const jwt = require("jsonwebtoken");
const User = require("../models/user")

// const admin = async (req, res, next) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ success: false, message: "Access Denied" });
//     }
//     next();
// };

// const optional = async (req, res, next) => {
//     const authHeader = req.header("Authorization");
//     const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'
//     if (!token) {
//         return next();
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         req.user = await User.findById(decoded._id).select("-password");
//         next();
//     } catch (error) {
//         console.error("Error in optional auth middleware:", error);
//         next();
//     }
// };

// module.exports = { auth, admin, optional };



const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided. Unauthorized access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded);

        // Determine which field to use based on what is present in the token
        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Invalid token. Unauthorized access.' });
        }

        // Find the user by either userId or id
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Unauthorized access.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, message: 'Invalid token. Unauthorized access.', error: error.message });
    }
};

module.exports = auth;
