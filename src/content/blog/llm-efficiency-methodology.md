---
title: "LLM Efficiency & Cost Optimization"
description: "LLM Efficiency & Cost Optimization"
pubDate: 2026-05-05
tags: ["cost-saving", "efficiency", "optimization", "llm", "agent", "best-practice"]
---

# LLM Efficiency & Cost Optimization

降低 LLM Agent 使用成本的核心思想和方法论。不是推荐具体工具，而是建立成本意识框架。

## 一、四大省钱支柱

```
         LLM 成本
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
  缓存    压缩    路由    裁剪
```

### 1. 缓存（Caching）— 不让模型重复干活
语义缓存：相同/相似问题直接返回历史答案，不调 API。

**适用场景：**
- 常见 FAQ 类查询
- 重复的系统检查（心跳、状态轮询）
- 相似度高的用户请求

> **核心思想：** LLM 调用是最贵的操作。能在缓存层解决的，绝不调模型。

### 2. 压缩（Compression）— 减少每次调用的 token
- **Prompt 压缩**：去除冗余、合并相似指令、精简系统提示
- **KV Cache 复用**：共享前缀的请求复用计算
- **上下文裁剪**：只保留必要的对话历史（不把整个会话都塞进去）

> **核心思想：** 一个 token 就是一分钱。少说 = 少花。

### 3. 路由（Routing）— 把对的模型用在对的地方
- **模型分级**：简单任务用便宜模型（DeepSeek/Llama），复杂任务用旗舰模型（Claude/GPT-4）
- **能力探测**：先让便宜的模型试试，搞不定再升级
- **混合架构**：本地小模型处理常规任务，云端大模型处理疑难杂症

> **核心思想：** 杀鸡不用牛刀。99% 的问题不需要 GPT-4 来解决。

### 4. 裁剪（Pruning）— 只带必要的信息进上下文
- **对话历史裁剪**：保留最近 N 轮 + 关键决策点，丢弃闲聊
- **RAG 召回优化**：只检索最相关的 3-5 个片段，不 dump 整个文档
- **系统提示精简**：每句话都有用，不放"套话"
- **工具描述压缩**：长描述的 tool 只保留参数签名

> **核心思想：** 上下文窗口越大 ≠ 越好。多余的信息会稀释注意力，也烧钱。

## 二、具体操作技巧

### 🎯 Prompt 层面的省钱技巧

| 技巧 | 做法 | 省钱效果 |
|:-----|:-----|:--------:|
| **System prompt 瘦身** | 提取不变的部分到独立 prompt 区 | 20-40% |
| **Few-shot 精选** | 不是越多越好，3 个优质示例 > 10 个一般示例 | 30% |
| **JSON mode / Structured Output** | 结构化输出比自由文本减少冗余 | 10-30% |
| **删废话指令** | "请用中文回答""请详细解释"这种无意义的指令去掉 | 5-10% |
| **短变量名** | prompt 模板里用短占位符（`{n}` 而非 `{user_name}`） | 较少 |
| **Tool descriptions 精简** | 只保留必要参数，去掉冗长的描述文字 | 显著 |
| **分步提示替代长提示** | 拆成多个短掉用，只带必要的上下文 | 取决于场景 |

### 🧠 Agent 层面的省钱技巧

| 技巧 | 做法 | 说明 |
|:-----|:-----|:-----|
| **延迟加载技能** | 不把所有 SKILL.md 都塞进 prompt，按需加载 | 大幅降低系统 prompt |
| **上下文快照** | 冻结 snapshot 代替实时注入 | 避免每次对话都重新计算 |
| **任务分级** | 简单 CRUD 用便宜的模型，创意/推理用贵模型 | 成本可降 50-80% |
| **批处理** | 多个小任务合并为一次调用 | 节省 overhead |
| **流式输出 + 早停** | 检测到关键信息后尽早打断生成 | 减少输出 token |
| **Checkpoint 恢复** | 中断任务不从头开始 | 减少重复计算 |

### ⚙️ Infra 层面的省钱技巧

| 技巧 | 做法 | 说明 |
|:-----|:-----|:-----|
| **Prompt Caching（原生）** | 利用 Anthropic/OpenAI 内置的 prompt caching | 最长 90% 折扣 |
| **语义缓存** | 相似问题不用调模型，直接返回缓存 | 高频场景极有效 |
| **模型 Fallback** | 贵模型超时/报错时降级到便宜的 | 提高可用性 |
| **本地推理** | Ollama + 小模型处理常规任务 | 零 API 成本 |
| **Token 用量监控** | 定期检查 token 消耗趋势 | 发现异常尽早干预 |

## 三、思想原则

### 🥇 80/20 法则
- 20% 的输入产生 80% 的 token 消耗（超长文档、大段代码）
- 定位这 20%，针对优化，见效最快

### 🥇 增量思维
- 别一次性"全量加载"
- 需要什么才加载什么（lazy loading）
- 对话历史也只保留真正需要的部分

### 🥇 分级思维
- 不是所有问题都需要最强的模型
- 建立任务难度分级：简单/中等/复杂
- 简单 → DeepSeek/Llama 3，中等 → Claude Haiku，复杂 → Claude Sonnet/Opus

### 🥇 怀疑一切缓存
- 缓存是双刃剑：节省成本但可能返回过时结果
- 对时效性敏感的任务跳过缓存
- 对确定性高的任务大胆缓存

### 🥇 先问再干（Karpathy 原则的延伸）
- 不清楚范围就动手 → 浪费 token 重做
- 先澄清需求再执行 → 一次过

## 四、相关工具

| 工具 | 分类 | 说明 |
|:-----|:-----|:-----|
| [GPTCache](/docs/gptcache) | 缓存 | 语义缓存，LangChain/llama_index 集成 |
| [LLMLingua](/docs/llmlingua) | 压缩 | Microsoft 出品，Prompt + KV Cache 压缩 |
| [prompt-cache](/docs/prompt-cache) | 缓存 | 轻量语义缓存 |
| [Portkey](/docs/portkey) | 路由+监控 | AI Gateway，200+ 模型路由 |
| OpenRouter | 路由 | 统一的模型 API，按需选模型 |
| LangFuse | 监控 | LLM 可观测性 + 成本追踪 |
| Helicone | 监控 | LLM 请求日志 + 成本分析 |

## 相关页面
- [GPTCache](/docs/gptcache)
- [LLMLingua](/docs/llmlingua)
- [Karpathy-coding-guidelines](/docs/karpathy-coding-guidelines) — "先想再动手"原则直接影响成本
- [ai-agent-courses](/docs/ai-agent-courses)

