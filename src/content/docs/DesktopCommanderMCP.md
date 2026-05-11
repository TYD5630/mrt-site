---
title: "DesktopCommanderMCP"
description: "DesktopCommanderMCP"
sidebar:
  order: 50
  label: "DesktopCommanderMCP"
tags: ["mcp", "desktop", "automation", "claude", "server", "tool"]
---

# DesktopCommanderMCP

MCP Server，让 Claude/Agent 通过 MCP 协议直接控制桌面。
支持终端命令、文件系统读写、进程管理、一键操作。
⭐ 6k · wonderwhy-er/DesktopCommanderMCP

---

## 概述

DesktopCommanderMCP 是桌面控制领域的"MCP 桥接器"。
它将桌面操作能力封装为标准 MCP 工具，Agent 通过 MCP 协议即可
执行命令行、管理文件、控制系统。

## 核心工具

| 工具 | 功能 |
|:-----|:------|
| execute_command | 执行终端命令 |
| read_file / write_file | 文件读写 |
| list_directory | 目录列表 |
| get_system_info | 系统信息 |
| process_management | 进程管理 |

## CoPaw 集成方式

```json
{
  "mcp": {
    "clients": {
      "desktop-commander": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@wonderwhy-er/desktop-commander"],
        "enabled": true
      }
    }
  }
}
```

配置到 CoPaw 的 `config.json` 后，Agent 就能直接调用桌面控制工具。

## 相关

- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化总览
- [mcp-debugging](/docs/mcp-debugging) — MCP 调试方法论
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库（MCP 配置）
- [copaw-debugging](/docs/copaw-debugging) — CoPaw 调试指南

