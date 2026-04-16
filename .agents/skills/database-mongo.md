# Skill: MongoDB Architecture
- **Modularity:** One model per file in the `/models` directory.
- **Typing:** Always export an Interface extending `Document` alongside the Schema.
- **Connections:** Use a singleton pattern for the database connection before any Server Action execution.
