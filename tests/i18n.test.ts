import { describe, test } from "node:test";
import assert from "node:assert/strict";
import de from "../locales/de.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import { createTranslator, resolveLanguage } from "../src/i18n.ts";

describe("UI translations", () => {
	test("German and English dictionaries contain the same keys", () => {
		assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort());
	});

	test("translates labels and replaces variables", () => {
		assert.equal(createTranslator("de")("settings.language.name"), "Sprache");
		assert.equal(createTranslator("en")("settings.language.name"), "Language");
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

	test("accepts only supported explicit languages", () => {
		assert.equal(resolveLanguage("de"), "de");
		assert.equal(resolveLanguage("en"), "en");
	});
});
