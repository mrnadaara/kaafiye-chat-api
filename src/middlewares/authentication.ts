import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { jwtAudience, jwtIssuer, jwtSecret } from "../config";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization")
    if (!authHeader) return res.status(401).json("Cannot authenticate you");

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, jwtSecret, {
        audience: jwtAudience,
        issuer: jwtIssuer
    });
    req.payload = decoded as JwtPayload;
    next();
};