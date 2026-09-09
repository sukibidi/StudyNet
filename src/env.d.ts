/// <reference types="vite/client" />

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
    readonly GEMINI_API_KEY: string;
    readonly APP_URL: string;
    readonly DEV: boolean;
    readonly MODE: string;
    [key: string]: any;
  }
}
