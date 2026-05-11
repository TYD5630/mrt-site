---
title: "效率方法论与生产力思想"
description: "效率方法论与生产力思想"
pubDate: 2026-05-05
tags: ["productivity", "methodology", "gtd", "second-brain", "kaizen", "mindset"]
---

# 效率方法论与生产力思想

提高工作效率、降低认知负荷的核心方法论。不分领域，通用性强。

## 一、任务管理方法论

### GTD（Getting Things Done）— David Allen
**核心理念：大脑是用来思考的，不是用来记住事情的。**

- **收集**：把所有待办事项从脑子里"倒"出来，记到外部系统
- **处理**：每个事项判断「2 分钟能做完？→ 立刻做」「不能？→ 委派 / 推迟 / 归档」
- **组织**：按上下文分类（@电脑 / @外出 / @电话）
- **回顾**：每周回顾，清空收集箱
- **执行**：根据上下文、时间、精力选择做什么

> 💡 对 AI Agent 的启示：工作区里的文件就是你的"收集箱"。想到什么立刻记下来，不要靠脑子记。

### Pomodoro Technique（番茄工作法）
**核心理念：专注 25 分钟，休息 5 分钟。**

- 25 分钟深度工作 → 5 分钟休息 → 循环 4 次 → 15-30 分钟长休息
- 适合需要高度集中注意力的任务
- 减少任务切换的认知成本

### Eisenhower Matrix（四象限法）
```
             紧急              不紧急
  重要   [马上做]           [计划做]
       危机、截止期      战略、学习、关系
  不重要 [委派做]           [别做]
       琐事、干扰       浪费时间的活动
```

## 二、知识管理方法论

### PARA 方法（Tiago Forte）
**核心理念：按"可操作性"组织信息，而非按主题。**

| 层级 | 是什么 | 示例 |
|:-----|:-------|:-----|
| **P**rojects | 有截止期的任务 | "写论文""重构模块" |
| **A**reas | 长期负责的领域 | "健康""财务""编程" |
| **R**esources | 将来可能有用的资料 | 文章、笔记、书摘 |
| **A**rchives | 不活跃的旧内容 | 已完成项目、旧资料 |

### Zettelkasten（卡片盒笔记法）
**核心理念：一个想法一张卡片，卡片之间通过链接形成网络。**

- **原子化**：每个笔记只记录一个想法
- **链接**：每个笔记至少关联 3 个其他笔记
- **用自己的话写**：不复制粘贴，用自己的语言重新表达
- **涌现**：知识不是树状结构，而是网络结构

> 💡 这就是 [nn-zero-to-hero|Karpathy LLM Wiki](/docs/nn-zero-to-herokarpathy-llm-wiki) 模式的思想源头！

### 第二大脑（Second Brain）— Tiago Forte
**核心理念：把信息处理外包给外部系统，解放大脑做创造性的工作。**

- CODE 流程：**C**apture（捕获）→ **O**rganize（组织）→ **D**istill（提炼）→ **E**xpress（表达）
- 定期回顾和提炼，而不是只管存不管用
- 渐进式总结：粗读 → 标记重点 → 提炼摘要 → 融入自己的体系

## 三、编码与开发方法论

### Unix 哲学
- **做一件事，把它做好**（Do one thing well）
- **组合优于单体**（Composability）
- **简洁清晰**（Clarity over cleverness）
- **配置化优于硬编码**
- **早失败，早暴露问题**（Fail early, fail loud）

### KISS（Keep It Simple, Stupid）
最简单的方案往往是最好的方案。与 [karpathy-coding-guidelines](/docs/karpathy-coding-guidelines) 的 Simplicity First 同源。

### YAGNI（You Ain't Gonna Need It）
不要为"将来可能用到的功能"提前写代码。未来不可预测，写 today 需要的就好。

### DRY（Don't Repeat Yourself）
每份知识和逻辑在系统中只出现一次。重复 = 维护成本的平方。

### Pareto 原则（80/20 法则）
- 80% 的效果来自 20% 的努力
- 识别关键的 20%，优先投入
- 剩下的 80% 可以不做、延期、或者用最简单的方式处理

## 四、LLM/Agent 专属效率思想

### 延迟加载（Lazy Loading）
- 不需要的技能不加载
- 不需要的历史不塞入上下文
- 按需检索，而非全量注入

### 增量处理（Incremental Processing）
- 不每次从零开始
- 在已有结果上进行增量更新
- Checkpoint 让你可以从断点继续

### 任务分级阶梯
```
                成本（由低到高）
  本地小模型 ─── 云端中模型 ─── 旗舰大模型
  (Ollama/Llama)  (Haiku)      (Sonnet/Opus/GPT-4)
       │              │               │
   简单分类       常规写作        创意/推理
   格式转换      代码审查        架构设计
   数据提取      文档生成        复杂推理
```

### 可逆性检查（L1/L2/L3）
- **L1**（可逆）→ 直接执行
- **L2**（有限可逆）→ 加 checkpoint
- **L3**（不可逆）→ 先确认再执行
- 减少不必要的确认 = 减少来回对话 = 节省 token

## 五、汇总对照表

| 方法论 | 一句话 | 适用场景 |
|:-------|:-------|:---------|
| **GTD** | 别用脑子记事情 | 任务管理 |
| **PARA** | 按项目组织知识 | 知识管理 |
| **Zettelkasten** | 卡片链接成网 | 学习与研究 |
| **Unix 哲学** | 单一职责 + 组合 | 软件开发 |
| **KISS/YAGNI** | 不做多余的 | 编码/决策 |
| **80/20** | 抓大放小 | 任何领域 |
| **延迟加载** | 需要了再加载 | LLM Agent |
| **增量处理** | 断点续传 | 长任务 |
| **可逆性分级** | 按风险决定执行方式 | Agent 决策 |

## 相关页面
- [karpathy-coding-guidelines](/docs/karpathy-coding-guidelines) — 编码层面的效率准则
- [LLM-efficiency-methodology](/docs/llm-efficiency-methodology) — LLM 成本优化的具体操作
- [nn-zero-to-hero](/docs/nn-zero-to-hero) — Karpathy LLM Wiki 模式

