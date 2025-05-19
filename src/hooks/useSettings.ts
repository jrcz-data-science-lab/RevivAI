import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Language = 'en' | 'nl' | 'lv' | 'ru' | 'la';

interface SettingsProps {
	parallelization: number;
	language: Language;
}

const settingsAtom = atomWithStorage<SettingsProps>('settings', {
	parallelization: 1,
	language: 'en',
});

export function useSettings() {
	const [settings, setSettings] = useAtom(settingsAtom);

	/**
	 * Set language for the LLM
	 * @param language - Language to set
	 */
	const setLanguage = (language: Language) => {
		setSettings((prev) => ({
			...prev,
			language,
		}));
	};

	/**
	 * Get the language prompt for the LLM
	 * @returns Language prompt
	 */
	const getLanguagePrompt = () => {
		if (settings.language === 'nl') return 'SCHRIJF EN ANTWOORD ALLEEN IN HET NEDERLANDS!';
		if (settings.language === 'lv') return 'RAKIET UN ATBILDĒJIET TIKAI LATVIEŠU VALODĀ!';
		if (settings.language === 'ru') return 'ПИШИТ И ОТВЕЧАЙТ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!';
		if (settings.language === 'la') return 'SCRIBE ET RESPONDE IN LINGUA LATINA SOLUM!';
		return 'WRITE AND RESPOND IN ENGLISH LANGUAGE ONLY!';
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
	}

	return {
		settings,
		setLanguage,
		setParallelization,
		getLanguagePrompt,
	};
}
