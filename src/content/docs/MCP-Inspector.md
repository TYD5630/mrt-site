---
title: "MCP Inspector"
description: "MCP Inspector"
sidebar:
  order: 50
  label: "MCP Inspector"
tags: ["mcp", "debugging", "testing", "tool", "inspector"]
---

# MCP Inspector

MCP 官方视觉测试工具。连接 MCP Server 并可视化查看所有工具、资源、
交互日志，是开发和调试 MCP Server 的首选工具。
⭐ 9.7k · modelcontextprotocol/inspector

---

## 概述

MCP Inspector 是 MCP 协议的官方调试工具。当 MCP Server 开发完成后，
用它来连接并手动测试每个工具/资源的输入输出是否符合预期。

## 核心能力

| 能力 | 说明 |
|:-----|:------|
| 连接测试 | 连接 stdio/HTTP MCP Server |
| 工具浏览 | 列出所有注册的工具和参数 |
| 交互测试 | 手动调用工具，查看原生响应 |
| 资源浏览 | 查看资源模板和内容 |
| 日志查看 | 实时 MCP 协议通信日志 |
| 错误诊断 | 定位工具执行失败原因 |

## 与 CoPaw 内置 MCP 调试的配合

```bash
# 用 Inspector 测试 MCP Server 本身是否正常
npx @modelcontextprotocol/inspector node brain-mcp-server.js

# 确认工具列表和参数签名正确
# 确认工具能正常返回结果
# 确认没有超时或崩溃
```

在将 MCP Server 配置到 [copaw-notes](/docs/copaw-notes) 的 `config.json` 之前，
先用 Inspector 独立验证 Server 的运行状态。

## 使用场景

- 开发新的 MCP Server 后做集成测试
- MCP 工具突然不工作了，排除 Server 端问题
- 查看 MCP 协议通信细节（底层 JSON-RPC 消息）
- 对比不同 MCP Server 的工具列表

## 相关

- [mcp-debugging](/docs/mcp-debugging) — MCP 调试方法论
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库（MCP 配置部分）
- [copaw-debugging](/docs/copaw-debugging) — CoPaw 调试指南（MCP section）

