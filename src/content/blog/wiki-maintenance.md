---
title: "知识库维护规范（元知识）"
description: "知识库维护规范（元知识）"
pubDate: 2026-05-05
tags: ["wiki", "maintenance", "knowledge-base", "meta", "workflow", "lesson"]
---

# 知识库维护规范（元知识）

> 这个 wiki 是怎么管自己的。
> 维护知识库本身也是一门学问，这里记录我们实践出来的工作流和守则。

---

## 核心原则

### 1. 审计驱动维护

**不要等人发现错误。** 每次新增/修改页面后运行审计脚本：

```bash
python skills/wiki-audit/wiki-audit.py
# 零问题再收工
```

审计覆盖：frontmatter 完整性、sources 非空、断链、孤立页、index 同步。

### 2. 变更留痕

所有操作必须记入 `log.md`，格式：

```markdown
## [YYYY-MM-DD] action | subject
- 具体做了什么
- index.md 更新至 N 页
```

Actions：`create` / `update` / `ingest` / `audit+fix` / `archive` / `delete`

### 3. 新页面三件套

每新建一个页面，必须同步更新：

- [ ] 页面本身（含 YAML frontmatter + wikilinks）
- [ ] `index.md`（加一行摘要 + 更新总数）
- [ ] `log.md`（追加一条日志）

---

## 页面生命周期

```
想法 → 判断要不要建 → 新建 → 审计 → 维护 → 归档/删除
                        │
                        └→ 或者合并到已有页面
```

### 判断标准（来自 SCHEMA.md）

| 条件 | 动作 |
|:-----|:------|
| 实体/概念出现在 2+ 来源 | ✅ 创建页面 |
| 实体/概念是某来源的核心 | ✅ 创建页面 |
| 只是顺便提了一嘴 | ❌ 不创建 |
| 已有页面能容纳 | ➡ 追加到已有页面 |
| 页面超 ~200 行 | ✂️ 拆分子页 |
| 内容完全被取代 | 🗄 归档到 `_archive/` |

### 页面质量标准

| 检查项 | 通过标准 |
|:-------|:---------|
| YAML frontmatter | title/created/updated/type/tags/sources 全有 |
| Sources 非空 | 至少一个来源引用 |
| Wikilinks | 至少 2 个出站链接 |
| 无断链 | 每个 wikilink 有对应页面 |
| Index 同步 | index.md 已收录 |
| 无孤立 | 至少一个入链 |

---

## 维护节奏

| 频率 | 动作 |
|:-----|:------|
| 每次操作后 | 运行审计脚本确认零问题 |
| 每次会话 | 读取 index.md + log.md 了解当前状态 |
| 每 10 页增长 | 全库重度审计（断链/孤立/index同步） |
| 不定期 | 检查旧页面的 updated 日期，过时的更新 |

---

## 命名规范

- 文件名：`lowercase-hyphens.md`
- 目录：entities/（实体）、concepts/（概念）、comparisons/（对比）、raw/（原始资料）
- 页面标题：首字母大写其余小写（英文），中文正常

### 目录用途

| 目录 | 放什么 | 示例 |
|:-----|:-------|:------|
| `entities/` | 具体项目、工具、人、课程 | hermes-agent, nanoGPT |
| `concepts/` | 抽象概念、方法、技术 | backpropagation, kanban-system |
| `comparisons/` | 对比分析 | （目前为空） |
| `raw/` | 原始资料（不审计） | README 文件、论文原文 |
| `_archive/` | 已归档的过期页面 | （目前为空） |

---

## Tag 管理

每个页面的 tags 必须来自 SCHEMA.md 的 tag taxonomy。新增 tag 的流程：

```markdown
1. 想到一个新 tag
2. 检查 SCHEMA.md 的 tag taxonomy 是否有
3. 没有 → 先在 taxonomy 中添加 + 说明
4. 有 → 直接用
```

### 当前主要 tag 分类

| 类别 | tags |
|:-----|:------|
| AI/ML | model, architecture, transformer, llm, training |
| 开发 | python, javascript, debugging, mcp, cli |
| 项目 | hermes, copaw, deskpet, wiki |
| 个人 | memory, workflow, skill, lesson |
| 元 | reference, guide, tutorial |

---

## 审计脚本

`skills/wiki-audit/wiki-audit.py` 是 wiki 的体检医生：

```bash
# 标准审计
python skills/wiki-audit/wiki-audit.py

# Markdown 格式输出
python skills/wiki-audit/wiki-audit.py --markdown

# 自动修复（sources 为空）
python skills/wiki-audit/wiki-audit.py --fix
```

**不审计的目录**：`raw/` 和 `_archive/`（不是内容页面）。

---

## 经验教训

### 踩过的坑

1. **sources 字段容易忘** → 审计脚本可自动修复
2. **大小写不一致** → `LLM-efficiency` vs `llm-efficiency` → 审计脚本现已大小写不敏感
3. **管道语法误报** → 带别名的 wikilink 格式 → 审计脚本已处理
4. **原始资料混入审计** → `raw/` 目录排除
5. **`backpropagation` 在 index 写了两次** → 去重，以后手动检查

### 最佳实践

1. 新建页面时**先写好所有 wikilinks**，再创建目标页面（不会因为缺页面而审计失败）
2. 做批量修改（如补 sources）时，用 Python 脚本而非手动一个个改
3. 页面内容超过 200 行时果断拆分，不要挤在一起
4. 审计脚本要和自己写的页面保持同步（新增检查维度时更新脚本）

---

## 相关页面

- [copaw-notes](/docs/copaw-notes) — CoPaw 知识库
- [skill-evolution](/docs/skill-evolution) — 自进化技能系统（类似的元概念）
- [hermes-agent](/docs/hermes-agent) — Hermes Agent 架构（包含知识管理章节）

