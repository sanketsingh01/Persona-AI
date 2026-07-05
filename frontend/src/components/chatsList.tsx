"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";

import { CartoonLoader } from "@/components/cartoon/CartoonDecor";
import { CartoonShell } from "@/components/cartoon/CartoonShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createChat, deleteChat, getAllChats } from "@/lib/chat";
import type { Chat, Persona } from "@/types/user";

interface ChatsListProps {
  persona: Persona;
  onBack: () => void;
  onSelectChat: (chat: Chat) => void;
}

const PERSONA_META: Record<
  Persona,
  { name: string; emoji: string; color: string }
> = {
  hitesh: { name: "Hitesh", emoji: "☕", color: "bg-bubble-yellow" },
  piyush: { name: "Piyush", emoji: "🚀", color: "bg-bubble-lavender" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ChatsList({
  persona,
  onBack,
  onSelectChat,
}: ChatsListProps) {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = PERSONA_META[persona];

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const data = await getAllChats(persona);
    setChats(data);
    setIsLoading(false);
  }, [persona]);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  const handleNewConversation = async () => {
    setIsCreating(true);
    setError(null);

    const chat = await createChat(persona);

    if (!chat) {
      setError("Failed to create conversation. Please try again.");
      setIsCreating(false);
      return;
    }

    setChats((prev) => [chat, ...prev]);
    setIsCreating(false);
    onSelectChat(chat);
  };

  const handleDeleteConversation = async (
    chatId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    const deleted = await deleteChat(chatId);
    if (!deleted) {
      setError("Failed to delete conversation.");
      return;
    }

    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
  };

  return (
    <CartoonShell showNav={false}>
      <header className="border-b-[3px] border-ink bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="cartoon-btn shrink-0 bg-white px-3 py-2 text-sm"
          >
            ← Back
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink text-sm ${meta.color}`}
              >
                {meta.emoji}
              </span>
              <h1 className="truncate font-heading text-lg font-bold">
                {meta.name}'s Chats
              </h1>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {user?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="cartoon-btn shrink-0 bg-white px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <button
          type="button"
          onClick={() => void handleNewConversation()}
          disabled={isCreating}
          className="cartoon-btn mb-8 flex w-full items-center justify-center gap-2 bg-bubble-mint py-3.5 text-base disabled:opacity-60 sm:w-auto sm:px-8"
        >
          <MessageSquarePlus className="h-5 w-5" strokeWidth={2.5} />
          {isCreating ? "Creating..." : "Start new chat ✨"}
        </button>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Your conversations</h2>
          <Badge
            variant="secondary"
            className="rounded-full border-2 border-ink bg-bubble-yellow px-3 py-0.5 font-bold text-ink"
          >
            {chats.length}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border-2 border-destructive bg-destructive/10 px-4 py-2 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <CartoonLoader label="Loading your chats..." />
          </div>
        ) : chats.length === 0 ? (
          <div className="cartoon-card border-dashed py-16 text-center">
            <p className="text-4xl">💬</p>
            <p className="mt-4 font-heading text-lg font-bold">
              No chats yet!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start your first conversation with {meta.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat, index) => (
              <div
                key={chat._id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectChat(chat)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectChat(chat);
                  }
                }}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-2xl border-[3px] border-ink bg-card px-4 py-3.5 text-left cartoon-shadow-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)] ${index % 2 === 1 ? "sm:ml-4" : ""}`}
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="truncate font-heading font-bold">
                    {chat.title || "New conversation"}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) =>
                    void handleDeleteConversation(chat._id, event)
                  }
                  className="shrink-0 rounded-xl border-2 border-transparent text-destructive opacity-0 transition-all group-hover:border-ink group-hover:bg-destructive/10 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </CartoonShell>
  );
}
