---
title: "AionUi: The Future of Multi-AI Agent Desktop Collaboration"
date: "2026-01-21"
tags: ["TypeScript", "AI", "Open Source", "Productivity", "Electron"]
author: "The ByteLand Team"
slug: "aionui-multi-agent-desktop"
---

2. **Repository:** [AionUi GitHub Repository](https://github.com/iOfficeAI/AionUi)

3. **Introduction**

In the rapidly evolving landscape of AI tools, developers and power users often find themselves juggling multiple command-line interfaces (CLIs) and web platforms. Keeping track of context across different sessions, managing local files, and switching between models like Gemini, Claude, and OpenAI can be cumbersome.

Enter **AionUi**, a trending open-source project that is redefining how we interact with local and remote AI agents. Built with TypeScript and Electron, AionUi serves as a "Cowork" interface for your CLI tools, offering a unified, graphical, and local-first experience. It seamlessly integrates with Gemini CLI, Claude Code, Codex, and more, providing a robust environment for office automation, coding assistance, and file management.

4. **The Innovation**

AionUi's core innovation lies in its ability to bridge the gap between raw CLI power and user-friendly GUI convenience. Unlike standard web interfaces, AionUi operates locally, ensuring data security and allowing direct manipulation of the local file system.

Key innovative features include:

- **Multi-Agent Orchestration**: Run multiple agents (e.g., Gemini CLI, Claude Code) simultaneously in parallel sessions.
- **Local-First Architecture**: All conversation history and context are stored locally in SQLite, ensuring privacy.
- **Smart File Management**: AionUi isn't just a chat interface; it can batch rename, organize, and process local files directly.

<div className="my-8 flex justify-center">
  <div className="w-full max-w-3xl dark:bg-gray-800 bg-white p-4 rounded-lg shadow-md overflow-hidden">
    <div className="mermaid">
    graph TD
      subgraph User_Input
        U[User] -->|Commands/Prompts| A[AionUi Desktop App]
      end

      subgraph Orchestration_Layer
        A -->|Route Request| R[Router]
        R -->|Agent 1| G[Gemini CLI]
        R -->|Agent 2| C[Claude Code]
        R -->|Agent 3| L[Local Ollama]
      end

      subgraph File_System_Interaction
        A -->|Read/Write| FS[Local File System]
        G -.->|Action| FS
        C -.->|Action| FS
      end

      subgraph Output
        G -->|Response| UI[Unified Interface]
        C -->|Response| UI
        L -->|Response| UI
        UI -->|Display| U
      end

      style U fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style A fill:#2ECC71,stroke:#27AE60,stroke-width:2px,color:#fff
      style R fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
      style G fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style C fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style L fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style FS fill:#2ECC71,stroke:#27AE60,stroke-width:2px,color:#fff
      style UI fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
    </div>

  </div>
</div>

5. **Architecture Deep Dive**

AionUi is a modern desktop application leveraging the power of **Electron** for cross-platform compatibility (macOS, Windows, Linux) and **TypeScript** for type-safe, maintainable code.

The architecture consists of:

- **Main Process**: Handles window management, native system interactions (file system, shell execution), and the SQLite database connection using `better-sqlite3`.
- **Renderer Process**: Built with React (and likely a UI framework like Arco Design or UnoCSS based on config), this layer handles the user interface, chat rendering, and state management.
- **IPC Layer**: Facilitates secure communication between the Renderer and Main processes.
- **AI Service Integration**: A modular service layer that connects to various AI providers (Google GenAI, OpenAI, Anthropic, Ollama) via SDKs or CLI wrappers.

<div className="my-8 flex justify-center">
  <div className="w-full max-w-3xl dark:bg-gray-800 bg-white p-4 rounded-lg shadow-md overflow-hidden">
    <div className="mermaid">
    graph TB
      subgraph Electron_App
        subgraph Main_Process
          M[Main Entry Point]
          DB[(SQLite Database)]
          Native[Native APIs]
          Shell[Shell Executor]
          M --> DB
          M --> Native
          M --> Shell
        end

        subgraph Renderer_Process
          React[React UI]
          State[State Management]
          Preview[File Previewer]
          React --> State
          React --> Preview
        end

        subgraph IPC_Bridge
          React <-->|IPC Messages| M
        end
      end

      subgraph External_Services
        Shell -->|Exec| CLI[CLI Tools e.g., Gemini]
        M -->|HTTP| API[Cloud APIs e.g., OpenAI]
      end

      style M fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style DB fill:#2ECC71,stroke:#27AE60,stroke-width:2px,color:#fff
      style React fill:#E74C3C,stroke:#C0392B,stroke-width:2px,color:#fff
      style CLI fill:#4A90E2,stroke:#2C3E50,stroke-width:2px,color:#fff
      style API fill:#2ECC71,stroke:#27AE60,stroke-width:2px,color:#fff
      style IPC_Bridge fill:#95A5A6,stroke:#7F8C8D,stroke-width:2px,stroke-dasharray: 5 5,color:#fff
    </div>

  </div>
</div>

6. **Code in Action**

AionUi handles the complexity of executing CLI commands and managing their output. While the exact internal code is complex, the project structure reveals how it manages build processes and native dependencies.

Here is an example of how the application configuration is defined in `electron-builder.yml`. This file is crucial for packaging the application with necessary native modules like `better-sqlite3` and `web-tree-sitter`.

```yaml
# electron-builder.yml configuration snippet
appId: com.aionui.app
productName: AionUi
directories:
  output: out
  buildResources: resources

files:
  - .webpack/main/**/*
  - .webpack/renderer/**/*
  - public/**/*
  - skills/**/*
  - package.json
  # Native modules need careful inclusion
  - node_modules/better-sqlite3/**/*
  - node_modules/node-pty/**/*
  # Exclude unnecessary files to keep build size down
  - "!**/node_modules/*/{test,tests,example}"

asarUnpack:
  # Unpack native modules that might have issues with ASAR
  - "**/node_modules/better-sqlite3/**/*"
  - "**/node_modules/node-pty/**/*"
  - "**/node_modules/web-tree-sitter/**/*"
```

In the codebase, the main process likely sets up IPC handlers to receive commands from the frontend and execute them via `node-pty` or `child_process`.

```typescript
// Conceptual example of an IPC handler in the Main process
import { ipcMain } from "electron";
import { spawn } from "child_process";

ipcMain.handle("execute-agent-command", async (event, command, args) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
      // Stream output back to renderer if needed
      event.sender.send("agent-output-stream", data.toString());
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
});
```

7. **Potential Applications**

AionUi is not just for developers; it empowers a wide range of use cases:

- **Automated Reporting**: Use an AI agent to read Excel files, analyze data, and generate a summary report in Markdown or PDF.
- **Code Refactoring**: Point an agent to a local directory and ask it to refactor code or add comments across multiple files.
- **Content Creation**: Manage blog posts (like this one!) by having an agent draft content, organize image assets, and format the final output.
- **Secure Enterprise Work**: Since data is stored locally, companies with strict data privacy policies can leverage local LLMs (via Ollama) within AionUi without leaking sensitive data to the cloud.

8. **Conclusion**

AionUi represents a significant step forward in the democratisation of AI agents on the desktop. By combining the flexibility of TypeScript, the power of Electron, and the intelligence of modern LLMs, it offers a versatile workspace that adapts to your needs. Whether you are a developer looking to streamline your CLI workflow or a power user managing complex file systems, AionUi is a project worth exploring and starring on GitHub.

_Note: This post explores the features and architecture of AionUi based on its public repository and documentation._
