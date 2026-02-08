import { Schema, Types, model } from "mongoose";
import { hash, compare } from "bcrypt";
import { CHAT_MODEL, USER_MODEL } from "./constants";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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

export default model(USER_MODEL, userSchema);