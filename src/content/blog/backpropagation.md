---
title: "Backpropagation"
description: "Backpropagation"
pubDate: 2026-05-05
tags: ["neural-network", "training", "gradient", "math"]
---

# 反向传播（Backpropagation）

神经网络训练的**核心算法**。基于链式法则，从输出层向输入层逐层计算梯度。

## 核心思想
- **前向传播**：输入 → 逐层计算 → 输出
- **损失计算**：输出 vs 真实值 → 误差
- **反向传播**：从输出层开始，逐层往回计算梯度（链式法则）
- **参数更新**：梯度下降 → 调整权重

## 相关项目
- [micrograd](/docs/micrograd) — Karpathy 的微型 autograd 引擎
- [nn-zero-to-hero](/docs/nn-zero-to-hero) — 课程涵盖

## 相关页面
- [micrograd](/docs/micrograd)
- [nn-zero-to-hero](/docs/nn-zero-to-hero)
- [transformer-architecture](/docs/transformer-architecture)

