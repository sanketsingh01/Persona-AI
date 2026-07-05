"use client";

import PersonaSelection from "@/components/personaSelection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <PersonaSelection />
    </ProtectedRoute>
  );
}
