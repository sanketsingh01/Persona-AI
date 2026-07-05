"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Persona } from "@/types/user";

interface PersonaOption {
  id: Persona;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
}

const PERSONAS: PersonaOption[] = [
  {
    id: "hitesh",
    name: "Hitesh",
    tagline: "Founder of Learnyst & Chai aur Code",
    description:
      "Learn full-stack development, JavaScript, and building real-world applications with an experienced educator.",
    avatar: "https://github.com/hiteshchoudhary.png",
  },
  {
    id: "piyush",
    name: "Piyush",
    tagline: "Founder of Teachyst",
    description:
      "Chat about programming, GenAI, web development, and building projects from scratch.",
    avatar: "https://github.com/piyushgarg-dev.png",
  },
];

interface PersonaSelectionProps {
  onPersonaSelect?: (persona: Persona) => void;
}

export default function PersonaSelection({
  onPersonaSelect,
}: PersonaSelectionProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handlePersonaSelect = (persona: Persona) => {
    if (onPersonaSelect) {
      onPersonaSelect(persona);
      return;
    }

    router.push(`/chat/${persona}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold">PersonaAI</h1>
            <p className="truncate text-xs text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Choose your AI persona
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick who you want to chat with today
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => handlePersonaSelect(persona.id)}
              className="group rounded-2xl border bg-card p-6 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex flex-col items-center text-center">
                <Image
                  src={persona.avatar}
                  alt={persona.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <h3 className="mt-4 text-lg font-semibold">{persona.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {persona.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {persona.description}
                </p>
                <span className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
                  Chat with {persona.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
