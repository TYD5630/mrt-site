---
title: "Kanban 看板系统"
description: "Kanban 看板系统"
pubDate: 2026-05-05
tags: ["kanban", "task-management", "workflow", "agent-coordination"]
---

# Kanban 看板系统

多 Agent 任务协调系统。基于 SQLite 的任务状态机，支持 Worker-Orchestrator 模式。

## 核心概念
- **状态机**：triage → todo → ready → running → done → archived
  - blocked → ready（解阻塞后回退）
- **Claim 机制**：agent 认领任务后获得 TTL（默认 15 分钟），需心跳续约
- **依赖图**：父/子任务关系，父完成自动触发子任务晋升

## 工具集
| 工具 | 用途 |
|:-----|:------|
| `kanban_claim` | 认领任务 → running |
| `kanban_heartbeat` | 续约 TTL（每 10 分钟） |
| `kanban_done` | 完成任务 → done |
| `kanban_block/comment/release/move/list` | 管理任务 |

## 相关页面
- [brain-architecture](/docs/brain-architecture)
- [hermes-agent](/docs/hermes-agent)
- [ai-agent-courses](/docs/ai-agent-courses)

