import { Router } from "express";

const router = Router();

router.get("/ping", (req, res) => {
    res.json("Pinged!")
})

router.post("/login", (req, res) => {
    return
});

router.post("/register", (req, res) => {
    return
});

export { router as rootRouter };