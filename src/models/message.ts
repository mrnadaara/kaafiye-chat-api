import { Schema, Types, model } from "mongoose";
import { CHAT_MODEL, MESSAGE_MODEL, USER_MODEL } from "./constants";

const messageSchema = new Schema({
    chatId: {
        type: Types.ObjectId,
        ref: CHAT_MODEL
    },
    message: {
        type: String,
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: USER_MODEL
    },
    readStatus: [{
        types: Types.ObjectId,
        ref: USER_MODEL
    }]
});

export default model(MESSAGE_MODEL, messageSchema);