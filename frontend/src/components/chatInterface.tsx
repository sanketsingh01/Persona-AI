"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMessage, getAllMessages } from "@/lib/message";
import type { Chat, Message } from "@/types/user";

interface ChatInterfaceProps {
  chat: Chat;
  onBack: () => void;
}

function getPersonaName(persona: Chat["persona"]) {
  return persona === "piyush" ? "Piyush" : "Hitesh";
}

export default function ChatInterface({ chat, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const personaName = getPersonaName(chat.persona);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      setIsLoading(true);
      setError(null);

      const data = await getAllMessages(chat._id);

      if (!cancelled) {
        setMessages(data);
        setIsLoading(false);
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [chat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const content = inputMessage.trim();
    if (!content || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);
    setInputMessage("");

    const optimisticUserMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    const result = await createMessage(chat._id, content);

    if (!result) {
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(content);
      setError("Failed to send message. Please try again.");
      setIsSending(false);
      return;
    }

    setMessages((prev) => [
      ...prev.slice(0, -1),
      result.userMessage,
      result.assistantMessage,
    ]);
    setIsSending(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
            ← Back
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold">{personaName}</h1>
            <p className="truncate text-xs text-muted-foreground">
              {chat.title || "New conversation"}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Say hello to {personaName} to start the conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-3">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:max-w-[70%] ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`mt-1 text-[10px] uppercase tracking-wide ${
                        isUser
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isUser ? "You" : personaName}
                    </p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  {personaName} is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {error && (
            <p className="mb-2 text-center text-xs text-destructive">{error}</p>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder={`Message ${personaName}...`}
              disabled={isSending}
              className="flex-1"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="shrink-0"
            >
              {isSending ? "..." : "Send"}
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
