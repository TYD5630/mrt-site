---
title: "crewAI"
description: "crewAI"
sidebar:
  order: 50
  label: "crewAI"
tags: ["agent", "orchestration", "framework", "multi-agent", "python"]
---

# crewAI

Agent 编排框架。让多个 AI Agent 以" crew "（团队）形式协作完成任务，
支持角色分配、任务委派、工具调用和流程控制。
⭐ 50.6k · crewAIInc/crewAI

---

## 概述

crewAI 是目前最流行的多 Agent 编排框架之一。核心概念：

- **Agent**：有角色（role）、目标（goal）、可用工具
- **Task**：分配给 Agent 的具体任务
- **Crew**：一组 Agent + Task 组成的协作团队
- **Process**：执行流程（顺序执行 / 层级管理）

## 与 CoPaw 多 Agent 对比

| 维度 | crewAI | CoPaw |
|:-----|:-------|:------|
| 架构 | 代码定义 Agent/Task | 配置驱动的 Agent Profiling |
| 通信 | 内部任务委派 | chat_with_agent / submit_to_agent |
| 协调 | Process 流程控制 | Kanban 看板 |
| 工具 | Agent 级工具绑定 | 全局工具注册 |
| 适用 | 代码化 Agent 工作流 | 平台级多 Agent 部署 |

## 典型用法

```python
from crewai import Agent, Task, Crew

# 定义 Agent
researcher = Agent(
    role="研究员",
    goal="发现最新 AI 趋势",
    backstory="资深技术研究员",
    tools=[search_tool, scrape_tool],
)

writer = Agent(
    role="写手",
    goal="把研究结果写成文章",
    backstory="技术写手",
)

# 定义任务
research_task = Task(
    description="研究 2026 年 AI Agent 最新趋势",
    agent=researcher,
)

write_task = Task(
    description="基于研究成果撰写文章",
    agent=writer,
)

# 组建团队并执行
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process="sequential",  # 顺序执行
)

result = crew.kickoff()
```

## 相关

- [hermes-agent](/docs/hermes-agent) — Hermes Agent 架构（含多 Agent 协作）
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库（含多 Agent）
- [kanban-system](/docs/kanban-system) — Kanban 看板系统（多 Agent 任务协调）

