import test from "node:test";
import assert from "node:assert/strict";
import { createBlueprint, validateBrief } from "./generate-blueprint.mjs";

test("creates a public language-learning blueprint with local-only learner state", () => {
  const blueprint = createBlueprint({ productName: "Japanese for Tunisians", sourceLanguage: "Japanese", learnerLanguage: "Tunisian Arabic", learnerGroup: "Tunisian beginners", learningGoal: "Everyday and academic communication" });
  assert.equal(blueprint.product.languagePair, "Japanese → Tunisian Arabic");
  assert.ok(blueprint.localOnlyState.includes("practice drafts"));
  assert.ok(blueprint.qualityGates.includes("no automatic publishing"));
});

test("rejects incomplete briefs", () => {
  assert.throws(() => validateBrief({ productName: "Incomplete" }), /Missing required brief fields/);
});
