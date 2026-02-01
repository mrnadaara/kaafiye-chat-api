import { Router } from "express";

const router = Router();

router.get("/ping", (req, res) => {
    res.json("Pinged!")
})

router.post("/login", (req, res) => {
    res.json("");
});

router.post("/register", (req, res) => {
    res.json("");
});

export { router as rootRouter };