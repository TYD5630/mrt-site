---
title: "GraphRAG"
description: "GraphRAG"
sidebar:
  order: 50
  label: "GraphRAG"
tags: ["rag", "graph", "knowledge", "retrieval", "microsoft", "llm"]
---

# GraphRAG

微软出品的图结构 RAG 系统。用知识图谱替代向量检索，
从文档中自动提取实体关系网络，支持全局/局部两种查询模式。
⭐ 32.8k · microsoft/graphrag

---

## 概述

传统 RAG 只做向量相似度搜索，GraphRAG 先在文档中构建**实体关系图谱**，
再在图上做推理和检索。对需要理解全局关系的问题（"这个领域的主要趋势是什么"）
效果远超普通 RAG。

## 与传统 RAG 的区别

| 维度 | 传统 RAG | GraphRAG |
|:-----|:---------|:----------|
| 索引结构 | 向量嵌入 | 知识图谱（实体+关系） |
| 查询方式 | 相似度搜索 | 图遍历 + 社区摘要 |
| 全局理解 | ❌ 只能搜片段 | ✅ 能回答全局性问题 |
| 构建成本 | 低（只做 embedding） | 高（需要 LLM 抽实体关系） |
| 适用场景 | 事实检索（XX是什么） | 综合分析（XX有哪些趋势） |

## 与 Karpathy LLM Wiki 理念的关联

我们的 [wiki-maintenance](/docs/wiki-maintenance) 使用手写的 wikilink + frontmatter 做知识关联。
GraphRAG 的图结构思路类似，但自动从非结构化文档中提取关系：

- **我们的方法**：人工编写 `[wikilinks](/docs/wikilinks)` + frontmatter
- **GraphRAG 方法**：LLM 自动分析文档 → 抽取实体 → 构建关系图谱
- **结合**：wiki 的 wikilinks 可作为 GraphRAG 图谱的先验知识

## 相关

- [wiki-maintenance](/docs/wiki-maintenance) — 知识库维护规范
- [LLMLingua](/docs/llmlingua) — Prompt 压缩
- [GPTCache](/docs/gptcache) — 语义缓存
- [llm-efficiency-methodology](/docs/llm-efficiency-methodology) — LLM 成本优化

