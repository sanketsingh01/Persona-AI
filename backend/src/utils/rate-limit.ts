import type mongoose from "mongoose";

import { Chat } from "../models/chats.models.ts";
import { Message } from "../models/messages.models.ts";
import { ApiError } from "./api-error.ts";

const DAILY_MESSAGE_LIMIT = Number(process.env.DAILY_MESSAGE_LIMIT) || 4;

function getStartOfUtcDay(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getDailyUserMessageCount(
    userId: mongoose.Types.ObjectId,
): Promise<number> {
    const startOfDay = getStartOfUtcDay();
    const userChatIds = await Chat.find({ userId }).distinct("_id");

    if (!userChatIds.length) {
        return 0;
    }

    return Message.countDocuments({
        chatId: { $in: userChatIds },
        role: "user",
        createdAt: { $gte: startOfDay },
    });
}

export async function assertDailyMessageLimit(
    userId: mongoose.Types.ObjectId,
): Promise<void> {
    const count = await getDailyUserMessageCount(userId);

    if (count >= DAILY_MESSAGE_LIMIT) {
        throw new ApiError(
            429,
            `Daily message limit reached. You can send up to ${DAILY_MESSAGE_LIMIT} messages per day.`,
            [],
            "",
        );
    }
}

export { DAILY_MESSAGE_LIMIT };
