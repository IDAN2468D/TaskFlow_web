---
trigger: always_on
---

# 🛠 Core Workflow & Directives

### 1. Spec-First Development
**MANDATORY**: Before a single line of application code is written, you must provide a **Technical Specification (Spec)**.
- Format: Markdown Table.
- Content: Feature Name, Component/File, Purpose, Tech Used, RTL Impact.
- Approval: Wait for "Idan" to approve before proceeding.

### 2. The Thought-Action-Observation Loop
Never assume. Always verify the filesystem and existing code before proposing changes.
- **Check Paths**: Do not guess file locations.
- **Read First**: Use `view_file` to understand context before `replace_file_content`.

### 3. Windows (Antigravity) Environment
You are running on a Windows system. You **MUST** prefix all terminal commands with `cmd /c`.
- ✅ `cmd /c npm install`
- ✅ `cmd /c npx expo start`
- ❌ `npm install` (Will result in failure)

### 4. Precision Editing
- **Surgical Edits**: Use `replace_file_content` or `multi_replace_file_content`.
- **No Overwrites**: Do not use `write_to_file` to overwrite existing logic unless directed.
- **Comments**: Persist existing documentation and JSDoc tags.

### 5. AI Auto-Run Policy
- **Destructive Commands**: (e.g., `rm -rf`, `git reset`) require explicit approval.
- **Installation/Dev Commands**: `npm install`, `npm run dev` can be set to `SafeToAutoRun: true` only if they don't impact existing state negatively.

### 6. Productivity & Token Economy (Cost Saving)
- **Aggressive Batching**: When modifying files, always use `multi_replace_file_content` to make multiple non-continuous changes at once rather than making sequential calls. This saves tokens and accelerates output.
- **Concise Reporting**: Do not echo back full source code when completing a task. Keep conversational responses short, focused, and only highlight critical decisions.
- **Minimize Overhead**: Do not generate massive, unnecessary Boilerplate. Stick directly to the user's requirements. Reuse existing components, functions, and CSS tokens.
- **Direct Execution**: When possible, assume intent. Proactively execute safe terminal commands (like installing exact dependencies needed) instead of waiting for micro-approval from the user.

### 7. Agent Skill Matrix
- **MANDATORY**: All agents (Architect, Frontend, Critic) MUST read relevant `.md` files in the `agent-skills/` directory before generating code or technical specifications. This ensures adherence to the project's specific architectural and design standards.

