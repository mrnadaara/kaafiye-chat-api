import { NextFunction, Request, Response } from "express";

export const isActionForUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    console.log("userId", userId)
    console.log("payload", req.payload)
    if (req.payload.sub !== userId) {
        return res.status(403).json("Cannot fulfill your request");
    }
    next();
};