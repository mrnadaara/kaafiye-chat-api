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
    const updatedUser = await User.findByIdAndUpdate(userId, {
        name: req.body.name,
        username: req.body.username,
        dateOfBirth: req.body.dateOfBirth,
    }, { runValidators: true, returnDocument: "after"})
    res.json(updatedUser);
});

const friendRoute = router.route("/:userId/friend");

friendRoute.get(async (req, res) => {
    const userId = req.params.userId;
    const friends = await User.findById(userId).select("friends").lean().populate("friends", "username");
    res.json(friends);
});

friendRoute.post(async (req, res) => {
    const userId = req.params.userId;
    if(!req.body || !req.body.friendId) {
        return res.status(400).json("Cannot add friend");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $addToSet: { friends: req.body.friendId }
    }, { returnDocument: "after" }).select("friends").lean().populate("friends", "username");
    res.json(updatedUser.friends);
});

friendRoute.delete(async (req, res) => {
    const userId = req.params.userId;
    if(!req.body || !req.body.friendId) {
        return res.status(400).json("Cannot add friend");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: { friends: req.body.friendId }
    }, { returnDocument: "after" }).select("friends").lean().populate("friends", "username");
    res.json(updatedUser.friends);
});

export { router as singleUserRouter }