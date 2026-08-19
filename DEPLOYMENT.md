# Live Deployment

The reference **Prize2Pride Generator Studio** is deployed at:

<https://prize2pride-hrjybwm8.manus.space/generator>

The page is public for orientation, prompt preflight, and example discovery. Actual blueprint generation requires an authenticated creator session because it invokes a server-side Manus model, writes a private creator-owned package, and can incur model usage. The browser never receives the model credential.

## Live behavior

| Capability | Deployment behavior |
| --- | --- |
| Short natural-language brief | Evaluated for language pair, learner group, goal, learning experience, and privacy/access context |
| Structured blueprint | Generated server-side with strict JSON validation and a reviewable full-stack package |
| Generated package | Stored in the authenticated creator’s private library |
| Publication | Never automatic; review and separate implementation decisions remain required |
| Public repository | Documents and tests the deterministic local prompt-to-starter contract; it contains no credentials |

The deployed app uses the supported `gpt-5` server-side model for structured generation. This is a practical, governed creator workflow, not a claim that generated applications are production-ready without review.
