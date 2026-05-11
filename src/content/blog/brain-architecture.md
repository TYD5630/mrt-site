---
title: "Brain 认知架构"
description: "Brain 认知架构"
pubDate: 2026-05-05
tags: ["hermes", "memory", "architecture", "tool"]
---

# Brain 认知架构

## 概述
19 个 MCP 工具组成的认知系统，分三个阶段建设。

## 双存储架构
- **MEMORY.md** — agent 个人笔记（环境事实、项目约定、工具特性、学到的教训）
- **PROFILE.md** — 用户画像（偏好、沟通风格、期望、工作习惯）

### 冻结快照模式
1. 会话启动时读取两份文件，注入 system prompt
2. 写入立即落盘但不改当前 system prompt → 前缀缓存不失效
3. 下个会话启动时重新读取更新后的文件

## 价值遗忘系统（v1.1.8+）
- **评分公式**：typeWeight×0.35 + recencyScore×0.25 + freqScore×0.2 + priority×0.2
- **类型权重**：decision(5) > conclusion(4) > lesson(3) > task(2) > skill/config(1)
- **默认阈值**：minScore=0.3，超 180 天且低于此分会被清理

## 自动摘要管道（P2-1）
- dialog/（原始对话）→ 分析统计 → 结构化 Markdown → 双路存储（MemoryBackend + memory/YY-MM-DD.md）

## 会话桥与自动缝合（P2-3）
- 桥文件 `memory/.session-bridge.md`（≤2KB），自动生成/自动读取
- 超过 7 天不注入

## 记忆关联图谱（P3-1）
- Jaccard 关键词相似度 × 0.5 + 同类型 + 0.08 + 时序亲近 0~0.05
- 阈值：minSimilarity=0.15，单片段最多 20 条关联

## 跨会话推理（P3-2）
- 5 源并行：QMD 语义搜索 + MemoryBackend + AssociationGraph + SessionStore + 摘要
- 融合权重：语义 1.0 > 关键词 0.8 > 决策 0.75 > 摘要 0.7 > 图谱 0.6

## Personal Tool Memory（v1.1.9）
- 评分公式：成功率 × 0.5 + 标签匹配 × 0.3 + 频率 × 0.1 - 耗时惩罚 × 0.1
- 最低门槛：每种工具至少 2 次记录才推荐

## 相关页面
- [hermes-agent](/docs/hermes-agent)
- [mcp-debugging](/docs/mcp-debugging)
- [kanban-system](/docs/kanban-system)

