// import ol from 'ollama/browser';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({ baseURL: import.meta.env.PUBLIC_OLLAMA_API_URL });

export const reasoningModel = ollama('deepseek-r1:latest');

export const chatModel = ollama('llama3.2');

export const embeddingModel = ollama.embedding('nomic-embed-text:latest');

export const models = {
    reasoning: reasoningModel,
    chat: chatModel,
    embedding: embeddingModel,
}