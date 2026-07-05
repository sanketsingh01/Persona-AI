"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, Zap } from "lucide-react";

import { FloatingBlobs, StarBurst, WavyDivider } from "@/components/cartoon/CartoonDecor";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Vibrant Personas",
    description:
      "Pick from colorful AI mentors — each with their own personality, expertise, and teaching style.",
    color: "bg-bubble-pink",
  },
  {
    icon: MessageCircle,
    title: "Chat & Learn",
    description:
      "Ask anything about coding, GenAI, or building projects. Get answers in a fun, friendly way.",
    color: "bg-bubble-sky",
  },
  {
    icon: Zap,
    title: "Instant Replies",
    description:
      "No boring waits. Jump into conversations and get lightning-fast, helpful responses.",
    color: "bg-bubble-mint",
  },
];

const PERSONA_PREVIEWS = [
  {
    name: "Hitesh",
    role: "Full-Stack Educator",
    avatar: "https://github.com/hiteshchoudhary.png",
    accent: "bg-bubble-yellow",
    rotate: "-rotate-2",
    quote: "\u201CHey! Let's build something cool!\u201D",
  },
  {
    name: "Piyush",
    role: "GenAI Builder",
    avatar: "https://github.com/piyushgarg-dev.png",
    accent: "bg-bubble-lavender",
    rotate: "rotate-2",
    quote: "\u201CLet's ship your next big idea!\u201D",
  },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <div className="dot-bg relative min-h-screen overflow-x-hidden">
      <FloatingBlobs />

      {/* Nav */}
      <nav className="relative z-20 border-b-[3px] border-ink bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-ink bg-bubble-pink text-xl font-bold text-ink cartoon-shadow-sm transition-transform group-hover:-rotate-6">
              P
            </span>
            <span className="font-heading text-2xl font-bold">
              Persona<span className="text-bubble-sky">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <span className="text-sm text-muted-foreground">...</span>
            ) : isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium sm:inline">
                  Hey, {user?.name?.split(" ")[0]}! 👋
                </span>
                <Link
                  href="/dashboard"
                  className="cartoon-btn bg-bubble-mint px-5 py-2.5 text-sm"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-2xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted sm:inline-block"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="cartoon-btn bg-bubble-pink px-5 py-2.5 text-sm"
                >
                  Get Started ✨
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-bubble-yellow px-4 py-1.5 text-sm font-bold cartoon-shadow-sm">
            <StarBurst className="h-4 w-4" />
            Your AI mentors, reimagined
            <StarBurst className="h-4 w-4" />
          </div>

          <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            Chat with{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-bubble-pink">OG</span>
              <span className="absolute -bottom-1 left-0 h-4 w-full bg-bubble-yellow/60 -rotate-1" />
            </span>{" "}
            AI personas
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Learn coding, GenAI, and full-stack development from vibrant AI
            mentors who make every conversation feel like a fun doodle session.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="cartoon-btn wiggle bg-bubble-pink px-8 py-4 text-lg"
            >
              {isAuthenticated ? "Pick a Persona 🎨" : "Start Chatting Free 🚀"}
            </Link>
            <a
              href="#features"
              className="cartoon-btn bg-white px-8 py-4 text-lg"
            >
              See How It Works
            </a>
          </div>

          {/* Hero illustration */}
          <div className="relative mx-auto mt-16 flex max-w-lg items-end justify-center gap-4 sm:max-w-2xl sm:gap-8">
            {PERSONA_PREVIEWS.map((persona) => (
              <div
                key={persona.name}
                className={`cartoon-card wiggle w-40 p-4 sm:w-48 ${persona.rotate}`}
              >
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-ink ${persona.accent} cartoon-shadow-sm sm:h-24 sm:w-24`}
                >
                  <Image
                    src={persona.avatar}
                    alt={persona.name}
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                </div>
                <p className="mt-3 font-heading text-lg font-bold">
                  {persona.name}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {persona.role}
                </p>
                <div className="mt-3 rounded-xl border-2 border-ink bg-muted px-2 py-1.5 text-xs font-semibold">
                  {persona.quote}
                </div>
              </div>
            ))}
            <StarBurst className="absolute -top-4 right-8 h-8 w-8 float sm:right-16" />
            <StarBurst className="absolute bottom-8 -left-2 h-6 w-6 text-bubble-pink float-delayed sm:left-8" />
          </div>
        </div>
      </section>

      <WavyDivider />

      {/* Features */}
      <section id="features" className="relative z-10 bg-card px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold sm:text-5xl">
              Why you'll love it
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Learning should feel like play, not homework.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`cartoon-card p-6 ${i === 1 ? "sm:-translate-y-4" : ""}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-ink ${feature.color} cartoon-shadow-sm`}
                >
                  <feature.icon className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider flip />

      {/* CTA */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="cartoon-card cartoon-shadow-lg overflow-hidden p-8 text-center sm:p-12">
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full border-[3px] border-ink bg-bubble-lavender/50 blob" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full border-[3px] border-ink bg-bubble-mint/40 blob" />

            <h2 className="relative font-heading text-3xl font-bold sm:text-4xl">
              Ready to meet your mentors?
            </h2>
            <p className="relative mt-4 text-lg text-muted-foreground">
              Jump into a conversation with Hitesh or Piyush and start learning
              today. It's free, fun, and fabulously cartoonish.
            </p>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="cartoon-btn relative mt-8 inline-flex bg-bubble-yellow px-10 py-4 text-lg"
            >
              {isAuthenticated ? "Go to Dashboard 🎯" : "Sign Up & Chat 💬"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-[3px] border-ink bg-card px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-heading text-lg font-bold">
            Persona<span className="text-bubble-sky">AI</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💖 for learners everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
