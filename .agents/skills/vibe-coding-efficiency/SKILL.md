---
name: vibe-coding-efficiency
description: >-
  Use this skill to optimize coding speed, minimize token consumption, apply targeted diffs, and follow high-velocity vibe coding workflows for this project.
---

# Vibe Coding Efficiency Playbook

Rules to maximize development speed and minimize token consumption:

## 1. Minimal Diffs Over Full File Rewrites
- **Never replace whole files** when modifying small logic or JSX. Use targeted chunk replacements.
- Keep components modular (max 150-200 lines). If a component grows too large, extract subcomponents into sibling files.

## 2. No Token-Wasting Conversational Boilerplate
- Respond directly with action and result.
- Avoid repeating the user's prompt or writing long philosophical preambles.
- Put design decisions directly in the code or brief bullet points.

## 3. Fast Validation Workflow
- When code edits are made, verify types quickly:
  `npx tsc --noEmit`
- Verify linting if applicable:
  `npm run lint` or `npm run format:check`

## 4. Reusable Primitives First
- Check existing utilities before writing new ones:
  - Formatter / parser: `src/lib/youtube/`
  - Icons: `lucide-react`
  - Styling merge: `src/lib/utils` (`cn`)
- Prevent code duplication across components.
