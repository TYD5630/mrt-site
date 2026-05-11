---
title: "Advanced RAG（DeepWiki 课程笔记）"
description: "Advanced RAG（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "Advanced RAG（DeepWiki 课程笔记）"
tags: ["rag", "advanced-rag", "graph-rag", "agentic-rag", "self-rag", "caching"]
---

# Advanced RAG

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/4.4-advanced-rag) 的 AI 生成文档。

## 从基础 RAG 到 Advanced RAG

基础 RAG（Naive RAG）的局限：
- **检索质量不稳定**：chunk 大小、嵌入模型选择高度敏感
- **缺乏上下文理解**：无法处理多跳问题
- **无迭代能力**：一次检索，无法修正

Advanced RAG 通过 **Pre-Retrieval** / **Retrieval** / **Post-Retrieval** 三个阶段的优化来解决。

## Pre-Retrieval 优化

### 查询优化
- **Query Rewriting**：重写模糊/指代不清的查询
- **Query Decomposition**：复杂问题拆成子查询，分别检索后合并
- **HyDE**：先生成假设性回答，用回答去检索（文档分布 vs 查询分布）

### Chunk 优化
- **Small-to-Big**：用小 chunk 检索，返回大 chunk 作为上下文
- **Sentence Window**：检索句子，扩展返回其窗口段落
- **Metadata Filtering**：使用时间、来源等元数据预过滤

## Retrieval 阶段优化

### 多路检索（Multi-Retrieval）
```
Query
 ├─ Dense Retrieval (Embedding)
 ├─ Sparse Retrieval (BM25)
 ├─ SQL / Knowledge Graph Query
 └─ Web Search API
       ↓
 Fusion (加权/重排)
```

### 递归检索（Hierarchical Retrieval）
```
文档层级结构（摘要→章节→段落）
第一轮：检索摘要/概览
第二轮：在命中文档内深入检索
```

### 迭代检索
```
检索 → 读 → 判断是否足够 → 不够则生成新查询再检索
适用于多跳问答（Multi-Hop QA）
```

## Post-Retrieval 优化

### Re-Ranking
| 方法 | 模型类型 | 速度 | 精度 |
|:-----|:---------|:----:|:----:|
| **Bi-Encoder** | 双编码器 | 🚀 | 🟡 |
| **Cross-Encoder** | 交叉编码器 | 🐢 | 🟢 |
| **Cohere Rerank** | 托管服务 | 🟡 | 🟢 |
| **LLM-based** | 用 LLM 自己打分 | 🐢🐢 | 🟢🟢 |

### Context Compression
控制上下文大小，避免「中间迷失」（Lost in the Middle）：
- **Extractive Compression**：提取最相关句子
- **Summarization**：压缩为摘要
- **Token Pruning**：删无关 token

## Self-RAG

让 LLM 自主决定是否需要检索、检索什么、用不用检索结果。
```
生成 → 决策（需要检索？）→ 检索 → 评估（有用？）
     → 整合 → 继续生成
```
- **Reflection Tokens**：特殊 token 控制检索时机
- **Adaptive Retrieval**：按需检索，不是每步都检索

## Agentic RAG

将 RAG 与 Agent 结合（详见 [llm-agents-deepwiki](/docs/llm-agents-deepwiki)）：
- **Tool-Integrated RAG**：检索是 Agent 的一个工具
- **Multi-Step RAG**：Agent 规划多步检索策略
- **Corrective RAG（CRAG）**：检索结果不好 → 修复（重写查询/换源）

## Graph RAG

用知识图谱增强 RAG：
- **Entity Extraction**：从文档提取实体关系
- **Graph Traversal**：沿关系路径推理
- **Community Detection**：社区摘要（Microsoft GraphRAG）

## 缓存策略

| 层级 | 缓存什么 | 命中收益 |
|:-----|:---------|:--------:|
| **Embedding Cache** | 查询 Embedding 结果 | 省嵌入计算 |
| **Search Cache** | 搜索结果 | 省检索时间 |
| **LLM Cache（语义）** | 相似问答 | 省 LLM 调用 |

## 架构选型指南

| 场景 | 推荐方案 |
|:-----|:---------|
| 简单问答 | Naive RAG |
| 多跳推理 | 迭代检索 + Re-Ranking |
| 大规模文档 | 分层检索 + Graph RAG |
| 需要实时更新 | 缓存 + Agentic RAG |
| 高精度需求 | HyDE + Cross-Encoder Rerank |
| 资源受限 | Small-to-Big + BM25 |

## 相关页面

- [rag-deepwiki](/docs/rag-deepwiki)
- [llm-agents-deepwiki](/docs/llm-agents-deepwiki)
- [GraphRAG](/docs/graphrag)
- [GPTCache](/docs/gptcache)

