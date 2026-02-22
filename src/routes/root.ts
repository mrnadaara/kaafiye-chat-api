import { Router } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import { jwtAudience, jwtIssuer, jwtSecret } from "../config";

const router = Router();

router.get("/ping", (req, res) => {
    res.json("Pinged!")
})

router.post("/login", async (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json("Username and password required");
    }
    const user = await User.findOne({ username: req.body.username }).select("+password");
    if (!user) return res.status(400).json("Cannot log you in, you may need to register");
    if(!await user.isPasswordMatching(req.body.password)) {
        return res.status(400).json("Cannot log you in, please check your details and try again");
    }

    const token = jwt.sign({ username: user.username }, jwtSecret, {
        audience: jwtAudience,
        issuer: jwtIssuer,
        subject: user._id.toString(),
        expiresIn: "30d"
    });

    res.json({ token });
});

router.post("/register", async (req, res) => {
    const users = await User.find().or([{ username: req.body.username }, { email: req.body.email }]);
    if (users.length > 0) return res.status(400).json("Cannot register you");

    const newUser = new User(req.body);
    await newUser.save();

    const token = jwt.sign({ username: newUser.username}, jwtSecret, {
        audience: jwtAudience,
        issuer: jwtIssuer,
        subject: newUser._id.toString()
    });

    res.json({ token })
});

export { router as rootRouter };