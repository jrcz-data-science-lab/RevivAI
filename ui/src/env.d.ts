/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly PUBLIC_OLLAMA_API: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
