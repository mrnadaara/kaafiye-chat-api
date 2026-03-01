import { Request, Router } from "express";
import { authMiddleware } from "../middlewares/authentication";
import Chat, { ChatType } from "../models/chat";
import Message from "../models/message";

const router = Router();
router.use(authMiddleware);

router.get("/:userId/chat", async (req, res) => {
    const chats = await Chat.find({ members: req.params.userId });
    res.json(chats)
});

router.post("/:userId/chat", async (req: Request<{userId: string}, any, { members: ChatType["members"]}>, res) => {
    if (!req.body || !req.body.members || !req.body.members.length) {
        return res.status(400).json("Choose at least one user")
    }
    const userId = req.params.userId;
    const uniqueMembers = Array.from(new Set(req.body.members).values());
    const newChat = new Chat({ members: [userId, ...uniqueMembers], admin: userId });
    res.json(await newChat.save());
});

router.patch("/:userId/chat/:chatId", async (req, res) => {
    if (!req.body) return res.status(400).json("Cannot update chat settings");
    const bodyKeys = Object.keys(req.body);
    if(!bodyKeys.includes("status") && !bodyKeys.includes("title")) {
        return res.status(400).json("Cannot update chat settings")
    }
    const updatedChat = await Chat.findByIdAndUpdate(req.params.chatId, req.body, { runValidators: true, returnDocument: "after"})
    res.json(updatedChat);
});

router.get("/:userId/chat/:chatId/message", async (req, res) => {
    const messages = await Message.find({ chatId: req.params.chatId })
    res.json(messages)
});

router.post("/:userId/chat/:chatId/message", (req, res) => {
    res.json("Add message to chat")
});

router.patch("/:chatId/message/:messageId", (req, res) => {
    res.json("Update message read status");
});

router.delete("/:chatId/message/:messageId", (req, res) => {
    res.json("Delete message from chat");
});

export { router as chatRouter }