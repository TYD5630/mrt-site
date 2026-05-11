---
title: "nanoGPT"
description: "nanoGPT"
sidebar:
  order: 50
  label: "nanoGPT"
tags: ["transformer", "gpt", "training", "fine-tuning", "nlp"]
---

# nanoGPT

Andrej Karpathy 的最简最快 GPT 训练/微调仓库。PyTorch 实现。

## 特点
- 训练/fine-tune 中等规模的 GPT（~1B 参数级别）
- 极简代码库，易于理解和修改
- `train.py` 约 300 行，完整训练循环
- 支持 OpenWebText、Shakespeare 等数据集
- 支持模型导出

## 用法
```bash
# 训练
python train.py config/train_shakespeare_char.py

# 采样
python sample.py --out_dir out-shakespeare-char
```

## 架构
标准的 Decoder-only Transformer：
- 多头因果注意力（Multi-Head Causal Self-Attention）
- 位置编码（Learned Positional Embeddings）
- Layer Normalization + Residual Connections
- GELU 激活函数（向前传播兼容性）

## 与 GPT-2 可比性
- 默认配置（124M 参数）与 GPT-2 结构一致
- 在 OpenWebText 上训练可复现 GPT-2 级别的困惑度

## 相关页面
- [nn-zero-to-hero](/docs/nn-zero-to-hero)
- [build-nanogpt](/docs/build-nanogpt)
- [minbpe](/docs/minbpe)
- [micrograd](/docs/micrograd)
- [transformer-architecture](/docs/transformer-architecture)

