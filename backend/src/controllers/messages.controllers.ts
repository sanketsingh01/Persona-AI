import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { Request, Response } from "express";

import { Chat } from "../models/chats.models.ts";
import { Message } from "../models/messages.models.ts";
import { hitesh, piyush } from "../utils/ai.ts";
import { ApiError } from "../utils/api-error.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { assertDailyMessageLimit } from "../utils/rate-limit.ts";

const getAllMessages = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { chatId: chatIdParam } = req.params;
        const chatId = Array.isArray(chatIdParam) ? chatIdParam[0] : chatIdParam;
        if (typeof chatId !== "string" || !chatId) {
            return res.status(400).json(new ApiError(400, "chatId is required", [], ""));
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        if (!messages.length) {
            return res.status(404).json(new ApiError(404, "No messages found", [], ""));
        }

        const filteredmessages = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }));

        return res.status(200).json(new ApiResponse(200, { messages: filteredmessages }, "Messages fetched successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching messages";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

const createMessage = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { chatId: chatIdParam } = req.params;
        const chatId = Array.isArray(chatIdParam) ? chatIdParam[0] : chatIdParam;
        const { content } = req.body;

        if (typeof chatId !== "string" || !chatId) {
            return res.status(400).json(new ApiError(400, "chatId is required", [], ""));
        }

        if (!content?.trim()) {
            return res.status(400).json(new ApiError(400, "content is required", [], ""));
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json(new ApiError(404, "Chat not found", [], ""));
        }

        if (chat.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json(new ApiError(403, "Forbidden", [], ""));
        }

        try {
            await assertDailyMessageLimit(req.user._id);
        } catch (error) {
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json(error);
            }
            throw error;
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .limit(20);

        const history: ChatCompletionMessageParam[] = messages
            .reverse()
            .map((message) => ({
                role: message.role as "user" | "assistant",
                content: message.content,
            }));

        if (!messages.length) {
            const title = content.trim().split(/\s+/);
            chat.title = title.length <= 3 ? title.join(" ") : `${title.slice(0, 3).join(" ")}...`;
            await chat.save();
        }

        const userContent = content.trim();

        const newMessage: ChatCompletionMessageParam = {
            role: "user",
            content: userContent,
        };

        let rawContent: string;

        if (chat.persona === "hitesh") {
            rawContent = await hitesh(history, newMessage);
        } else if (chat.persona === "piyush") {
            rawContent = await piyush(history, newMessage);
        } else {
            return res.status(400).json(new ApiError(400, "Invalid persona", [], ""));
        }

        const userMessage = await Message.create({
            chatId,
            role: "user",
            content: userContent,
        });

        const assistantMessage = await Message.create({
            chatId,
            role: "assistant",
            content: rawContent,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                { userMessage, assistantMessage },
                "Message created successfully",
            ),
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while creating message";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

export { getAllMessages, createMessage };
