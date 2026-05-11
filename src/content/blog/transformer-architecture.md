---
title: "Transformer Architecture"
description: "Transformer Architecture"
pubDate: 2026-05-05
tags: ["transformer", "architecture", "attention", "llm", "nlp"]
---

# Transformer Architecture

"Attention is All You Need"（Vaswani et al., 2017）提出的革命性架构。当前所有主流 LLM 的基础。

## 核心组件
- **Multi-Head Self-Attention**：多头自注意力机制
- **Positional Encoding**：位置编码（Sinusoidal / Learned / RoPE）
- **Feed-Forward Network**：前馈网络（ReLU / GELU / SwiGLU）
- **Layer Normalization**：层归一化（Pre-Norm / Post-Norm）
- **Residual Connections**：残差连接

## Decoder-only 架构（GPT 系列）
- 因果自注意力（Causal Masking）
- 只有 Decoder 层，没有 Encoder
- 自回归生成

## 相关页面
- [nn-zero-to-hero](/docs/nn-zero-to-hero) — 课程涵盖 GPT from scratch
- [nanoGPT](/docs/nanogpt) — 最小实现
- [build-nanogpt](/docs/build-nanogpt) — 从零搭建
- [backpropagation](/docs/backpropagation)

