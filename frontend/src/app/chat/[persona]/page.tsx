"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

import ChatInterface from "@/components/chatInterface";
import ChatsList from "@/components/chatsList";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Chat, Persona } from "@/types/user";

function isValidPersona(persona: string): persona is Persona {
  return persona === "hitesh" || persona === "piyush";
}

export default function PersonaChatPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = use(params);
  const router = useRouter();

  if (!isValidPersona(persona)) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <ProtectedRoute>
      <PersonaChatContent
        persona={persona}
        onBack={() => router.push("/dashboard")}
      />
    </ProtectedRoute>
  );
}

function PersonaChatContent({
  persona,
  onBack,
}: {
  persona: Persona;
  onBack: () => void;
}) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  if (selectedChat) {
    return (
      <ChatInterface
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <ChatsList
      persona={persona}
      onBack={onBack}
      onSelectChat={setSelectedChat}
    />
  );
}
