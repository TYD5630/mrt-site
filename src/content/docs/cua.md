---
title: "cua（Computer-Use Agents）"
description: "cua（Computer-Use Agents）"
sidebar:
  order: 50
  label: "cua（Computer-Use Agents）"
tags: ["ai", "desktop", "agent", "computer-use", "automation", "sandbox"]
---

# cua（Computer-Use Agents）

开源 Computer-Use Agent 基础设施。提供沙箱环境（虚拟机/容器）、Python SDK、
和基准测试，让 AI Agent 在隔离环境中安全地操作电脑。
⭐ 15.6k · trycua/cua

---

## 概述

cua 是 Computer Use 领域的"基础设施层"。不只是一个 Agent 框架，
而是提供了运行 CUA 所需的环境隔离（通过虚拟机/容器防止 AI 误操作真机）、
开发 SDK 和评测基准。

## 核心组件

| 组件 | 说明 |
|:-----|:------|
| Sandbox | 虚拟机/容器隔离环境，AI 操作不影响真机 |
| SDK | Python SDK，创建和管理 Computer Use Agent |
| Benchmark | 标准评测集，对比不同 CUA 方案 |
| Provider | 支持 Anthropic / OpenAI / 自托管模型 |

## 适用场景

- 安全地测试 AI 桌面操作能力（沙箱隔离）
- 开发自定义 Computer Use Agent
- 对比评测不同模型/框架的桌面操作能力

## 相关

- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化总览
- [bytebot](/docs/bytebot) — 自托管 AI 桌面 Agent
- [Agent-S](/docs/agent-s) — 开源 Agent 框架
- [desktop-control](/docs/desktop-control) — 桌面控制技术

