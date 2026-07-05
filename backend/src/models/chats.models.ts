import mongoose from "mongoose";

interface IChat {
    userId: mongoose.Types.ObjectId;
    persona: "hitesh" | "piyush";
}

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    persona: {
        type: String,
        enum: ['hitesh', 'piyush'],
        required: true
    },
    title: {
        type: String,
    }
}, { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
