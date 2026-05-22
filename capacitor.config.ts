import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newscraft.ai',
  appName: 'NewsCraft AI',
  webDir: 'out',
  server: {
    url: 'https://newscraft-ai.vercel.app',
    cleartext: true
  }
};

export default config;
