// Global constants injected by Vite.define
declare const __API_URL__: string;
declare const __LOGIN_PATH__: string;
// Add global window interface extensions
interface Window {
  _env_?: {
    CARGOVIZ_API_URL?: string;
    CARGOVIZ_WS_URL?: string;
  };
}