import { Schema, Types, model } from "mongoose";
import { CHAT_MODEL, USER_MODEL } from "./constants";

export const CHAT_STATUS = {
    ACTIVE: "active",
    ARCHIVED: "archived"
} as const;
export type CHAT_STATUS = typeof CHAT_STATUS[keyof typeof CHAT_STATUS]

const chatSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(CHAT_STATUS)
    },
    members: [{
        type: Types.ObjectId,
        ref: USER_MODEL
    }],
    admin: {
        type: Types.ObjectId,
        ref: USER_MODEL
    }
});

export default model(CHAT_MODEL, chatSchema);