import test from "node:test";
import assert from "node:assert/strict";
import { createApplicationPackage, createBlueprint, parseShortPrompt, validateBrief } from "./generate-blueprint.mjs";

test("creates a public language-learning blueprint with local-only learner state", () => {
  const blueprint = createBlueprint({ productName: "Japanese for Tunisians", sourceLanguage: "Japanese", learnerLanguage: "Tunisian Arabic", learnerGroup: "Tunisian beginners", learningGoal: "Everyday and academic communication" });
  assert.equal(blueprint.product.languagePair, "Japanese → Tunisian Arabic");
  assert.ok(blueprint.localOnlyState.includes("practice drafts"));
  assert.ok(blueprint.qualityGates.includes("no automatic publishing"));
});

test("rejects incomplete briefs", () => {
  assert.throws(() => validateBrief({ productName: "Incomplete" }), /Missing required brief fields/);
});

test("parses a short multilingual prompt into a structured brief", () => {
  const brief = parseShortPrompt("Japanese for Tunisians — A0–B2 dialogue-first study and travel learning");
  assert.equal(brief.sourceLanguage, "Japanese");
  assert.equal(brief.learnerLanguage, "Tunisian Arabic");
  assert.match(brief.learnerGroup, /A0–B2/);
});

test("creates a bounded application package from a short prompt", () => {
  const app = createApplicationPackage(parseShortPrompt("Chinese for Spanish speakers — professional conversation"));
  assert.equal(app.routes.length, 5);
  assert.ok(app.codeSeed.some((file) => file.path === "src/pages/Lesson.tsx"));
  assert.match(app.boundary, /does not deploy/);
});
