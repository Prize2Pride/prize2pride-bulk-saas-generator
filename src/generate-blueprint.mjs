import fs from "node:fs";

const required = ["productName", "sourceLanguage", "learnerLanguage", "learnerGroup", "learningGoal"];

export function validateBrief(brief) {
  const missing = required.filter((key) => !String(brief?.[key] ?? "").trim());
  if (missing.length) throw new Error(`Missing required brief fields: ${missing.join(", ")}`);
  return brief;
}

export function createBlueprint(input) {
  const brief = validateBrief(input);
  return {
    schemaVersion: "0.1",
    product: {
      name: brief.productName,
      languagePair: `${brief.sourceLanguage} → ${brief.learnerLanguage}`,
      learnerGroup: brief.learnerGroup,
      learningGoal: brief.learningGoal,
    },
    learnerPath: ["orientation", "dialogue-first lessons", "contextual practice", "reading reflection", "local review"],
    publicRoutes: ["/", "/catalog", "/lesson/:id", "/practice", "/reading"],
    localOnlyState: ["completion marks", "practice drafts", "review queues", "voice preferences"],
    protectedCreatorActions: ["save private blueprint", "export implementation dossier"],
    qualityGates: ["bilingual guidance", "keyboard operation", "mobile layout", "no secret in source", "no automatic publishing"],
    releaseBoundary: "Review curriculum accuracy, accessibility, privacy, security, and licensing before implementation or release.",
  };
}

const inputPath = process.argv[2];
if (inputPath) {
  const brief = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  console.log(JSON.stringify(createBlueprint(brief), null, 2));
}
