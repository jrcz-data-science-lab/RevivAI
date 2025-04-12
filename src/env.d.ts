interface ImportMetaEnv {
	readonly PUBLIC_OLLAMA_API_URL: string;
	readonly PUBLIC_WEBSITE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
