import deTranslations from "../locales/de.json" with { type: "json" };
import enTranslations from "../locales/en.json" with { type: "json" };
import frTranslations from "../locales/fr.json" with { type: "json" };
import itTranslations from "../locales/it.json" with { type: "json" };
import esTranslations from "../locales/es.json" with { type: "json" };
import ptBRTranslations from "../locales/pt-BR.json" with { type: "json" };
import ptPTTranslations from "../locales/pt-PT.json" with { type: "json" };
import nlTranslations from "../locales/nl.json" with { type: "json" };
import zhCNTranslations from "../locales/zh-CN.json" with { type: "json" };

export type Language = "de" | "en" | "fr" | "it" | "es" | "pt-BR" | "pt-PT" | "nl" | "zh-CN";
export type LanguagePreference = "auto" | Language;
type TranslationVariables = Record<string, string | number>;
type TranslationTable = Record<string, string>;
export type Translator = (key: string, variables?: TranslationVariables) => string;

const TRANSLATIONS: Record<Language, TranslationTable> = {
	de: deTranslations,
	en: enTranslations,
	fr: frTranslations,
	it: itTranslations,
	es: esTranslations,
	"pt-BR": ptBRTranslations,
	"pt-PT": ptPTTranslations,
	nl: nlTranslations,
	"zh-CN": zhCNTranslations,
};

/** Detects a locale for automatic translation selection. */
function detectSystemLanguage(locale = ""): Language {
	const fallbackLocale = Intl.DateTimeFormat().resolvedOptions().locale || "de";
	const detectedLocale = (locale.length > 0 ? locale : fallbackLocale).toLowerCase();
	if (detectedLocale.startsWith("de")) return "de";
	if (detectedLocale.startsWith("fr")) return "fr";
	if (detectedLocale.startsWith("it")) return "it";
	if (detectedLocale.startsWith("es")) return "es";
	// Obsidian/Moment uses "pt" for European Portuguese and "pt-br" for Brazil.
	if (detectedLocale === "pt" || detectedLocale.startsWith("pt-pt")) return "pt-PT";
	if (detectedLocale.startsWith("pt")) return "pt-BR";
	if (detectedLocale.startsWith("nl")) return "nl";
	// Obsidian uses "zh" and Moment uses "zh-cn"; exclude Traditional Chinese locales.
	if (/^zh(?:$|-(?:cn|sg|hans)(?:-|$))/.test(detectedLocale)) return "zh-CN";
	return "en";
}

/** Resolves a configured language to one of the available translation tables. */
export function resolveLanguage(preference: LanguagePreference, locale = ""): Language {
	return preference !== "auto"
		? preference
		: detectSystemLanguage(locale);
}

/** Creates a translator with a safe English fallback for missing translation keys. */
export function createTranslator(language: Language): Translator {
	const dictionary = TRANSLATIONS[language];
	return (key, variables = {}) => {
		const template = dictionary[key] ?? TRANSLATIONS.en[key] ?? key;
		return template.replace(/\{([a-zA-Z0-9_.-]+)\}/g, (placeholder, variableName: string) => {
			const variableValue = variables[variableName];
			return variableValue === undefined ? placeholder : String(variableValue);
		});
	};
}
