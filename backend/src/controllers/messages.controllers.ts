import { Message } from "../models/messages.models.ts";
import { ApiError } from "../utils/api-error.ts";
import { ApiResponse } from "../utils/api-response.ts";
import type { Request, Response } from "express";

const getAllMessages = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json(new ApiError(400, "chatId is required", [], ""));
        }

        const messages = await Message.find({
            where: {
                chatId: chatId,
            }
        });

        if (!messages) {
            return res.status(404).json(new ApiError(404, "No messages found", [], ""));
        };

        const filteredmessages = messages.map((message) => {
            return {
                role: message.role,
                content: message.content,
            }
        });

        return res.status(200).json(new ApiResponse(200, { messages: filteredmessages }, "Messages fetched successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching messages";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

export { getAllMessages };