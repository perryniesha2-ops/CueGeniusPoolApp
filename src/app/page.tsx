import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import StatTicker from "./StatTicker";
import SiteHeader from "./SiteHeader";
import BreakHero from "./BreakHero";

import Footer from "./Footer";

import MarqueeBand from "./MarqueeBand";
import { LoadoutGrid, Readout, FinalCta, SiteFooter } from "./Sections";

export const metadata: Metadata = {
  title: "CueGenius — Track your pool game like it hits back",
  description:
    "CueGenius logs every inning, break, and run-out, then turns it into a live performance readout. PPI scoring, trend analysis, and league standings for 9-ball players.",
  openGraph: {
    title: "CueGenius — Smash the rack. Track the damage.",
    description:
      "Pool performance tracking with PPI scoring, inning-by-inning logging, and 12-week trend curves.",
    url: "https://www.cuegenius.synthqa.app",
    siteName: "CueGenius",
    type: "website",
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/dashboard");

  return (
    <main className="scanlines relative min-h-screen overflow-x-hidden bg-cue-void font-sans text-cue-bone selection:bg-cue-magenta selection:text-cue-void">
      <StatTicker />
      <SiteHeader />
      <div className="relative z-[2] flex min-h-screen w-full flex-col justify-end px-4 pb-16 pt-28 md:px-8">
        <BreakHero />
        <MarqueeBand />
      </div>
    </main>
  );
}
