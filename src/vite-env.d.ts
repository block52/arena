/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_REST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
