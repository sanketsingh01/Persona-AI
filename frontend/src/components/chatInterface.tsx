"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { CartoonLoader } from "@/components/cartoon/CartoonDecor";
import { Input } from "@/components/ui/input";
import { createMessage, getAllMessages } from "@/lib/message";
import type { Chat, Message } from "@/types/user";

interface ChatInterfaceProps {
  chat: Chat;
  onBack: () => void;
}

const PERSONA_META: Record<
  Chat["persona"],
  { name: string; emoji: string; color: string }
> = {
  hitesh: { name: "Hitesh", emoji: "☕", color: "bg-bubble-yellow" },
  piyush: { name: "Piyush", emoji: "🚀", color: "bg-bubble-lavender" },
};

export default function ChatInterface({ chat, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const meta = PERSONA_META[chat.persona];

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
    <div className="dot-bg flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b-[3px] border-ink bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="cartoon-btn shrink-0 bg-white px-3 py-2 text-sm"
          >
            ← Back
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink text-lg ${meta.color} cartoon-shadow-sm`}
            >
              {meta.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-heading text-lg font-bold">
                {meta.name}
              </h1>
              <p className="truncate text-xs font-medium text-muted-foreground">
                {chat.title || "New conversation"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CartoonLoader label="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="cartoon-card max-w-sm p-8">
              <p className="text-5xl">{meta.emoji}</p>
              <p className="mt-4 font-heading text-xl font-bold">
                Say hello to {meta.name}!
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask about coding, projects, or anything you're curious
                about.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <span
                      className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-sm ${meta.color}`}
                    >
                      {meta.emoji}
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] ${
                      isUser ? "speech-bubble-user" : "speech-bubble-assistant"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {isUser ? "You" : meta.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-end gap-2">
                <span
                  className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-sm ${meta.color}`}
                >
                  {meta.emoji}
                </span>
                <div className="speech-bubble-assistant flex items-center gap-1.5 px-5 py-3">
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-ink/40" />
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-ink/40" />
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-ink/40" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 border-t-[3px] border-ink bg-card/90 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {error && (
            <div className="mb-3 rounded-xl border-2 border-destructive bg-destructive/10 px-3 py-1.5 text-center text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder={`Message ${meta.name}...`}
              disabled={isSending}
              className="h-12 flex-1 rounded-2xl border-[3px] border-ink bg-white px-4 text-base cartoon-shadow-sm focus-visible:ring-bubble-sky"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="cartoon-btn flex h-12 w-12 shrink-0 items-center justify-center bg-bubble-pink disabled:opacity-50"
            >
              <Send className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
