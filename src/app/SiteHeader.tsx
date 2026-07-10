// components/landing/SiteHeader.tsx
import Link from "next/link";

const navLink =
  "border border-cue-bone/25 px-3.5 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-cue-bone transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-cue-cyan hover:bg-cue-cyan hover:text-cue-void hover:shadow-[3px_3px_0_#FF2E88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cue-cyan";

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-[1.65rem] z-[44] flex items-center justify-between bg-gradient-to-b from-cue-void/90 to-transparent px-4 py-4 md:px-8">
      <img
        src="/cuegenius-logo.svg"
        alt="CueGenius"
        style={{ height: 40, width: "auto", display: "block" }}
      />
      <nav aria-label="Primary" className="hidden gap-2.5 md:flex">
        <Link href="/login" className={navLink}>
          Log in
        </Link>
        <Link
          href="/signup"
          className={`${navLink} border-cue-volt bg-cue-volt text-cue-void`}
        >
          Sign up
        </Link>
      </nav>
    </header>
  );
}
