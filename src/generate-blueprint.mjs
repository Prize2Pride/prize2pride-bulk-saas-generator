import fs from "node:fs";

const required = ["productName", "sourceLanguage", "learnerLanguage", "learnerGroup", "learningGoal"];
const learnerLanguages = [
  ["tunisian", "Tunisian Arabic"],
  ["japanese", "Japanese"],
  ["spanish", "Spanish"],
  ["arabic", "Arabic"],
  ["english", "English"],
];

function languageForLearners(label) {
  const normalized = label.toLowerCase();
  return learnerLanguages.find(([signal]) => normalized.includes(signal))?.[1] ?? label.replace(/learners?|speakers?/gi, "").trim();
}

export function parseShortPrompt(prompt) {
  const cleaned = String(prompt ?? "").replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?)\s+for\s+(.+?)(?:[.:;—-]\s*(.+))?$/i);
  if (!match) throw new Error("Use a short prompt such as: Japanese for Tunisians — A0–B2 dialogue-first learning.");
  const [, sourceLanguage, learnerGroup, goalHint = ""] = match;
  const level = cleaned.match(/\b(A0|A1|A2|B1|B2|C1|C2)\s*[–-]\s*(A1|A2|B1|B2|C1|C2)\b/i)?.[0];
  return {
    productName: `${sourceLanguage.trim()} for ${learnerGroup.trim()}`,
    sourceLanguage: sourceLanguage.trim(),
    learnerLanguage: languageForLearners(learnerGroup),
    learnerGroup: `${learnerGroup.trim()}${level ? ` (${level})` : ""}`,
    learningGoal: goalHint.trim() || `Dialogue-first ${sourceLanguage.trim()} learning for real contexts`,
  };
}

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

export function createApplicationPackage(input) {
  const blueprint = createBlueprint(input);
  return {
    blueprint,
    routes: [
      { path: "/", purpose: "Public orientation and level selection" },
      { path: "/catalog", purpose: "Dialogue-first curriculum catalogue" },
      { path: "/lesson/:id", purpose: "Bilingual lesson, reflection, and speech controls" },
      { path: "/practice", purpose: "Contextual games and local review" },
      { path: "/reading", purpose: "Reading-comprehension challenges" },
    ],
    localLearnerState: ["completionByLesson", "practiceDrafts", "reviewMarks", "voicePreference"],
    protectedCreatorActions: ["savePrivateBlueprint", "exportImplementationDossier"],
    readinessChecks: ["No secret in source", "No automatic publishing", "Keyboard-operable controls", "Mobile-first layout", "Human curriculum review"],
    codeSeed: [
      { path: "src/content/lessons.ts", purpose: "Editable dialogue-first lesson data" },
      { path: "src/lib/localProgress.ts", purpose: "Device-local learner state contract" },
      { path: "src/pages/Lesson.tsx", purpose: "Accessible bilingual lesson shell" },
      { path: "src/pages/Practice.tsx", purpose: "Local contextual practice shell" },
      { path: "README.md", purpose: "Run, review, privacy, and release instructions" },
    ],
    boundary: "This package is a starter specification. It does not deploy, create credentials, create accounts, accept payments, or store learner data.",
  };
}

const args = process.argv.slice(2);
if (args[0] === "--prompt") {
  console.log(JSON.stringify(createApplicationPackage(parseShortPrompt(args.slice(1).join(" "))), null, 2));
} else if (args[0]) {
  const brief = JSON.parse(fs.readFileSync(args[0], "utf8"));
  console.log(JSON.stringify(createApplicationPackage(brief), null, 2));
}
