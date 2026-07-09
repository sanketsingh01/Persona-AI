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
): Promise<
    | { ok: true; userMessage: Message; assistantMessage: Message }
    | { ok: false; error: string }
> {
    const res = await apiFetch(`/messages/${chatId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });

    const body = (await res.json()) as ApiResponse<{
        userMessage: Message;
        assistantMessage: Message;
    }> & { message?: string };

    if (!res.ok) {
        return {
            ok: false,
            error: body.message ?? "Failed to send message. Please try again.",
        };
    }

    return {
        ok: true,
        userMessage: body.data.userMessage,
        assistantMessage: body.data.assistantMessage,
    };
}
