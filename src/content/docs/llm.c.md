---
title: "llm.c"
description: "llm.c"
sidebar:
  order: 50
  label: "llm.c"
tags: ["llm", "training", "c", "cuda", "karpathy"]
---

# llm.c

Andrej Karpathy 的纯 C/CUDA LLM 训练实现。不使用 PyTorch，从零训练 GPT-2。

## 特点
- 纯 C 语言实现，无框架依赖
- CUDA 内核加速
- 可复现 GPT-2 级别训练
- 教学目的：理解 LLM 训练的每一行代码

## 相关页面
- [nn-zero-to-hero](/docs/nn-zero-to-hero)
- [nanoGPT](/docs/nanogpt) — PyTorch 版本的对应实现
- [build-nanogpt](/docs/build-nanogpt)

