import { generateObject } from 'ai';
import { toast } from 'sonner';
import { useState } from 'react';
import { testSchema } from '@/lib/schemas';
import { createModel, useModel, type LLMCredentials, type LLMProvider } from './useModel';

/**
 * Get the default credentials for the selected LLM provider
 * @param provider The LLM provider to get the credentials for
 */
function getDefaultCredentials(provider: LLMProvider): LLMCredentials {
	switch (provider) {
		case 'revivai':
			return {
				provider: 'revivai',
				baseUrl: import.meta.env.PUBLIC_LLM_API_URL,
				apiKey: import.meta.env.PUBLIC_LLM_API_KEY,
				model: import.meta.env.PUBLIC_LLM_API_MODEL,
			};

		case 'openrouter':
			return {
				provider: 'openrouter',
				model: 'meta-llama/llama-4-scout',
				baseUrl: 'https://openrouter.ai/api/v1',
				apiKey: '',
			};

		case 'anthropic':
			return {
				provider: 'anthropic',
				model: 'claude-3-5-sonnet-latest',
				baseUrl: 'https://api.anthropic.com/v1',
				apiKey: '',
			};

		case 'openai':
			return {
				provider: 'openai',
				model: 'gpt-4.1',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: '',
			};

		case 'google':
			return {
				provider: 'google',
				model: 'gemini-2.0-flash',
				baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
				apiKey: '',
			};

		default:
			return {
				provider: 'custom',
				baseUrl: '',
				model: '',
				apiKey: '',
			};
	}
}

/**
 * Setup the LLM provider
 */
export function useSetup() {
	const defaultCredentials: LLMCredentials = getDefaultCredentials(
		import.meta.env.PUBLIC_LLM_API_URL ? 'revivai' : 'openai',
	);
	const { credentials, setCredentials } = useModel();

	const [isTesting, setIsTesting] = useState(false);
	const [credentialsForm, setCredentialsForm] = useState<LLMCredentials>(credentials ?? defaultCredentials);

	/**
	 * Change default values on provider change. Saves previous API key.
	 * @param provider The LLM provider to change the default values for
	 */
	const handleProviderChange = (provider: LLMProvider) => {
		setCredentialsForm((prev) => ({ ...getDefaultCredentials(provider), apiKey: prev.apiKey }));
	};

	/**
	 * Validate the LLM provider, try to send a request to the API
	 */
	const validate = async (credentialsForm: LLMCredentials) => {
		setIsTesting(true);

		try {
			const model = createModel(credentialsForm);
			const { object } = await generateObject({
				model: model,
				schema: testSchema,
				prompt: 'Set property "test" to "true". Use structured output.',
			});

			if (object.test !== true) {
				toast.error('Structured output is not supported by the models', { richColors: true });
				return false;
			}

			toast.error('Everything works as expected!');
			setCredentialsForm({ ...credentialsForm });
			setCredentials({ ...credentialsForm });
			return true;
		} catch (error) {
			console.error(error);
			toast.error('LLM is not responding correctly.', { description: `${error}`, richColors: true });
			setCredentialsForm({ ...credentialsForm });
		} finally {
			setIsTesting(false);
		}

		return false;
	};

	/**
	 * Submit the form
	 */
	const submit = async (credentialsForm: LLMCredentials) => {
		if (isTesting) return;

		// Ensure that the provider is tested before proceeding
		const accessible = await validate(credentialsForm);
		if (!accessible) return;

		// Check if URL has redirectToApp query param.
		const urlParams = new URLSearchParams(window.location.search);
		const redirectToProject = urlParams.get('redirectToProject');

		if (redirectToProject) {
			window.location.replace(`/app/${redirectToProject}`);
		} else {
			window.location.replace('/');
		}
	};

	return {
		credentialsForm,
		setCredentialsForm,
		handleProviderChange,
		validate,
		isTesting,
		submit,
	};
}
