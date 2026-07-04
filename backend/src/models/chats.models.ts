import mongoose from "mongoose";

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
        required: true
    }
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);