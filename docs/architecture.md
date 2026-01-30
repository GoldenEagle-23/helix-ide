# Helix Architecture

Helix is composed of several layers:

## Editor Extensions
Helix integrates with existing editors like VS Code and Neovim via extensions. These extensions provide inline agent chat and commands to run the Helix agent from within the editor.

## CLI and Agent Runtime
The `hx` CLI provides a command-line interface for interacting with the Helix agent directly. It powers the agent runtime that coordinates requests, model selection, and MCP interactions.

## Model Fabric
The model fabric abstracts multiple AI models and providers. It handles dynamic routing, context management, and fallback strategies across providers such as Ollama, vLLM, OpenRouter, HuggingFace, and proprietary endpoints.

## MCP Services
Modular Control Plane (MCP) services expose capabilities like filesystem access, GitHub interactions, build/CI monitoring, cloud deployments, and more. They are designed to be hot-swappable and run locally or in the cloud.
