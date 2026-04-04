import { Request, Router } from "express";
import { authMiddleware } from "../middlewares/authentication";
import Chat, { ChatType } from "../models/chat";
import Message from "../models/message";
import User from "../models/user";

const router = Router();
router.use(authMiddleware);

router.get("/:userId/chat", async (req, res) => {
    const chats = await Chat.find({ members: req.params.userId });
    res.json(chats)
});

router.get("/:userId/chat/:chatId", async (req, res) => {
    const chat = await Chat.findById(req.params.chatId);
    res.json(chat);
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
    const messages = await Message.find({ chatId: req.params.chatId }).select("message author").lean().populate("author", "name")
    res.json(messages)
});

router.post("/:userId/chat/:chatId/message", async (req, res) => {
    if (!req.body || !req.body.message) return res.status(400).json("No message provided");

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json("Chat not found");

    const author = await User.findById(req.params.userId);
    if (!author) return res.status(400).json("User cannot send message");

    const newMessage = new Message({ author: author.id, chatId: chat.id, message: req.body.message });
    await newMessage.save();
    res.sendStatus(200);
});

router.patch("/:userId/chat/:chatId/message/:messageId", async (req, res) => {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json("Chat not found");

    const reader = await User.findById(req.params.userId);
    if (!reader) return res.status(400).json("Cannot fulfill your request");

    const updatedMessage = await Message.findByIdAndUpdate(req.params.messageId, {
        $addToSet: { readStatus: reader.id }
    }, { returnDocument: "after" })
    res.json(updatedMessage);
});

router.delete("/:userId/chat/:chatId/message/:messageId", async (req, res) => {
    await Message.deleteOne({ _id: req.params.messageId, author: req.params.userId, chatId: req.params.chatId });
    res.sendStatus(200);
});

export { router as chatRouter }