---
title: "andrej-karpathy-skills"
description: "andrej-karpathy-skills"
sidebar:
  order: 50
  label: "andrej-karpathy-skills"
tags: ["plugin", "claude-code", "cursor", "skill", "coding-guidelines"]
---

# andrej-karpathy-skills

forrestchang 开发的 Claude Code 插件 / Cursor 规则集。将 Andrej Karpathy 的编码观察提炼为 4 条行为准则，改善 LLM 编码 Agent 的质量。

- GitHub：https://github.com/forrestchang/andrej-karpathy-skills
- 插件市场：可通过 Claude Code 插件市场安装

## 文件结构

| 文件 | 用途 |
|:-----|:-----|
| `CLAUDE.md` | Claude Code 项目级行为准则 |
| `CURSOR.md` | Cursor 使用说明 |
| `.cursor/rules/karpathy-guidelines.mdc` | Cursor 项目规则（alwaysApply） |
| `.claude-plugin/plugin.json` | Claude Code 插件定义 |
| `.claude-plugin/marketplace.json` | 插件市场元数据 |
| `skills/karpathy-guidelines/SKILL.md` | 可复用的 Agent Skill |
| `EXAMPLES.md` | 使用示例和对比 |

## 安装方式

### Claude Code
通过插件市场安装，或复制 `CLAUDE.md` 到项目根目录。

### Cursor
提交的 `.cursor/rules/` 已自动生效（alwaysApply: true）。也可复制规则文件到其他项目。

### 其他编辑器
复制 `CLAUDE.md` 或合并到项目指令文件中。

## 相关页面
- [karpathy-coding-guidelines](/docs/karpathy-coding-guidelines) — 四大原则详解（核心概念）
- [nn-zero-to-hero](/docs/nn-zero-to-hero)
- [hermes-agent](/docs/hermes-agent)

