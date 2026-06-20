import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newsflow.ai',
  appName: 'NewsCraft AI',
  webDir: 'out',
  server: {
    // In production the app loads from bundled static assets.
    // Remove the url line below for a fully offline bundle.
    // If you want live reload during dev, uncomment and set your dev machine IP:
    // url: 'http://192.168.x.x:3000',
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#0f172a',
    // Ensure keyboard doesn't push content up awkwardly
    overrideUserAgent: 'NewsCraftAI/1.0 Android',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0f172a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
