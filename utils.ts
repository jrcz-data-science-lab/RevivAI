import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but unused
})

export async function generateEmbeddings(input: string) {
	const { data, usage } = await openai.embeddings.create({ input, model: 'nomic-embed-text:latest' });
	return { embedding: data[0].embedding, tokens: usage.total_tokens };
}

/**
 * Test connection to Ollama instance.
 * @param ollamaURL The URL to test connection to.
 * @returns Whether the connection was successful.
 */
export async function testOllamaConnection(ollamaURL = 'http://localhost:11434/api/version') {
	try {
		const abort = new AbortController();
		setTimeout(() => abort.abort(), 1000);

		const response = await fetch(ollamaURL, { signal: abort.signal });
		if (!response.ok) return false;

		const data = await response.json();
		if (!data || !data.version) return false;

	} catch (_error) {
		return false;
	}

	return true
}