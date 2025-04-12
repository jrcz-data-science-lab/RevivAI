import type { LLMProviderData } from '@/hooks/useLLMProvider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SetupFormProps {
	providerData: LLMProviderData;
	onChange: (provider: LLMProviderData) => void;
}

export function SetupForm({ providerData, onChange }: SetupFormProps) {

    /**
     * Send update event with updated provider data
     * @param field The field to update
     * @param value The value to set
     */
    const updateField = (field: Exclude<keyof LLMProviderData, 'provider'>, value: string) => {
        const updatedProvider = {
            ...providerData,
            [field]: value,
        };

        onChange(updatedProvider);
    };

	return (
		<div>
			<div>
				<Label>API URL</Label>
				<Input placeholder="https://api.openai.com/v1" className="mt-2" value={providerData.baseUrl} onChange={(e) => updateField('baseUrl', e.target.value)} />
			</div>

			<div>
				<Label>Model</Label>
				<Input placeholder="gpt-4o" className="mt-2" value={providerData.model} onChange={(e) => updateField('model', e.target.value)} />
			</div>

			<div>
				<Label className="mt-4">API Key</Label>
				<Input placeholder="sk-..." className="mt-2" value={providerData.apiKey} onChange={(e) => updateField('apiKey', e.target.value)} />
			</div>
		</div>
	);
}
