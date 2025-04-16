interface ImportMetaEnv {
	readonly PUBLIC_LLM_API_URL: string;
	readonly PUBLIC_LLM_API_KEY: string;
	readonly PUBLIC_LLM_API_MODEL: string;
	readonly PUBLIC_WEBSITE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
