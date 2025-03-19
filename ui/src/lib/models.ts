// import ol from 'ollama/browser';
import { extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({ baseURL: import.meta.env.PUBLIC_OLLAMA_API_URL });

// Create a type for the model keys
export type LanguageModelKey = keyof typeof languageModels;
export type EmbeddingModelKey = keyof typeof embeddingModels;

// Export the LLMs
export const languageModels = {
	default: {
		name: 'Llama 3.2',
		model: ollama('llama3.2'),
	},
	reasoning: {
		name: 'DeepSeek R1',
		model: wrapLanguageModel({
			model: ollama('deepseek-r1:latest'),
			middleware: extractReasoningMiddleware({ tagName: 'think' }),
		}),
	},
};

// Embedding models
export const embeddingModels = {
	text: {
		name: 'Nomic Embed Text',
		model: ollama.embedding('nomic-embed-text:latest'),
	},
};
