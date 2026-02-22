import { Request, Router } from "express";
import { authMiddleware } from "../middlewares/authentication";
import User, { UpdateUserBody } from "../models/user";
import { isActionForUser } from "../middlewares/isActionForUser";

const router = Router();
router.use(authMiddleware);
router.param("userId", isActionForUser);

const userRoute = router.route("/:userId");

userRoute.get(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.json(user);
});

userRoute.put(async (req: Request<{userId: string}, any, UpdateUserBody>, res) => {
    const userId = req.params.userId;
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
    const user = await User.findById(userId, { friends: 1 }).lean().populate("friends", "username");
    res.json(user.friends);
});

friendRoute.post(async (req, res) => {
    const userId = req.params.userId;
    if (!req.body || !req.body.friendId) return res.status(400).json("Cannot add friend");
    await User.updateOne({ _id: userId }, { $addToSet: { friends: req.body.friendId }});
    res.json("Friend added");
});

friendRoute.delete(async (req, res) => {
    const userId = req.params.userId;
    if (!req.body || !req.body.friendId) return res.status(400).json("Cannot delete friend");
    await User.updateOne({ _id: userId }, { $pull: { friends: req.body.friendId }});
    res.json("Friend removed");
});

export { router as singleUserRouter }