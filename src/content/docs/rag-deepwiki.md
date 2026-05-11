---
title: "RAG 架构（DeepWiki 课程笔记）"
description: "RAG 架构（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "RAG 架构（DeepWiki 课程笔记）"
tags: ["rag", "retrieval", "embedding", "vector-db", "chunking", "hybrid-search"]
---

# 检索增强生成（RAG）

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/4.3-retrieval-augmented-generation) 的 AI 生成文档。

## 概述

RAG 让 LLM 连接外部知识源，无需重新训练即可提供更准确、时效性更强的回答。

## RAG Pipeline

```
                    ┌──────────────────────┐
                    │    Document Ingestion │ (离线阶段)
                    │  Chunk → Embed → DB   │
                    └──────────────────────┘
                              │
                    ┌─────────▼─────────┐
  User Query ──────→ Embed Query ──────→ Vector Search ──────→ Retrieve Chunks
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ LLM + Context ────→ Answer │ (在线阶段)
                    └───────────────────────────┘
```

## 文档处理 Pipeline（离线）

### 1. Document Ingestion
支持多格式：PDF、HTML、Markdown、JSON、数据库等。保留元数据（来源、时间戳、作者）。

### 2. Chunking（文档切分）

| 策略 | 原理 | 场景 |
|:-----|:------|:------|
| **字符/Token 切分** | 按字符数或 token 数切 | 快速原型 |
| **递归切分** | 层级切分：节→段→句 | 通用（推荐） |
| **语义切分** | 用 sentence embedding 确保语义连贯 | 高质量需求 |
| **标题切分** | 按文档结构（标题、章节） | 结构化文档 |

**每个 Chunk 包含**：文本内容 + 来源信息 + 位置 + 元数据

### 3. Embedding 生成
将文本转为密集向量表示。质量直接影响整个 RAG 系统性能。

### 4. 向量存储与索引

| 方案 | 特点 |
|:-----|:------|
| **Faiss** | Facebook 开源，高性能 ANN 搜索，支持 IVF/HNSW |
| **Chroma** | 轻量级，Python 原生，适合小规模 |
| **Pinecone** | 托管服务，自动扩展，免运维 |
| **Weaviate** | 自带语义搜索 + 混合搜索 |
| **Qdrant** | Rust 实现，高性能，自托管 |
| **PGVector** | PostgreSQL 扩展，与现有 DB 集成 |

## 在线查询 Pipeline

### 查询 Embedding
将用户查询用同样模型转为向量。关键优化：
- **Query Rewrite**：重写模糊查询
- **HyDE (Hypothetical Document Embeddings)**：先生成假设回答再检索
- **Query Expansion**：用同义词/相关概念扩展

### 检索策略

| 策略 | 原理 | 场景 |
|:-----|:------|:------|
| **Dense Retrieval** | 语义向量相似度 | 理解语义。需嵌入模型 |
| **Sparse Retrieval** | BM25 关键词匹配 | 精确匹配。无需嵌入 |
| **Hybrid Search** | Dense + Sparse 加权融合 | 最佳实践 |

### 检索后处理
```
检索 → Re-Ranking → Filtering → Context Assembly
```
- **Re-Ranking**：用交叉编码器重新排序，提高 Top-K 质量
- **Filtering**：按元数据（日期、来源）过滤
- **Context Assembly**：组装最终输入给 LLM

## 提示词模板

标准 RAG Prompt：
```
You are a helpful assistant. Use the following context to answer the question.
If you don't know, say so. Don't make up information.

Context:
{retrieved_chunks}

Question: {user_query}
Answer:
```

## 质量评估维度

| 维度 | 评估方法 |
|:-----|:---------|
| **检索精度** | Precision@K, Recall@K, MRR |
| **生成质量** | Faithfulness（忠实度）, Answer Relevance |
| **端到端** | RAGAS 框架 |

## 相关页面

- [advanced-rag-deepwiki](/docs/advanced-rag-deepwiki)
- [gguf-rag-tool](/docs/gguf-rag-tool)（本地 RAG 工具）
- [llm-architecture-deepwiki](/docs/llm-architecture-deepwiki)

