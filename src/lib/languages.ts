export type LanguageName = keyof typeof languages;

export const languages = {
	en: ['English', 'WRITE AND RESPOND IN ENGLISH LANGUAGE ONLY!'],
	nl: ['Dutch', 'SCHRIJF EN ANTWOORD ALLEEN IN HET NEDERLANDS!'],
	fr: ['French', 'ÉCRIVEZ ET RÉPONDEZ UNIQUEMENT EN LANGUE FRANÇAISE!'],
	es: ['Spanish', 'ESCRIBE Y RESPONDE SOLO EN ESPAÑOL!'],
	de: ['German', 'SCHREIBEN UND ANTWORTEN SIE NUR AUF DEUTSCH!'],
	it: ['Italian', 'SCRIVI E RISPONDI SOLO IN ITALIANO!'],
	lv: ['Latvian', 'RAKIET UN ATBILDĒJIET TIKAI LATVIEŠU VALODĀ!'],
	ee: ['Estonian', 'KIRJUTA JA VASTA AINULT EESTI KEELTES!'],
	lt: ['Lithuanian', 'RAŠYKITE IR ATSAKYKITE TIK LIETUVIŲ KALBA!'],
	ue: ['Ukrainian', 'ПИШІТЬ І ВІДПОВІДАЙТЕ ТІЛЬКИ УКРАЇНСЬКОЮ!'],
	ru: ['Russian', 'ПИШИТЕ И ОТВЕЧАЙТЕ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!'],
	ch: ['Chinese', '仅用中文书写和回答！'],
	ja: ['Japanese', '日本語でのみ書き込み、回答してください！'],
	ko: ['Korean', '한국어로만 작성하고 답변하십시오!'],
};

/**
 * Get the language prompt for the LLM
 * @param lang - Language name
 * @returns Language prompt
 */
export function getLanguagePrompt(lang: LanguageName) {
	return languages[lang][1];
}
