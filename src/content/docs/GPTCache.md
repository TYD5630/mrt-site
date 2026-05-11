---
title: "GPTCache"
description: "GPTCache"
sidebar:
  order: 50
  label: "GPTCache"
tags: ["cache", "semantic-cache", "cost-saving", "llm", "langchain"]
---

# GPTCache

zilliztech 出品（8014★）。LLM 语义缓存——相似问题自动复用历史答案，大幅降低 API 成本。

## 特点
- **语义匹配**：基于 embedding 的相似度搜索，语义相同的问题自动命中缓存
- **LangChain / llama_index 原生集成**：一行代码启用
- **多级缓存**：内存 + 向量数据库（Milvus/Qdrant）
- **可配置相似度阈值**：精确匹配 / 模糊匹配

## 适用场景
- 高频重复查询（FAQ、帮助文档、常规分析）
- 确定性回答（事实类而非创意类）
- 对延迟敏感的应用（缓存命中 5ms vs API 调用 2s+）

## 相关页面
- [LLM-efficiency-methodology](/docs/llm-efficiency-methodology)
- [LLMLingua](/docs/llmlingua)
- [prompt-cache](/docs/prompt-cache)

