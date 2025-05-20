export type lang = 'en' | 'nl' | 'lv' | 'ru' | 'la';

/**
 * Get the language prompt for the LLM
 * @returns Language prompt
 */
export function getLanguagePrompt(lang: lang) {
	if (lang === 'nl') return 'SCHRIJF EN ANTWOORD ALLEEN IN HET NEDERLANDS!';
	if (lang === 'lv') return 'RAKIET UN ATBILDĒJIET TIKAI LATVIEŠU VALODĀ!';
	if (lang === 'ru') return 'ПИШИТ И ОТВЕЧАЙТ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!';
	if (lang === 'la') return 'SCRIBE ET RESPONDE IN LINGUA LATINA SOLUM!';
	return 'WRITE AND RESPOND IN ENGLISH LANGUAGE ONLY!';
}
