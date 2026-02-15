import { Request, Router } from "express";
import { authMiddleware } from "../middlewares/authentication";
import User, { UpdateUserBody } from "../models/user";

const router = Router();
router.use(authMiddleware);

const userRoute = router.route("/:userId");

userRoute.get(async (req, res) => {
    const userId = req.params.userId;
    if (req.payload.sub !== userId) {
        return res.status(403).json("Cannot fulfill your request")
    }
    const user = await User.findById(userId);
    res.json(user);
});

userRoute.put(async (req: Request<{userId: string}, any, UpdateUserBody>, res) => {
    const userId = req.params.userId;
    if (req.payload.sub !== userId) {
        return res.status(403).json("Cannot fulfill your request")
    }
    await User.findByIdAndUpdate(userId, {
        name: req.body.name,
        username: req.body.username,
        dateOfBirth: req.body.dateOfBirth,
    })
    res.json("Updated your details");
});

const friendRoute = router.route("/:userId/friend");

friendRoute.get(async (req, res) => {
    const userId = req.params.userId;
    if (req.payload.sub !== userId) {
        return res.status(403).json("Cannot fulfill your request")
    }
    const friends = await User.findById(userId).select("friends").populate("friends", "username");
    res.json(friends);
});

export { router as singleUserRouter }