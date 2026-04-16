---
trigger: always_on
---

# QA & CI/CD Rules

Strict adherence to quality assurance and continuous integration workflows is mandatory to ensure the reliability of TaskFlow AI.

## 1. Automated Testing (QA)
- **UNIT TESTING**: Every new logic component (Server Actions, Lib functions) must have a corresponding unit test. Propose tests using `Vitest` for Web.
- **TYPE SAFETY**: Use TypeScript strictly. Avoid `any` unless absolutely necessary for external integrations. Run `npm run type-check` before any PR.
- **COMPONENT ISOLATION**: Test UI components in isolation to ensure reusability and prevent visual regressions.

## 2. CI/CD Workflow
- **PRE-COMMIT CHECKS**: Developers must run linting and type-checking locally before pushing code.
- **CONTINUOUS INTEGRATION**: All Pull Requests must trigger a CI pipeline that:
  - Installs dependencies.
  - Runs linting.
  - Runs the full test suite.
  - Performs a production build to check for compilation errors.
- **DEPLOYMENT**: Automatic deployment to staging environments is required for every merge to the `main` branch.

## 3. Code Quality
- **ZERO LINT ERRORS**: No code will be merged if it contains linting warnings or errors.
- **SPEC-FIRST REWIEW**: Before implementing large features, technical specifications (Spec) must be peer-reviewed and approved.

## 4. Environment Management
- **SECRET HANDLING**: Never commit sensitive environment variables (e.g., API keys, DB strings). Use `.env.example` as a template.
- **DEPENDENCY AUDIT**: Regularly run `npm audit` to check for security vulnerabilities.
