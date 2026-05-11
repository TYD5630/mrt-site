---
title: "LLM Agent 架构（DeepWiki 课程笔记）"
description: "LLM Agent 架构（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "LLM Agent 架构（DeepWiki 课程笔记）"
tags: ["agent", "llm", "framework", "mcp", "a2a", "langgraph", "crewai", "autogen"]
---

# LLM Agent 架构

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/4.5-agents) 的 AI 生成文档，最后索引 2026.02.06。

## 概述

LLM Agent 是能通过推理环境、调用外部工具，自主执行任务的 AI 系统。它扩展了 RAG 的能力边界——不再只是检索+回答，而是能自主决策、多步执行。

## 核心循环：Thought-Action-Observation

```
Thought（思考）→ Action（行动）→ Observation（观察）→ 循环直到完成
```

| 阶段 | 描述 | 示例 |
|:-----|:-----|:------|
| **Thought** | LLM 根据当前上下文推理下一步 | "我需要查一下 AAPL 的最新股价" |
| **Action** | 调用外部工具执行具体操作 | `search_stock_price("AAPL")` |
| **Observation** | 处理返回结果，更新内部状态 | "当前价 $150.23" |

## 架构组件

```
┌─────────────────────────────────────┐
│           LLM Agent                  │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  LLM Core │  │     Memory       │ │
│  │  (推理)   │  │  (对话状态/上下文)│ │
│  └─────┬────┘  └──────────────────┘ │
│        │                            │
│  ┌─────▼────┐  ┌──────────────────┐ │
│  │  Planner  │  │  Tool Registry   │ │
│  │ (任务拆解) │  │  (工具注册表)    │ │
│  └──────────┘  └────────┬─────────┘ │
│                         │           │
│  ┌──────────────────────▼──────────┐│
│  │        Tool Executor            ││
│  │ (函数调用/参数验证/错误处理)     ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Agent 协议

### MCP（Model Context Protocol）

行业标准，连接 Agent 与外部工具/数据源。客户端-服务器架构：

| MCP Server | 能力 |
|:-----------|:-----|
| filesystem | 读写搜索文件 |
| postgres | SQL 查询 |
| github | 仓库/Issue/PR 交互 |
| slack | 消息收发 |

详见 [mcp-debugging](/docs/mcp-debugging)。

### A2A（Agent-to-Agent Protocol）

Google 提出的 Agent 间通信标准，定义：
- **消息 Schema**：标准化的请求/响应格式
- **Agent Discovery**：发现彼此的能力
- **会话管理**：跨 Agent 的上下文传播
- **错误处理**：标准化错误码和重试

## 厂商框架对比

| 框架 | 厂商 | 特点 | 适合 |
|:-----|:-----|:-----|:-----|
| **OpenAI SDK** | OpenAI | Function calling, streaming, 结构化输出 | GPT-4o 场景 |
| **Google ADK** | Google | Vertex AI 集成, Gemini 优化 | Gemini 生态 |
| **Claude Agent SDK** | Anthropic | 长上下文, 工具使用, 宪法 AI | Claude 生态 |

## 开源框架

### LangGraph
- **核心模型**：状态机（图结构 workflow）
- **亮点**：可视化调试、human-in-the-loop、checkpoint 持久化
- **适合**：复杂多步骤 workflow、需要可视化

### LlamaIndex Agents
- **核心模型**：ReActAgent（Thought-Action-Observation）
- **亮点**：与 RAG 生态深度整合，RAG pipeline 可转换成 Agent 工具
- **适合**：RAG-heavy 应用

## 多 Agent 框架

### CrewAI
- **模式**：角色分工（researcher → writer → editor → reviewer）
- **结构**：Crew → Agent Roles → Tasks → Process（顺序/层级）
- **适合**：内容生产流水线

### AutoGen
- **模式**：Agent 间对话驱动协作
- **组件**：AssistantAgent（推理） + UserProxyAgent（执行代码/代表人类）
- **模式**：两人编程、多 Agent 辩论、层级团队
- **适合**：对话式多 Agent 协作

## 框架选型指南

| 需求 | 推荐框架 |
|:-----|:---------|
| 绑定特定厂商 | 厂商 SDK（OpenAI/ADK/Claude） |
| 复杂 workflow + 可视化 | LangGraph |
| RAG 为主 | LlamaIndex Agents |
| 多 Agent 协作 | CrewAI / AutoGen |
| 标准化工具集成 | MCP 兼容框架 |
| 跨厂商通用 | LangGraph / 自定义 MCP |

## 外部资源

- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/)
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/)
- [LlamaIndex Agent 文档](https://docs.llamaindex.ai/en/stable/optimizing/agent/)

## 相关页面

- [hermes-agent](/docs/hermes-agent)（本项目的 Agent 架构）
- [mcp-debugging](/docs/mcp-debugging)
- [copaw-notes](/docs/copaw-notes)

