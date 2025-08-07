// Middleware to protect routes
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET) //Verifies the token using your secret key from .env (JWT_SECRET).If valid, it returns the decoded payload (usually includes userId).

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({
                success: false,
                message: "user not found"
            })
        }

        req.user = user; // If user is found and valid, attaches the user data to req.user so it can be used in the next route/controller.
        next();

    }catch(error){
        console.log(error.message);
        res.json({
                success: false,
                message: error.message
            })
    }
}