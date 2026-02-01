import { Schema, Types, model } from "mongoose";
import { CHAT_MODEL, USER_MODEL } from "./constants";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    dateOfBirth: Date,
    friends: [{
        type: Types.ObjectId,
        ref: USER_MODEL
    }],
    chats: [{
        type: Types.ObjectId,
        ref: CHAT_MODEL
    }]
});

export default model(USER_MODEL, userSchema);