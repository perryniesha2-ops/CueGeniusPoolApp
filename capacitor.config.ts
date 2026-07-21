import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.synthqa.cuegenius",
  appName: "CueGenius",
  webDir: "public",
  server: {
    url: "https://www.cuegenius.synthqatech.com",
    cleartext: false,
  },
};

export default config;
