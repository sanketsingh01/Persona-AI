import { apiFetch } from "./api";
import type { ApiResponse, Message } from "@/types/user";

export async function getAllMessages(chatId: string): Promise<Message[]> {
    const res = await apiFetch(`/messages/${chatId}`);

    if (res.status === 404) {
        return [];
    }

    if (!res.ok) {
        return [];
    }

    const body = (await res.json()) as ApiResponse<{ messages: Message[] }>;
    return body.data.messages;
}

export async function createMessage(
    chatId: string,
    content: string,
): Promise<{ userMessage: Message; assistantMessage: Message } | null> {
    const res = await apiFetch(`/messages/${chatId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        return null;
    }

    const body = (await res.json()) as ApiResponse<{
        userMessage: Message;
        assistantMessage: Message;
    }>;

    return {
        userMessage: body.data.userMessage,
        assistantMessage: body.data.assistantMessage,
    };
}
