import { Request, Router } from "express";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import { authMiddleware } from "../middlewares/authentication";
import User, { UpdateUserBody } from "../models/user";
import { isActionForUser } from "../middlewares/isActionForUser";
import mailtrap from "../clients/mailtrap";
import path from "node:path";
import { jwtAudience, jwtIssuer, jwtSecret, serverPort } from "../config";

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

router.put("/:userId/change-password", async (req, res) => {
    if (!req.body || !req.body.currentPassword || !req.body.newPassword) {
        return res.status(400).json("Missing information")
    }
    const user = await User.findById(req.params.userId).select("+password");
    if(!user) return res.status(400).json("Cannot fulfill your request");

    if(!await user.isPasswordMatching(req.body.currentPassword)) {
        return res.status(400).json("Unable to change your password, please check if you are entering the correct details")
    }

    user.password = req.body.newPassword;
    await user.save();
    res.sendStatus(200)
});

router.put("/:userId/change-email", async (req, res) => {
    if (!req.body || !req.body.currentPassword || !req.body.newEmail) {
        return res.status(400).json("Missing information")
    }

    const user = await User.findById(req.params.userId).select("+password");
    if(!user) return res.status(400).json("Cannot fulfill your request");

    if(!await user.isPasswordMatching(req.body.currentPassword)) {
        return res.status(400).json("Cannot fulfill your request, please check if you are entering the correct details")
    }

    const token = jwt.sign({ newEmail: req.body.newEmail }, jwtSecret, {
        audience: jwtAudience,
        issuer: jwtIssuer,
        subject: user._id.toString(),
        expiresIn: "1h"
    });

    const data = {
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        verifyEmailLink: `http://localhost:${serverPort}/verify-email?token=${token}`
    };

    const changeEmailTemplatePath = path.join(import.meta.dirname, "../templates/email/change-email.html");
    await mailtrap.send({
        from: { name: "Mailtrap Test", email: "sender@demomailtrap.co" },
        to: [{ email: req.body.newEmail }],
        subject: "Request for email change",
        html: await ejs.renderFile(changeEmailTemplatePath, data),
    });
    res.json("Sent email")
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
    res.json(updatedUser?.friends);
});

friendRoute.delete(async (req, res) => {
    const userId = req.params.userId;
    if(!req.body || !req.body.friendId) {
        return res.status(400).json("Cannot add friend");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: { friends: req.body.friendId }
    }, { returnDocument: "after" }).select("friends").lean().populate("friends", "username");
    res.json(updatedUser?.friends);
});

export { router as singleUserRouter }