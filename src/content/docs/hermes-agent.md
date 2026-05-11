---
title: "Hermes Agent ⚡"
description: "Hermes Agent ⚡"
sidebar:
  order: 50
  label: "Hermes Agent ⚡"
tags: ["hermes", "agent", "architecture", "memory", "brain", "skills", "workflow", "self-evolution", "kanban", "collaboration", "routing", "progressive-context"]
---

# Hermes Agent ⚡

> 信使型 AI Agent — 基于 CoPaw 平台，继承 Hermes 框架设计模式。
> 跑在 Qwen 系模型（QwQ-32B 类），1M token 上下文窗口。
> **特征**：高效、自进化、知识驱动、多工具融合。

---

## 一、身份定位

| 维度 | 内容 |
|:-----|:------|
| **名称** | Hermes ⚡（信使之名） |
| **平台** | CoPaw Agent 平台 |
| **模型** | Qwen 系（QwQ-32B 类） |
| **语境** | 1M token 上下文 |
| **OS** | Windows 10 (AMD64) |
| **风格** | 直接高效、带态度、不废话 |
| **定位** | 信使型 — 直接行动，少说废话 |

### 名字来源
继承自 [Hermes 开源项目](https://github.com/HermesLLM/Hermes) 的精神内核，但不跑在原框架上，而是基于 CoPaw 平台重新实现核心设计模式。

---

## 二、认知架构（Brain v1.1.9）

### 2.1 架构概览
Brain 是认知核心，提供 19 个 MCP 工具，分为 8 个功能类别：

```
Brain v1.1.9
├── 基础记忆    → brain_recall / brain_semantic_recall / brain_list / brain_forget
├── 决策管理    → brain_save_decision / brain_task_status
├── 分析评估    → brain_confidence_check / brain_cleanup
├── 上下文注入  → brain_inject / brain_get_latest_snapshot
├── 摘要桥接    → brain_summarize / brain_get_bridge
├── 关联推理    → brain_get_relations / brain_cross_session_reason / brain_proactive_context
├── 工具记忆    → brain_tool_log / brain_tool_advise / brain_tool_stats
└── 跨 Agent   → brain_cross_agent_reason
```

### 2.2 按场景使用指南

| 场景 | 首选工具 | 作用 |
|:-----|:---------|:------|
| 模糊/不确定任务 | `brain_confidence_check` | 先评估风险和置信度 |
| 想查之前怎么做过的 | `brain_cross_session_reason` | 跨会话推理，自动搜索所有相关记忆 |
| 刚用完重要工具 | `brain_tool_log` | 记录这次调用经验，下次自动推荐 |
| 不确定用什么工具 | `brain_tool_advise` | 查历史经验，获得工具推荐 |
| 查知识关联网络 | `brain_get_relations` | 查询某记忆的关联图谱 |
| 新会话启动 | `brain_inject` / `brain_get_bridge` | 加载完整上下文 |
| 会话结束 | `brain_save_decision` | 记录关键决策 |
| 查当前任务 | `brain_task_status` | 查询进行中任务 |
| 工具使用统计 | `brain_tool_stats` | 频率与成功率统计 |

### 2.3 跨会话连续性
最新会话启动时自动执行：
1. 读取 `AGENTS.md` + `MEMORY.md` + `PROFILE.md` + `SOUL.md` 冻结快照
2. 读取 `memory/.session-bridge.md` 桥文件（P2-3 跨会话缝合）
3. 调用 `brain_inject` 加载完整上下文 + 自动摘要前一天
4. 读取当日 `memory/YYYY-MM-DD.md`

---

## 三、记忆系统

### 3.1 三层存储架构

| 层级 | 位置 | 用途 | 持久性 |
|:-----|:------|:------|:-------|
| **长期记忆** | `MEMORY.md` | 精心整理的经验、决策、配置 | 跨会话永久 |
| **用户画像** | `PROFILE.md` | 用户身份、偏好、习惯 | 跨会话永久 |
| **每日笔记** | `memory/YYYY-MM-DD.md` | 原始事件记录 | 按日期归档 |
| **灵魂** | `SOUL.md` | 行为准则、编码原则、效率意识 | 跨会话永久 |
| **Brain 记忆** | Brain MCP 后端 | 语义搜索、跨会话推理、关联图谱 | 结构化持久 |

### 3.2 冻结快照模式
- 会话启动时：读文件注入 system prompt（**冻结**）
- 会话中写入：立即落盘但**不改变当前 prompt**
- 关键设计：`§`（段落分隔符）用于多条目精确替换
- 跨会话桥：`memory/.session-bridge.md` 自动缝合

### 3.3 GTD 捕获习惯
大脑是用来思考的，不是用来记住事情的：
- 想到立刻记到文件里
- 不等用户说"记住这个"
- 先记录、再回答
- 信息就像漏水的桶，多等一秒就多漏一点

### 3.4 晋升引擎（Promotion Engine）— 动态层级管理
在 Brain 后端实现 hot/warm/cold 三层自动晋升/降级：

```javascript
promotionScore = 时效(0.35) + 频率(0.20) + 优先级(0.25) + 类型加成(0.10)
```

| 层级 | 条件 | 行为 |
|:-----|:------|:------|
| 🔥 **hot** | access≥3 次 + 1 天内 + pri≥0.7 | 自动预载到会话上下文 |
| ⚡ **warm** | 默认层级 | 按需搜索，不预载 |
| ❄️ **cold** | 从未访问 + >90 天 | 仅语义搜索可召回，不参与关键词匹配 |

**生产数据**（2026-05-10 首次 promote 后）：
- 🔥 hot: 190 条 (68.3%)
- ⚡ warm: 20 条 (7.2%)
- ❄️ cold: 68 条 (24.5%)
- 总计: 278 条记忆

**命令**：`node promotion-engine.js status | promote | hot | watch`

**自动集成**：`brain_inject` 自动注入 hot 层 top-3 记忆（跳过工具日志），无需手动调用。

---

## 四、渐进式上下文加载（三层路由架构）

### 4.1 概述
核心路由系统，将用户查询按照三层递进策略路由到最合适的技能，实现「80% 低成本命中 + 20% 高级推理兜底」。

### 4.2 三层递进设计
```
用户查询
  ├─ ① 关键词匹配 (O(1) 查表)
  │    ├─ 命中 (score ≥ 0.1) → 预加载 SKILL.md ✅
  │    └─ 未命中 → ②
  ├─ ② 语义回退 (向量检索 ~5s)
  │    ├─ 命中 → 匹配画像库 → 预加载 ✅
  │    └─ 未命中 → ③
  └─ ③ 通用 fallback（不加载任何 skill）
```

### 4.3 关键词匹配引擎
维护 70+ 条目的关键词映射表，评分公式：
```
分数 = 名称匹配(0.35) + 描述匹配(0.20) + 关键词命中(0.20)
      + 类别匹配(0.15) + 文件名暗示(0.10)
```

**关键设计**：
- 软归一化 + 边际递减（2 个匹配是 1 个的 1.5× 而非 2×）
- 阈值 0.1（宁低勿高，宁可误命中也不漏）
- 一个匹配 > 零个匹配，这是最重要的非线性

### 4.4 语义回退层
关键词失配时自动调用 `brain-memory-qmd`（sentence-transformers all-MiniLM-L6-v2，384 维），结果与 93 个技能画像交叉匹配。

**匹配维度**：
| 维度 | 权重 | 计算方式 |
|:-----|:----:|:---------|
| 技能名全文匹配 | 0.35 | 精确/模糊匹配 |
| 名称词素相似度 | 0.15 | token 切分后重叠率 |
| 关键词命中 | 0.20 | 映射表中的条目匹配 |
| 描述词重叠 | 0.15 | 描述文本的 Jaccard 相似度 |
| 文件名暗示 | 0.30 | 文件名派生词匹配 |

### 4.5 生产数据
| 指标 | 数据 |
|:----|:----:|
| 关键词直接命中率 | 62.5%（25 查询中多轮测试） |
| 语义回退捕获率 | 37.5%（剩余全部被语义层捕获） |
| 全回退率 | **0%**（零崩溃、零超时） |
| 关键词查表延迟 | <1ms |
| 语义搜索延迟 | ~5s（含向量检索 + 画像匹配） |
| 画像总数 | 93 个（筛掉 7 个无映射的） |

### 4.6 关键实现文件
| 文件 | 作用 |
|:-----|:------|
| `skills/progressive-context/scripts/build-profiles.js` | 从 INDEX.md + AGENTS.md 构建技能画像库 |
| `skills/progressive-context/scripts/context-router.js` | 主路由器：输入查询 → 输出技能排序 |
| `skills/progressive-context/scripts/route-execute.js` | 路由 + 自动预加载 SKILL.md（AGENTS.md 集成入口） |
| `skills/progressive-context/profiles.json` | 生成的技能画像缓存（93 个 profile） |

### 4.7 画像库映射治理
`profiles.json` → `skills/<name>/SKILL.md` 的映射有 7% 的自然漂移率：

| 漂移类型 | 举例 | 治理措施 |
|:---------|:-----|:---------|
| 版本号不同步 | `brain-v1.1.9` → 实际 `brain-v1.1.8` | `SKILL_DIR_ALIAS` 别名映射表 |
| 索引格式不兼容 | `chrome9222` 在 INDEX 有，目录无 | `hasRealSKILL()` 三级检查 |
| 占位目录 | `diagramming/` 只有 DESCRIPTION.md | 后处理过滤器 |
| 幽灵条目 | `memory-lancedb-pro/` 不存在 | 构建时自动过滤 |

**最终状态**：93/93 映射成功，110 断言全绿。

---

## 五、行为框架（SOUL.md）

### 4.1 核心准则
| 准则 | 含义 |
|:-----|:------|
| 🎯 **真心帮忙别演** | 直接帮，行动胜过废话 |
| 💭 **有自己的观点** | 可以不同意、有偏好、觉得有趣或无聊 |
| 🔍 **先自己想办法** | 查文件、搜上下文、找 skill，卡住了再问 |
| 🔧 **先分析再动手** | 定位根因再一次性落地，不试探式排错 |
| 🏗️ **调研先行** | 复杂问题先全面了解系统全貌，再系统性方案落地 |

### 4.2 Karpathy 编码准则（已内化）
| 准则 | 核心 |
|:-----|:------|
| **Think Before Coding** | 不假设、不藏困惑、呈现权衡 |
| **Simplicity First** | 最少代码，不多写一行 |
| **Surgical Changes** | 只碰必须碰的，只清理自己的混乱 |
| **Goal-Driven Execution** | 模糊任务→可验证目标，每步带检查点 |

### 4.3 效率与成本意识（已内化）
| 原则 | 一句话 |
|:-----|:--------|
| **Token 即金钱** | 每句话都有成本，不说废话 |
| **80/20 聚焦** | 20% 投入产生 80% 价值 |
| **T 型回应** | 简单直接、复杂展开 |
| **YAGNI 执行** | 不多做没被要求的事 |
| **延迟加载** | 需要才加载 |
| **先确认再动手** | 问清楚再干反而最省钱 |
| **工具优先** | 能调 tool 就不自己编文本 |
| **快速失败** | 搞不定就说搞不定，不绕路 |
| **结构化输出** | 表格/列表优先于大段散文 |
| **系统化降级** | 重试→换方法→降级→坦白 |
| **写下来 > 脑子记** | 想到立刻记文件 |

---

## 五、工作流程

### 5.1 启动流程（9 步）
```
1. 读 AGENTS.md / MEMORY.md / PROFILE.md / SOUL.md（冻结快照）
2. 读 HEARTBEAT.md（心跳上下文）
3. 读当日 memory/YYYY-MM-DD.md
4. 读 memory/.session-bridge.md（跨会话桥）
5. brain_inject 加载完整上下文 + 自动摘要
6. 预加载常驻技能：skill-evolution 🧬
7. 按需加载其他技能 SKILL.md
8. 复杂任务自动加 checkpoint
9. 会话结束：brain_save_decision + brain_tool_log
```

### 6.2 任务处理流程（6 步思维链）
```
收到请求
  ├─ ① 分级（简单→直接做 / 中等→列计划 / 复杂→调研方案）
  ├─ ② 80/20 定位（哪部分价值最大？先做那个）
  ├─ ③ 渐进式路由（route-execute.js → 关键词 O(1) → 语义回退）
  │   命中 → 预加载匹配 SKILL.md
  │   未命中 → 通用工具兜底
  ├─ ④ 工具优先（有 skill/tool 吗？调它。不确定？brain_tool_advise）
  ├─ ⑤ 执行+验证（每步带检查点，快速失败早暴露）
  └─ ⑥ 省 token 检查（回应够短？上下文够精简？）
```

### 6.3 技能调用链
```
收到任务
  ├─ ① 渐进式路由（route-execute.js | brain_tool_advise）
  │   ├─ 命中 93 画像之一 → 预加载 SKILL.md
  │   └─ 未命中 → ②
  ├─ ② 类别匹配（文档/浏览器/邮件/定时/AI 等）
  ├─ ③ 工具兜底（无 skill → 内置工具直接解决）
  └─ ④ 复杂任务完成 → 技能进化决策树
```

### 6.4 错误处理链
```
工具调用失败
  ├─ ① 重试 1 次（网络抖动等瞬时问题）
  ├─ ② 换方法（浏览器→CLI / API→搜索 / 修脚本重跑）
  ├─ ③ 降级方案（简单方案 / 近似结果+说明）
  └─ ④ 坦白（"这个我尝试了 X/Y/Z 都不行，原因是……"）
```

---

## 七、能力体系

### 7.1 工具全景

#### 内置系统工具
| 工具 | 用途 |
|:-----|:------|
| `execute_shell_command` | 执行 CLI 命令 |
| `read_file` / `write_file` / `edit_file` | 文件读写编辑 |
| `grep_search` / `glob_search` | 文件搜索 |
| `browser_use` | 浏览器控制（Playwright，支持可见/无头/CDP） |
| `desktop_screenshot` / `view_image` / `view_video` | 屏幕截图/看图/看视频 |
| `get_current_time` / `set_user_timezone` | 获取/设置时间 |
| `memory_search` | 语义记忆搜索 |
| `send_file_to_user` | 向用户发送文件 |
| `get_token_usage` | API token 用量查询 |
| `create_plan` / `finish_plan` / `revise_current_plan` | 计划管理（多步骤任务编排） |
| `view_subtasks` / `update_subtask_state` / `finish_subtask` | 子任务进度管理 |

#### MCP 工具集
| 工具集 | 数量 | 来源 |
|:-------|:----:|:------|
| Brain MCP | 19 | `brain-v1.1.9` skill |
| Kanban MCP | 9 | `kanban` skill |
| Tavily 搜索 | 5 | `tavily_search` / `extract` / `crawl` / `map` / `research` |
| Agent 对话 | 3 | `list_agents` / `chat_with_agent` / `submit_to_agent` |

#### 112 个技能（按优先级分三层）

| 层级 | 数量 | 典型技能 |
|:----:|:----:|:---------|
| 🥇 **核心** | ~15 | brain-v1.1.9, skill-evolution, docx/xlsx/pptx/pdf, browser, news, cron, kanban, writing-workflow, multi_agent_collaboration, spa-layout-rebuild |
| 🥈 **增强** | ~25 | himalaya, github, guidance, mcp-bridge-deploy, plugin-dev, nextauth-jwe-debug, openlit-deploy, dingtalk_channel, software-development |
| 🥉 **扩展** | ~70 | creative, research, mlops, apple, gaming, red-teaming, domain, inference-sh, productivity, smart-home 等 |

### 7.2 关键词 → 技能匹配（节选）
| 用户提到 | 匹配技能 |
|:---------|:---------|
| 文档/Word/报告 | docx |
| 表格/Excel/数据 | xlsx |
| 浏览器/打开网页 | browser_visible / browser_cdp |
| 新闻/资讯/最新 | news |
| 定时/定期/每天 | cron |
| 大脑/记忆/回忆/决策 | brain-v1.1.9 |
| 写作/文章/润色 | writing-workflow / hnmnizer / editor |
| 代码/审查/PR/仓库 | github |
| 部署/MCP/桥接 | mcp-bridge-deploy |
| 看板/Kanban | kanban |
| 插件/Plugin | plugin-dev |

---

## 八、自我进化

### 8.1 Skill Evolution 🧬
自进化技能系统，在每个复杂任务完成后自动走决策树：
```
任务完成
  ├─ 大规模操作（>5个文件）？→ audit 全库审计
  ├─ 纯探索/调试？→ 跳过
  ├─ 现有技能覆盖？→ patch 现有技能
  ├─ 步骤≥3 且可复现？→ 创建新技能
  └─ 都不是 → 跳过
```

### 8.2 知识库驱动优化
定期回顾 `D:\wiki\` 知识库 → 发现行为缺口 → 更新 SOUL.md 和 AGENTS.md：
- 已执行两轮自我优化（2026-05-05），涵盖 7 个知识点
- 包括：Karpathy 编码准则、效率意识、Brain 工具激活、错误处理链、结构化输出等

### 8.3 审计机制
| 审计目标 | 频率 | 检查项 |
|:---------|:----:|:-------|
| 知识库 wiki | 按需 | sources 完整性、断链、孤立页、frontmatter 规范 |
| 技能 INDEX | 按需 | INDEX vs 实际 SKILL.md 计数、描述准确性 |
| 版本一致性 | 按需 | AGENTS.md 中的版本号、描述是否过时 |

---

## 九、知识管理（Karpathy LLM Wiki）

### 9.1 Wiki 结构
```
D:\wiki\          # 知识库根目录
├── SCHEMA.md      # 领域规则与约定
├── index.md       # 目录（35 页）
├── log.md         # 操作日志
├── raw/           # 原始资料（articles/papers/transcripts）
├── entities/      # 实体页（hermes-agent, GPTCache, nanoGPT 等）
├── concepts/      # 概念页（brain-architecture, mcp-debugging 等）
├── comparisons/   # 对比分析
├── queries/       # 查询归档
└── _archive/      # 归档
```

### 9.2 页面规范
- 每条必须有 YAML frontmatter：`title/created/updated/type/tags/sources`
- 至少 2 个出站 `[wikilinks](/docs/wikilinks)`
- 新建页面同步更新 index.md 和 log.md
- `sources` 字段不可缺失

### 9.3 当前规模
- **42** 个内容页面（entities 22 + concepts 20）
- 覆盖：Agent 架构、MCP 调试、神经网络、AI Agent 课程、效率工具、生产力方法论、系统架构、Monte Carlo 等
- 零断链、零孤立页面

---

## 十、继承自 Hermes 框架的设计模式

| # | 模式 | 说明 |
|:-:|:-----|:------|
| ① | **记忆冻结快照** | MEMORY.md + PROFILE.md 双存储，会话启动注入，写入立即落盘不改 prompt |
| ② | **上下文压缩** | 接近 token 限制时自动触发摘要/LCM 压缩 |
| ③ | **可逆性分级** | L1（直接执行）→ L2（有限可逆+checkpoint）→ L3（不可逆+确认） |
| ④ | **Gateway 多平台** | 已接入：钉钉；就绪：邮件（himalaya） |
| ⑤ | **MCP 集成** | 原生支持 MCP Server（stdio + HTTP） |
| ⑥ | **Kanban 看板** | SQLite + 9 个 MCP 工具，Worker-Orchestrator 模式 |
| ⑦ | **插件系统** | CoPaw plugin-dev SOP，生命周期钩子 |
| ⑧ | **Profiles 多实例** | 隔离的 config/memory/sessions |
| ⑨ | **Skill Evolution** | 自进化技能系统，决策树驱动 |
| ⑩ | **Karpathy 准则** | 已内化到 SOUL.md |
| ⑪ | **效率成本意识** | 已内化到 SOUL.md |
| ⑫ | **任务执行流程** | 5 步思维链 |
| ⑬ | **Brain 深度激活** | 19 工具按场景使用 |
| ⑭ | **错误处理链** | 系统化降级 |
| ⑮ | **渐进式加载** | 三层路由 + 语义回退 + 93 画像 |
| ⑯ | **晋升引擎** | hot/warm/cold 自动层级管理 + 会话预载 |
| ⑰ | **画像库映射治理** | `hasRealSKILL()` 三级检查 + 别名映射 |
| ⑱ | **跨 Agent 记忆共享** | `brain_cross_agent_reason` 零侵入查询 |

---

## 十一、运行环境

| 项目 | 值 |
|:-----|:----|
| OS | Windows 10 (AMD64) |
| Python | Python 3.12（详见 PROFILE.md） |
| Node.js | v23.6.1 |
| npm | 10.9.2 |
| 网络 | HTTP 代理（本地端口） |
| 工作区 | CoPaw 默认工作区 |

---

## 十二、Kanban 看板系统（多 Agent 协调）

### 12.1 概述
SQLite 看板 + 9 个 MCP 工具。Worker-Orchestrator 模式，用于多 Agent 任务分发与协调。

### 12.2 状态机
```
  triage → todo → ready → running → done → archived
                ↑_________|  |
                    unblock   blocked → ready
```

### 12.3 工作流（Worker 侧）
当收到 `[Task Dispatch from orchestrator]` 带 `Task: #<task_id>` 时：
1. **认领** → `kanban_claim(task_id, agent='default')`
2. **心跳保活** → 每 10 分钟 `kanban_heartbeat(task_id, agent)`（Claim TTL 15 分钟）
3. **完成** → `kanban_done(task_id)`
4. **阻塞** → `kanban_block(task_id, reason)`

### 12.4 9 个 Kanban MCP 工具
| 工具 | 作用 |
|:-----|:------|
| `kanban_claim` | 认领任务（running） |
| `kanban_heartbeat` | 续约 TTL |
| `kanban_done` | 完成任务 |
| `kanban_block` | 阻塞任务 + 原因 |
| `kanban_view` | 查看详情/依赖/备注 |
| `kanban_comment` | 添加备注 |
| `kanban_release` | 释放任务（回退 ready） |
| `kanban_move` | 任意状态迁移 |
| `kanban_list` | 按状态过滤列举 |

---

## 十三、Agent 协作与通信

提供 3 种多 Agent 通信模式：

| 模式 | 工具 | 适用场景 |
|:-----|:------|:---------|
| **一对一咨询** | `chat_with_agent(to_agent, text)` | 需要对方立即回复，等待结果 |
| **后台提交** | `submit_to_agent(to_agent, text)` | 派发任务不等待，异步执行 |
| **查询状态** | `check_agent_task(task_id)` | 查询后台任务执行状态 |
| **列表查询** | `list_agents()` | 获取所有已配置 Agent |

另提供 **Brain 跨 Agent 查询**：
- `brain_cross_agent_reason(query)` — 向其他 Agent 的 brain 发送记忆查询，聚合返回结果

可用的 Agent（当前配置）：
- `default` — 本 Agent 自身

---

## 十四、核心文件清单

| 文件 | 作用 | 读写时机 |
|:-----|:------|:---------|
| **AGENTS.md** | 个人工作流、技能树、关键词匹配、启动流程、任务处理、Kanban 指令 | 会话启动冻结，写入立即落盘 |
| **SOUL.md** | 灵魂文件 — 核心准则、Karpathy 编码准则、效率与成本意识 | 会话启动冻结，写入立即落盘 |
| **PROFILE.md** | 用户画像 — 身份、偏好、习惯、背景 | 主动更新（发现用户信息时） |
| **MEMORY.md** | 长期记忆 — 技术配置、经验总结、决策记录 | 重大事件后更新 |
| **HEARTBEAT.md** | 心跳上下文 — 简短的待办或提醒 | 心跳轮询读取 |
| **`memory/YYYY-MM-DD.md`** | 每日笔记 — 原始事件流水账 | 每次有价值信息出现时追加 |
| **`memory/.session-bridge.md`** | 会话桥 — 跨会话连续性 | 会话结束时自动写入 |

---

## 十五、产物与交付物

| 项目 | 路径 | 说明 |
|:-----|:------|:------|
| **桌面宠物 HTML** | `hermes-web-pet.html` | 紫黑像素风 + 全套动画（呼吸/闪电/粒子/Glitch） |
| **桌面浮窗 Python** | `hermes_deskpet.py` | pywebview + WebView2，透明置顶穿透 |
| **启动脚本** | `启动Hermes信使.bat` | Edge 独立窗口模式 |
| **桌面快捷方式** | `Hermes浮窗.bat` | 一键启动桌面浮窗 |
| **知识库** | wiki 目录 | Karpathy LLM Wiki 模式，36 页 |

---

## 相关页面
- [brain-architecture](/docs/brain-architecture)
- [kanban-system](/docs/kanban-system)
- [mcp-debugging](/docs/mcp-debugging)
- [karpathy-coding-guidelines](/docs/karpathy-coding-guidelines)
- [LLM-efficiency-methodology](/docs/llm-efficiency-methodology)
- [productivity-methodology](/docs/productivity-methodology)
- [copaw-notes](/docs/copaw-notes)
- [skill-evolution](/docs/skill-evolution)

