import { apiFetch } from "./api";
import type { ApiResponse, Chat, Persona } from "@/types/user";

export async function getAllChats(persona: Persona): Promise<Chat[]> {
    const res = await apiFetch(`/chats/${persona}`);

    if (!res.ok) {
        return [];
    }

    const body = (await res.json()) as ApiResponse<{ chats: Chat[] }>;
    return body.data.chats;
}

export async function createChat(persona: Persona): Promise<Chat | null> {
    const res = await apiFetch("/chats", {
        method: "POST",
        body: JSON.stringify({ persona }),
    });

    if (!res.ok) {
        return null;
    }

    const body = (await res.json()) as ApiResponse<{ chat: Chat }>;
    return body.data.chat;
}

export async function deleteChat(id: string): Promise<Chat | null> {
    const res = await apiFetch(`/chats/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        return null;
    }

    const body = (await res.json()) as ApiResponse<{ chat: Chat }>;
    return body.data.chat;
}
