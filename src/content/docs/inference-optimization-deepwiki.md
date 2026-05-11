---
title: "推理优化（DeepWiki 课程笔记）"
description: "推理优化（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "推理优化（DeepWiki 课程笔记）"
tags: ["llm", "inference", "quantization", "spec-decoding", "vllm", "batching", "kv-cache"]
---

# 推理优化（Inference Optimization）

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/4.6-inference-optimization) 的 AI 生成文档。

## 概述

LLM 推理优化的核心目标：**更快的生成 + 更少显存 + 更高吞吐**。

## 瓶颈分析

| 阶段 | 瓶颈 | 占比 |
|:-----|:------|:----:|
| **Prefill**（预填充） | 计算密集（矩阵乘法） | ~30-50% |
| **Decode**（逐 token 生成） | 显存带宽密集（KV Cache 读取） | ~50-70% |

## 量化（Quantization）

### 原理
将模型权重从 FP16/FP32 降为 INT8/INT4，减少显存占用和带宽。

### 方案对比

| 方案 | 精度 | 显存 | 部署难度 |
|:-----|:----:|:----:|:--------:|
| **FP16** | 基准 | 基准 | 低 |
| **INT8 (W8A8)** | 几乎无损 | 减半 | 中 |
| **INT4 (W4A16)** | 微损 | 减 75% | 中 |
| **INT4 (W4A8)** | 微损 | 减 75% | 高 |
| **NF4 (QLoRA)** | 可用于训练 | 极度压缩 | 高 |

### 关键量化方法

| 方法 | 特点 | 工具 |
|:-----|:------|:-----|
| **GPTQ** | 后训练量化，逐层优化，INT4 | AutoGPTQ |
| **AWQ** | 感知重要通道，保留高权重精度 | AutoAWQ |
| **GGML/GGUF** | CPU 友好，支持层卸载 | llama.cpp |
| **BitsandBytes** | 即用即量化，无需校准 | transformers |

### 量化权衡
```
INT4 ←─────────── 精度 ───────────→ FP16
  │                                    │
  快←─────────── 速度 ───────────→ 基准
  │                                    │
  低←─────────── 显存 ───────────→ 高
```

## 批处理策略

### Static Batching（静态批处理）
- 固定 batch size，等够一批才处理
- 简单但利用率低

### Dynamic Batching（动态批处理）
- 持续累积请求直到填满或超时
- 更好的吞吐

### Continuous Batching（迭代级批处理）
- **核心思想**：一个序列生成完立即让出 slot 给新序列
- vLLM 的核心实现，吞吐可提升 10-20x

## 投机解码（Speculative Decoding）

### 原理
```
Draft Model（小模型，快速） → 生成 K 个候选 token
Target Model（大模型）      → 验证/修正候选
接受率 ≈ 80%
```
- **优点**：无损加速（输出分布与 target 一致）
- **效果**：2-3x 速度提升

### 常见 Draft 模型
- **Self-Speculative**：用 target 模型的浅层作为 draft
- **Medusa**：训练多个独立 head 预测后续 token
- **Stochastic Speculative**：用独立的小模型

## KV Cache 优化

| 技术 | 原理 | 效果 |
|:-----|:------|:----:|
| **GQA/MQA** | 减少 K/V head 数量 | 减半/数倍 |
| **KV Cache Quantization** | INT8 存 KV Cache | 减半显存 |
| **PagedAttention (vLLM)** | 类似虚拟内存的 KV 管理 | 消除碎片 |
| **Prefix Caching** | 共享 prompt 前缀缓存 | 多指复用 |
| **KV Cache Offloading** | KV 卸载到 CPU | 支持更长序列 |

## 模型架构优化

| 优化 | 原理 | 效果 |
|:-----|:------|:----:|
| **Flash Attention** | IO 感知的精确注意力 | 2-4x 训练加速 |
| **Sliding Window** | 限制注意力窗口 | 线性扩展 |
| **Mamba (SSM)** | 状态空间模型替代注意力 | 线性复杂度 |
| **MOE (Mixture of Experts)** | 稀疏激活，每步只算部分专家 | 同等计算更多参数 |

## 推理框架对比

| 框架 | 特点 | 最佳场景 |
|:-----|:------|:---------|
| **vLLM** | PagedAttention, Continuous Batching | 高吞吐在线服务 |
| **llama.cpp** | CPU/GPU 混合，GGUF 格式 | 本地/边缘部署 |
| **TensorRT-LLM** | NVIDIA 官方，极致优化 | 大规模生产 |
| **TGI (HF)** | HuggingFace 官方，开箱即用 | 快速部署 |
| **SGLang** | Structured Generation + RadixAttention | 复杂推理结构 |
| **Ollama** | 本地一键运行 | 个人/开发 |

## 性能评估指标

| 指标 | 含义 |
|:-----|:------|
| **TTFT** (Time to First Token) | 首 token 延迟（Prefill 速度） |
| **TPOT** (Time per Output Token) | 每 token 生成时间 |
| **Throughput** | tokens/second（吞吐量） |
| **Max Batch Size** | 最大并发数 |

## 相关页面

- [llm-architecture-deepwiki](/docs/llm-architecture-deepwiki)
- [llm-agents-deepwiki](/docs/llm-agents-deepwiki)
- [llm-efficiency-methodology](/docs/llm-efficiency-methodology)

