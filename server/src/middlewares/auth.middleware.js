import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized request: Missing access token"
            });
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodeToken) {
            return res.status(401).json({
                error: "Unauthorized request: Invalid access token"
            });
        }

        const user = await User.findById(decodeToken.id).select("-password");
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized request: User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error while authenticating access token", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

export { verifyJWT };