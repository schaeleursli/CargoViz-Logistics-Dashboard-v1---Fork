/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CARGOVIZ_API_URL: string;
  readonly VITE_CARGOVIZ_WS_URL: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}