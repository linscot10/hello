const jwt = require('jsonwebtoken')
require('dotenv').config()
const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
module.exports = authMiddleware