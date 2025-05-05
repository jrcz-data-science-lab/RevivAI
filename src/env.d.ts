interface ImportMetaEnv {
	readonly PUBLIC_OLLAMA_API_URL: string;
	readonly PUBLIC_OLLAMA_API_MODEL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
