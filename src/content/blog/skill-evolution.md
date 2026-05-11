---
title: "Skill Evolution 🧬"
description: "Skill Evolution 🧬"
pubDate: 2026-05-05
tags: ["self-evolution", "skill-management", "meta-skill", "audit"]
---

# Skill Evolution 🧬

自进化技能系统 — 元技能。Agent 在对话中主动创建、修补、进化自己的技能库。

## 核心行为
- **复杂任务完成后** → 自动评估是否固化为技能
- **首次调用技能** → 读 SKILL.md 审查步骤和路径是否准确
- **使用中发现缺陷** → 立刻 patch，不等用户开口
- **用户纠正做法** → 立刻更新相关技能

## 决策树
```
任务完成
  ├─ 大规模/多技能操作（>5个文件）？
  │   └─ 是 → audit 全库审计
  ├─ 纯探索/调试/一次性？ → 跳过
  ├─ 现有技能覆盖？
  │   ├─ 完全覆盖 → 跳过
  │   └─ 部分覆盖 → patch
  ├─ 步骤≥3 且可复现？ → 创建新技能
  └─ 都不是 → 跳过
```

## 审计模式
全库审计：检查 INDEX vs 实际 SKILL.md 计数、DESCRIPTION 格式、AGENTS.md 关键词表完整性

## 相关页面
- [hermes-agent](/docs/hermes-agent)
- [kanban-system](/docs/kanban-system)

