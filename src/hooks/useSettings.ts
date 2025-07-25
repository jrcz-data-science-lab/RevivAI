import type { LanguageName } from '@/lib/languages';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Settings {
	parallelization: number;
	temperature: number;
	language: LanguageName;
}

const settingsAtom = atomWithStorage<Settings>('settings', {
	parallelization: 1,
	temperature: 0.5,
	language: 'en',
});

export function useSettings() {
	const [settings, setSettings] = useAtom(settingsAtom);

	/**
	 * Set language for the LLM
	 * @param language - Language to set
	 */
	const setLanguage = (language: LanguageName) => {
		setSettings((prev) => ({
			...prev,
			language,
		}));
	};

	/**
	 * Set parallelization for the LLM
	 * @param parallelization - Parallelization to set
	 */
	const setParallelization = (parallelization: number) => {
		setSettings((prev) => ({
			...prev,
			parallelization: Math.max(1, parallelization),
		}));
	};

	/**
	 * Set temperature for the LLM
	 * @param temperature - Temperature to set. (from 0 to 2)
	 *
	 */
	const setTemperature = (temperature: number) => {
		setSettings((prev) => ({
			...prev,
			temperature: Math.max(0, Math.min(2, temperature)),
		}));
	};

	return {
		settings,
		setLanguage,
		setTemperature,
		setParallelization,
	};
}
