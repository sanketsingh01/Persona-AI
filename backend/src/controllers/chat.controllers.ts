import { Chat } from "../models/chats.models.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { ApiError } from "../utils/api-error.ts";
import type { Request, Response } from "express";

const isValidPersona = (persona: unknown): persona is "hitesh" | "piyush" => {
    return persona === "hitesh" || persona === "piyush";
};

const getAllChats = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { persona } = req.params;
        const userId = req.user._id;

        if (!isValidPersona(persona)) {
            return res.status(400).json(new ApiError(400, "Persona is required", [], ""));
        }

        const chats = await Chat.find({
            userId: userId,
            persona: persona,
        }).sort({ createdAt: -1 }).limit(20);

        if (!chats) {
            return res.status(404).json(new ApiError(404, "No chats found", [], ""));
        };

        return res.status(200).json(new ApiResponse(200, { chats }, "All chats fetched successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching chats";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

const createChat = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { persona } = req.body;
        const userId = req.user._id;

        if (!isValidPersona(persona)) {
            return res.status(400).json(new ApiError(400, "Persona is required", [], ""));
        };

        const chat = await Chat.create({
            userId: userId,
            persona: persona,
        });

        return res.status(201).json(new ApiResponse(201, { chat }, "Chat created successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while creating chat";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};


const deleteChat = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findByIdAndDelete(id);

        if (!chat) {
            return res.status(404).json(new ApiError(404, "Chat not found", [], ""));
        };

        return res.status(200).json(new ApiResponse(200, { chat }, "Chat deleted successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while deleting chat";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
}

export { getAllChats, createChat, deleteChat };
