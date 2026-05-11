---
title: "LLM 架构（DeepWiki 课程笔记）"
description: "LLM 架构（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "LLM 架构（DeepWiki 课程笔记）"
tags: ["llm", "architecture", "transformer", "attention", "tokenization", "kv-cache"]
---

# LLM 架构

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/3.1-llm-architecture) 的 AI 生成文档。

## 架构演进

现代 LLM 基于 Transformer，从最初的 Encoder-Decoder 演变为以 Decoder-Only 架构为主（GPT、Llama、Mistral 等）。

### Decoder-Only 核心组件

| 组件 | 作用 | 实现细节 |
|:-----|:-----|:---------|
| **Token Embeddings** | Token ID → 向量 | 可学习嵌入矩阵 (vocab_size × d_model) |
| **Positional Encoding** | 编码位置信息 | RoPE（现代标准） |
| **Attention Layers** | 处理 token 间关系 | Causal Self-Attention（因果掩码） |
| **Feed-Forward Networks** | 非线性变换 | SwiGLU / GELU（现代标准） |
| **Layer Normalization** | 训练稳定 | Pre-norm（RMSNorm） |
| **Output Layer** | 投影到词表 | Linear(d_model → vocab_size) |

### 关键演进

```
原始 Transformer (2017)
  └─ Encoder-Decoder（机器翻译）
       │
       ├─ BERT → Encoder-Only（理解任务）
       └─ GPT  → Decoder-Only（生成任务，现代主流）
              │
              ├─ GPT-3/4：Scaling Law 证明
              ├─ LLaMA：开源，RoPE + SwiGLU + RMSNorm
              └─ Mistral：Sliding Window + GQA（分组查询注意力）
```

## Tokenization

将原始文本转换为 LLM 能处理的数值表示。

### 主流策略

| 策略 | 原理 | 使用者 | 特点 |
|:-----|:-----|:-------|:-----|
| **BPE** | 迭代合并高频字节对 | GPT-2/3/4 | 压缩好，处理生僻词 |
| **WordPiece** | 用似然合并 | BERT, Gemini | 优化 LM 似然 |
| **Unigram** | 概率性子词分割 | T5, mBART | 多种分割可能 |
| **SentencePiece** | 语言无关，直接处理纯文本 | LLaMA, Mistral | 空格当普通字符 |

### 关键实践

- **Vocabulary Size**： 128k-256k → 缩短序列但增大嵌入矩阵；32k-50k → 序列增长但参数量少
- **Special Tokens**： `<|begin_of_text|>`, `<|end_of_text|>`, `<|pad|>`
- **Byte-Level Fallback**：确保无未知 token（封闭词表）

## 注意力机制

### 标准多头注意力 (MHA)
```
Q,K,V = Linear(x) for each head
scores = softmax(QK^T / sqrt(d_k))
output = scores · V
```

### 高效注意力变体

| 变体 | 特点 | 使用者 |
|:-----|:------|:--------|
| **GQA（分组查询注意力）** | 多个查询头共享一组 Key/Value 头，减少 KV Cache | LLaMA 2/3, Mistral |
| **MQA（多查询注意力）** | 所有查询头共享一组 KV，极致压缩 | PaLM |
| **Sliding Window Attention** | 只关注局部窗口，长序列线性扩展 | Mistral |
| **Flash Attention** | GPU 显存优化，IO 感知的精确注意力 | 几乎所有现代模型 |

### KV Cache（推理优化核心）
- 自回归生成时缓存已算好的 K 和 V 矩阵，避免重复计算
- 显存占用：2 × batch_size × seq_len × d_model × num_layers × dtype
- GQA 可将 KV Cache 减半

## 生成策略

| 策略 | 原理 | 适用场景 |
|:-----|:------|:---------|
| **Greedy Decoding** | 每一步选最高概率 token | 短文本，确定性输出 |
| **Beam Search** | 维护 top-k 候选路径 | 翻译、摘要 |
| **Top-K Sampling** | 从 top-k 个 token 中采样 | 创意写作 |
| **Top-P (Nucleus)** | 累积概率超过 p 的 token 集 | 创意写作（推荐） |
| **Temperature** | 缩放 logits 分布 | 控制随机性 |

## 外部资源

- [nanoGPT tokenization video - Andrej Karpathy](https://www.youtube.com/watch?v=kCc8FmEb1nY)
- [Let's build the GPT Tokenizer - Karpathy](https://www.youtube.com/watch?v=zduSFxRajkE)

## 相关页面

- [transformer-architecture](/docs/transformer-architecture)
- [llm-agents-deepwiki](/docs/llm-agents-deepwiki)
- [hermes-agent](/docs/hermes-agent)

