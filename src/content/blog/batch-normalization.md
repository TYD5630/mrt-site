---
title: "Batch Normalization"
description: "Batch Normalization"
pubDate: 2026-05-05
tags: ["neural-network", "training", "normalization", "activation"]
---

# Batch Normalization

深度网络训练的核心技术之一。通过归一化层间激活值，解决梯度消失/爆炸问题。

## 核心思想
- 每层输入做归一化（mean=0, var=1）
- 引入可学习参数 γ, β 恢复表达能力
- 训练时用 mini-batch 统计量，推理时用全局统计量

## 为什么有效
- 缓解 Internal Covariate Shift
- 允许更高的学习率
- 有轻微正则化效果
- 减少对初始化的敏感度

## 相关页面
- [nn-zero-to-hero](/docs/nn-zero-to-hero) — makemore Part 3 专题讲解
- [backpropagation](/docs/backpropagation)
- [transformer-architecture](/docs/transformer-architecture) — 使用 LayerNorm 而非 BatchNorm

