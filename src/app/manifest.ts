import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CueGenius — Pool League Performance Tracker",
    short_name: "CueGenius",
    description:
      "Track your matches and see the skill level you're really performing at.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0d18",
    theme_color: "#2323ff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
