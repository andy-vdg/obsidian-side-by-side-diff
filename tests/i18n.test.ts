import { describe, test } from "node:test";
import assert from "node:assert/strict";
import de from "../locales/de.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import fr from "../locales/fr.json" with { type: "json" };
import it from "../locales/it.json" with { type: "json" };
import es from "../locales/es.json" with { type: "json" };
import ptBR from "../locales/pt-BR.json" with { type: "json" };
import ptPT from "../locales/pt-PT.json" with { type: "json" };
import nl from "../locales/nl.json" with { type: "json" };
import { createTranslator, resolveLanguage } from "../src/i18n.ts";

describe("UI translations", () => {
	test("all locale dictionaries contain the same keys", () => {
		const keys = Object.keys(en).sort();
		assert.deepEqual(Object.keys(de).sort(), keys);
		assert.deepEqual(Object.keys(fr).sort(), keys);
		assert.deepEqual(Object.keys(it).sort(), keys);
		assert.deepEqual(Object.keys(es).sort(), keys);
		assert.deepEqual(Object.keys(ptBR).sort(), keys);
		assert.deepEqual(Object.keys(ptPT).sort(), keys);
		assert.deepEqual(Object.keys(nl).sort(), keys);
	});

	test("translates labels and replaces variables", () => {
		assert.equal(createTranslator("de")("settings.language.name"), "Sprache");
		assert.equal(createTranslator("en")("settings.language.name"), "Language");
		assert.equal(createTranslator("fr")("settings.language.name"), "Langue");
		assert.equal(createTranslator("it")("settings.language.name"), "Lingua");
		assert.equal(createTranslator("es")("settings.language.name"), "Idioma");
		assert.equal(createTranslator("pt-BR")("settings.language.name"), "Idioma");
		assert.equal(createTranslator("pt-PT")("settings.language.name"), "Idioma");
		assert.equal(createTranslator("nl")("settings.language.name"), "Taal");
		assert.equal(
			createTranslator("en")("notice.fileTrashed", { name: "Notes.md" }),
			"“Notes.md” was moved to the trash.",
		);
	});

	test("provides localized introduction-step labels", () => {
		assert.equal(createTranslator("de")("modal.introduction.progress", { current: 1, total: 5 }), "Schritt 1 von 5");
		assert.equal(createTranslator("de")("modal.introduction.start.title"), "So startest du");
		assert.equal(createTranslator("de")("modal.introduction.welcome.documentation.title"), "Dokumentation");
		assert.equal(createTranslator("de")("modal.introduction.thanks.title"), "Vielen Dank");
		assert.equal(createTranslator("en")("modal.introduction.finish"), "Get started");
		assert.equal(createTranslator("en")("modal.introduction.startAction"), "How to start");
		assert.equal(createTranslator("en")("modal.introduction.thanks.description"), "This is open source and free because I like it.");
		assert.equal(createTranslator("en")("modal.introduction.thanks.feedbackLink"), "give feedback on GitHub");
		assert.equal(createTranslator("en")("modal.introduction.tips.keyboard.imageAlt"), "Keyboard shortcuts for navigating, accepting, ignoring, undoing, and saving changes");
		assert.equal(createTranslator("en")("modal.introduction.tips.title"), "Tips and tricks");
		assert.equal(createTranslator("en")("settings.introduction.button"), "Show introduction");
		assert.equal(createTranslator("de")("commands.showIntroduction"), "Einführung anzeigen");
	});

	test("distinguishes Obsidian's European and Brazilian Portuguese locale codes", () => {
		assert.equal(resolveLanguage("auto", "pt"), "pt-PT");
		assert.equal(resolveLanguage("auto", "pt-br"), "pt-BR");
	});

	test("accepts only supported explicit languages", () => {
		assert.equal(resolveLanguage("de"), "de");
		assert.equal(resolveLanguage("en"), "en");
		assert.equal(resolveLanguage("fr"), "fr");
		assert.equal(resolveLanguage("it"), "it");
		assert.equal(resolveLanguage("es"), "es");
		assert.equal(resolveLanguage("pt-BR"), "pt-BR");
		assert.equal(resolveLanguage("pt-PT"), "pt-PT");
		assert.equal(resolveLanguage("nl"), "nl");
		assert.equal(resolveLanguage("auto", "fr-CA"), "fr");
		assert.equal(resolveLanguage("auto", "it-IT"), "it");
		assert.equal(resolveLanguage("auto", "es-ES"), "es");
		assert.equal(resolveLanguage("auto", "pt-BR"), "pt-BR");
		assert.equal(resolveLanguage("auto", "pt-PT"), "pt-PT");
		assert.equal(resolveLanguage("auto", "pt-PT-1990"), "pt-PT");
		assert.equal(resolveLanguage("auto", "nl-NL"), "nl");
		assert.equal(resolveLanguage("auto", "zh-CN"), "en");
	});
});
