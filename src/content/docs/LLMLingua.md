---
title: "LLMLingua"
description: "LLMLingua"
sidebar:
  order: 50
  label: "LLMLingua"
tags: ["compression", "prompt", "cost-saving", "inference", "microsoft"]
---

# LLMLingua

Microsoft 出品（6112★）。Prompt 和 KV Cache 压缩工具，加速 LLM 推理并降低成本。

## 技术方案
| 版本 | 方法 | 压缩比 |
|:-----|:-----|:------:|
| LLMLingua | 基于小型语言模型的 perplexity 压缩 | 2x-5x |
| LLMLingua-2 | 更优的压缩策略，保持语义完整性 | 3x-10x |
| LongLLMLingua | 针对长上下文场景优化 | 2x-5x |
| LLMLingua-2-SpeedUp | 加速版推理 | 同 LLMLingua-2 |

## 适用场景
- 超长 Prompt / 大量 few-shot 示例
- RAG 场景（文档摘要压缩）
- Agent 系统的长 context 管理
- **LLMLingua-2 实测可减少 ~55% token 用量**（gladehq/claude-shorthand 数据）

## 注意
- 压缩会引入少量信息损失（但对大多数任务无影响）
- 对精确性要求极高的任务（代码生成、数学计算）谨慎使用

## 相关页面
- [LLM-efficiency-methodology](/docs/llm-efficiency-methodology)
- [GPTCache](/docs/gptcache)

