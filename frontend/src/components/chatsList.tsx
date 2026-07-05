"use client";

import { useCallback, useEffect, useState } from "react";

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

function getPersonaName(persona: Persona) {
  return persona === "piyush" ? "Piyush" : "Hitesh";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
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

  const personaName = getPersonaName(persona);

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
            ← Back
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold">
              {personaName} conversations
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Button
          onClick={() => void handleNewConversation()}
          disabled={isCreating}
          className="mb-6 w-full sm:w-auto"
        >
          {isCreating ? "Creating..." : "Start new conversation"}
        </Button>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent conversations</h2>
          <Badge variant="secondary">{chats.length}</Badge>
        </div>

        {error && (
          <p className="mb-4 text-center text-xs text-destructive">{error}</p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start your first chat with {personaName}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
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
                className="group flex w-full cursor-pointer items-center justify-between rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="truncate text-sm font-medium">
                    {chat.title || "New conversation"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => void handleDeleteConversation(chat._id, event)}
                  className="shrink-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
