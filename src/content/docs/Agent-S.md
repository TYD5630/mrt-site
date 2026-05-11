---
title: "Agent-S"
description: "Agent-S"
sidebar:
  order: 50
  label: "Agent-S"
tags: ["ai", "desktop", "agent", "framework", "open-source"]
---

# Agent-S

开源 Agent 框架，让 AI 像人一样使用电脑。通过截图理解屏幕，
用鼠标键盘操作界面，支持复杂多步骤任务。
⭐ 11k · simular-ai/Agent-S

---

## 概述

Agent-S 是一个开源的"电脑操作 Agent"。核心思路是让 AI 像人一样
"看屏幕→理解→操作"的循环，而不是依赖 API 或 DOM 接口。

## 技术特点

| 特点 | 说明 |
|:-----|:------|
| 视觉驱动 | 截屏理解，不依赖平台 API |
| 多步骤 | 支持复杂任务分解与执行 |
| 错误恢复 | 操作失败自动重试/纠错 |
| 跨平台 | Windows / macOS / Linux |
| 可扩展 | 插件化工具和动作 |

## 与 CoPaw 的关系

Agent-S 和 CoPaw 的定位不同：
- CoPaw 是 **对话式 Agent 平台**（聊天/工具/MCP）
- Agent-S 是 **桌面操作 Agent**（视觉/鼠标/键盘）

两者可以互补：CoPaw 调用 Agent-S 执行桌面任务。

## 相关

- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化总览
- [cua](/docs/cua) — CUA 基础设施
- [bytebot](/docs/bytebot) — 自托管桌面 Agent

