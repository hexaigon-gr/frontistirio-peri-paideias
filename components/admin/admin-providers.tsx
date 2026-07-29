"use client";

import { SessionProvider } from "next-auth/react";

import { DialogProvider } from "@/components/dialog-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Everything only the admin panel needs: the auth session, the global dialog
 * store, toasts and tooltips.
 *
 * These sit here rather than in the root `Providers` so the public site never
 * downloads next-auth or the admin interaction stack. If a public page ever
 * genuinely needs one of them, move that single provider up, not all four.
 */
export const AdminProviders = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <TooltipProvider>
      {children}
      <DialogProvider />
      <Toaster />
    </TooltipProvider>
  </SessionProvider>
);
