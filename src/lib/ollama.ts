import ol from 'ollama/browser';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({ baseURL: import.meta.env.PUBLIC_OLLAMA_API_URL });

export const chatModel = ollama('deepseek-r1:latest');

export const embeddingModel = ollama.embedding('nomic-embed-text:latest');