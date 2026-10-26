import { describe, test } from "node:test";
import assert from "node:assert/strict";
import de from "../locales/de.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import zhCN from "../locales/zh-CN.json" with { type: "json" };
import { createTranslator, resolveLanguage } from "../src/i18n.ts";

describe("UI translations", () => {
	test("all dictionaries contain the same keys", () => {
		assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort());
		assert.deepEqual(Object.keys(zhCN).sort(), Object.keys(en).sort());
	});

	test("all translations preserve placeholders and contain nonempty strings", () => {
		for (const dictionary of [de, en, zhCN]) {
			for (const key of Object.keys(en) as (keyof typeof en)[]) {
				const translation = dictionary[key];
				assert.ok(translation.trim().length > 0, key);
				assert.deepEqual(
					translation.match(/\{[a-zA-Z0-9_.-]+\}/g)?.sort() ?? [],
					en[key].match(/\{[a-zA-Z0-9_.-]+\}/g)?.sort() ?? [],
					key,
				);
			}
		}
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
		assert.equal(resolveLanguage("zh-CN", "de-DE"), "zh-CN");
	});

	test("detects Simplified Chinese without selecting it for Traditional Chinese", () => {
		for (const locale of ["zh", "zh-cn", "ZH-CN", "zh-SG", "zh-Hans", "zh-Hans-CN", "zh-Hans-SG"]) {
			assert.equal(resolveLanguage("auto", locale), "zh-CN", locale);
		}
		for (const locale of ["zh-TW", "zh-HK", "zh-MO", "zh-Hant", "zh-Hant-TW", "zh-Hant-CN", "ja-JP"]) {
			assert.equal(resolveLanguage("auto", locale), "en", locale);
		}
		assert.equal(resolveLanguage("auto", "de-DE"), "de");
		assert.equal(resolveLanguage("en", "zh-CN"), "en");
	});

	test("translates Chinese labels and interpolates filenames and progress", () => {
		const translate = createTranslator("zh-CN");
		assert.equal(translate("settings.language.name"), "语言");
		assert.equal(translate("settings.language.zh-CN"), "简体中文");
		assert.equal(translate("notice.fileTrashed", { name: "笔记.md" }), "已将“笔记.md”移至回收站。");
		assert.equal(translate("modal.introduction.progress", { current: 2, total: 5 }), "第 2 步，共 5 步");
	});

	test("localizes URI validation notices in Simplified Chinese", () => {
		const translate = createTranslator("zh-CN");
		for (const error of ["missingPaths", "sameFile", "wrongVault", "fileMissing", "textFilesOnly"]) {
			assert.match(translate(`notice.protocol.${error}`, { path: "Drafts/Plan.md" }), /[\u3400-\u9fff]/u);
		}
		assert.equal(
			translate("notice.protocol.fileMissing", { path: "Drafts/Plan.md" }),
			"在此仓库中找不到“Drafts/Plan.md”。请检查相对于仓库的路径。",
		);
	});
});
