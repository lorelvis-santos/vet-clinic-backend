import jwt from "jsonwebtoken"
import Veterinarian from "../models/veterinarian.model.js";
import HttpError from "../helpers/HttpError.js";

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({
            ok: false,
            message: "Authentication credentials required"
        })
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const veterinarian = await Veterinarian.findById(decoded.id).select("-password -token -verified");
        
        if (!veterinarian) {
            throw new HttpError("User doesn't exist", 404);
        }

        req.veterinarian = veterinarian;

        return next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            ok: false,
            message: "Invalid token provided"
        });
    }
}

export default requireAuth;