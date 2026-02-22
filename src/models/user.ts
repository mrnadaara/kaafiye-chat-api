import { Schema, Types, model } from "mongoose";
import { hash, compare } from "bcrypt";
import { CHAT_MODEL, USER_MODEL } from "./constants";

export interface UserType {
    name: string;
    username: string;
    password: string;
    email: string;
    verified: boolean;
    dateOfBirth?: Date,
    friends: Types.ObjectId[],
    chats: Types.ObjectId[]
}

export type UpdateUserBody = Pick<UserType, "name" | "username" | "dateOfBirth">

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username taken"],
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email taken"],
    },
    verified: {
        type: Boolean,
        default: false
    },
    dateOfBirth: Date,
    friends: [{
        type: Types.ObjectId,
        ref: USER_MODEL,
        select: false,
    }],
    chats: [{
        type: Types.ObjectId,
        ref: CHAT_MODEL,
        select: false,
    }]
}, {
    timestamps: true,
    methods: {
        isPasswordMatching(plainPassword: string) {
            return compare(plainPassword, this.password);
        }
    }
});

const SALT_ROUNDS = 10;

userSchema.pre("save", async function() {
  if(!this.isModified("password")) return;
  this.password = await hash(this.password, SALT_ROUNDS);
});

userSchema.pre("findOneAndUpdate", async function() {
    const updateObj = this.getUpdate();
    console.log(updateObj)
    const friendId = updateObj["$addToSet"]?.friends;
    if (friendId) {
        const friendExist = await this.model.exists({ _id: friendId });
        if (!friendExist) throw new Error("Friend does not exist")
    }
});

export default model(USER_MODEL, userSchema);