import { Schema, Types, model } from "mongoose";
import { CHAT_MODEL, USER_MODEL } from "./constants";

export const CHAT_STATUS = {
    ACTIVE: "active",
    ARCHIVED: "archived"
} as const;
export type CHAT_STATUS = typeof CHAT_STATUS[keyof typeof CHAT_STATUS]

export type ChatType = {
    title: string;
    status: CHAT_STATUS;
    members: Types.ObjectId[];
    admin: Types.ObjectId;
}

const chatSchema = new Schema({
    title: String,
    status: {
        type: String,
        enum: {
            values: Object.values(CHAT_STATUS),
            message: "Must be either ACTIVE or ARCHIVED"
        },
        default: CHAT_STATUS.ACTIVE
    },
    members: [{
        type: Types.ObjectId,
        ref: USER_MODEL
    }],
    admin: {
        type: Types.ObjectId,
        ref: USER_MODEL,
        require: true,
    }
});

// chatSchema.pre("save", function() {
//     console.log(this.members)
//     console.log(Array.from(new Set(this.members).values()))
//     this.members = Array.from(new Set(this.members).values())
// })

export default model(CHAT_MODEL, chatSchema);