"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StarBurst } from "@/components/cartoon/CartoonDecor";
import { CartoonShell } from "@/components/cartoon/CartoonShell";
import { useAuth } from "@/context/AuthContext";
import type { Persona } from "@/types/user";

interface PersonaOption {
  id: Persona;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  accent: string;
  bubbleColor: string;
  rotate: string;
  emoji: string;
}

const PERSONAS: PersonaOption[] = [
  {
    id: "hitesh",
    name: "Hitesh",
    tagline: "Founder of Learnyst & Chai aur Code",
    description:
      "Master full-stack development, JavaScript, and building real-world apps with an experienced educator.",
    avatar: "https://github.com/hiteshchoudhary.png",
    accent: "bg-bubble-yellow",
    bubbleColor: "bg-bubble-yellow/30",
    rotate: "-rotate-1 hover:-rotate-3",
    emoji: "☕",
  },
  {
    id: "piyush",
    name: "Piyush",
    tagline: "Founder of Teachyst",
    description:
      "Dive into programming, GenAI, web dev, and building projects from scratch with a creative builder.",
    avatar: "https://github.com/piyushgarg-dev.png",
    accent: "bg-bubble-lavender",
    bubbleColor: "bg-bubble-lavender/30",
    rotate: "rotate-1 hover:rotate-3",
    emoji: "🚀",
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
    <CartoonShell showNav={false}>
      <header className="border-b-[3px] border-ink bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-bubble-sky">
              Dashboard
            </p>
            <h1 className="truncate font-heading text-xl font-bold">
              Hey, {user?.name?.split(" ")[0]}! {user?.name ? "👋" : ""}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="cartoon-btn shrink-0 bg-white px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-bubble-mint px-4 py-1 text-sm font-bold cartoon-shadow-sm">
            <StarBurst className="h-4 w-4 text-bubble-yellow" />
            Pick your mentor
          </div>
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Who do you want to chat with?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Each persona has their own vibe, expertise, and teaching style.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => handlePersonaSelect(persona.id)}
              className={`cartoon-card group w-full p-6 text-left transition-transform ${persona.rotate}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div
                    className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-ink ${persona.accent} cartoon-shadow`}
                  >
                    <Image
                      src={persona.avatar}
                      alt={persona.name}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-ink bg-white text-sm cartoon-shadow-sm">
                    {persona.emoji}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold">
                  {persona.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-bubble-sky">
                  {persona.tagline}
                </p>

                <div
                  className={`mt-4 rounded-2xl border-2 border-ink ${persona.bubbleColor} px-4 py-3`}
                >
                  <p className="text-sm leading-relaxed">{persona.description}</p>
                </div>

                <span className="cartoon-btn mt-6 w-full bg-bubble-pink py-3 text-sm group-hover:bg-bubble-pink/90">
                  Chat with {persona.name} 💬
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-semibold text-bubble-sky underline-offset-4 hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      </main>
    </CartoonShell>
  );
}
