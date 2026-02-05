# Nebula AI Coding Platform Architecture  
  
## Overview  
Nebula AI Coding Platform organizes AI coding assistance across three lanes to maximize productivity and flexibility.  
  
### Lane A — GitHub Native  
- Primary tools: GitHub Copilot integrated in VS Code/JetBrains IDEs.  
- Use cases: day-to-day development, PR assistance, test generation.  
- Control plane: Orion policy gateway for model routing and logging.  
  
### Lane B — Agentic Workflows  
- Primary tools: Continue agents (IDE/CLI/headless) orchestrated by Orion V1.  
- Use cases: large refactors, multi-file edits, autonomous PR updates.  
- Requires approval gates for write operations and merges.  
  
### Lane C — Power (Helix IDE)  
- Primary tools: Helix IDE with Orion-backed completions and actions.  
- Use cases: terminal-native power users who require low-latency completions.  
- Implementation: AI overlays optional; core LSP remains fully functional.  
  
## Model Routing Policy (Orion V1)  
Orion routes requests based on four task classes:  
1. **INLINE_COMPLETION** – Fast, low-latency completions with small models.  
2. **CHAT_EDIT** – Balanced models for code chat, explanations and small edits.  
3. **AGENTIC_REFACTOR** – Deep models for refactors, test generation and migrations.  
4. **SECURITY_SENSITIVE** – Approved models only with redaction and full auditing.  
  
## Helix IDE Integration  
Helix IDE provides a power lane via your repository `helix-ide`:  
- A `languages.toml` can configure Helix to call the Orion API for completions and actions.  
- Example configuration for TypeScript, Python and Go:  
  
```toml  
[language-server.orion]  
command = "nebula-ide"  
args = [  
  "--handler", "openai",  
  "--apiBase", "https://api.nebula.internal/v1",  
  "--model", "orion-v1",  
  "--routeProfile", "INLINE_COMPLETION"  
]  
  
[language-server.ts]  
command = "typescript-language-server"  
args = ["--stdio"]  
  
[[language]]  
name = "typescript"  
language-servers = ["ts", "orion"]  
  
[[language]]  
name = "python"  
language-servers = ["pyright", "orion"]  
  
[[language]]  
name = "go"  
language-servers = ["gopls", "orion"]  
```  
  
## Repository Layout  
```
nebula-platform/  
  orion-router/  
  orion-policy/  
  orion-agents/  
  orion-telemetry/  
  helix-ide/  
  nebula-docs/  
```  
  
## Migration Checklist  
- Days 1‑3: Create repos and publish naming specification.  
- Days 4‑7: Enable GitHub-native lane on pilot repositories.  
- Days 8‑12: Deploy agentic workflows via Continue and Orion.  
- Days 13‑18: Configure Helix IDE integration and smoke test.  
- Days 19‑24: Scale to half the engineering team.  
- Days 25‑30: General availability for GitHub Native and Agentic lanes; Helix remains supported as a power lane.
