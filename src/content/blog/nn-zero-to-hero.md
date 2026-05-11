---
title: "Neural Networks: Zero to Hero"
description: "Neural Networks: Zero to Hero"
pubDate: 2026-05-05
tags: ["neural-network", "deep-learning", "tutorial", "course", "transformer", "backpropagation"]
---

# Neural Networks: Zero to Hero

Andrej Karpathy 的神经网络课程，从零基础到搭建 GPT。全程代码实战，Jupyter Notebook + YouTube 视频。

## 课程结构

### Lecture 1: micrograd — 手动反向传播
- 用 Python 从零实现 autograd 引擎
- 手动推导反向传播，理解梯度计算
- 🔗 `https://www.youtube.com/watch?v=VMj-3S1tku0`
- 相关项目：[micrograd](/docs/micrograd)

### Lecture 2: makemore — 语言模型入门
- 实现 bigram 字符级语言模型
- 引入 PyTorch Tensor，理解负对数似然损失
- 🔗 `https://www.youtube.com/watch?v=PaCmpygFfXo`

### Lecture 3: makemore Part 2 — MLP
- 多层感知机实现字符级 LM
- 掌握超参数调优、train/dev/test 划分、过拟合/欠拟合
- 🔗 `https://youtu.be/TCH_1BHY58I`

### Lecture 4: makemore Part 3 — Activations & BatchNorm
- 深度网络前向/反向传播统计数据诊断
- 激活值缩放不当的陷阱
- **Batch Normalization** 原理与实现
- 🔗 `https://youtu.be/P6sfmUTpUmc`

### Lecture 5: Backprop Ninja
- 手工推导反向传播（不依赖 PyTorch 自动求导）
- 深入理解梯度流动
- 🔗 （makemore_part4_backprop.ipynb）

### Lecture 6: WaveNet
- 树状 CNN 架构用于语言建模
- 卷积网络的时序建模能力
- 🔗 （makemore_part5_cnn1.ipynb）

### Lecture 7: GPT from Scratch*
- 从零搭建 Generative Pretrained Transformer
- 注意力机制、多头注意力、位置编码
- 相关项目：[nanoGPT](/docs/nanogpt), [build-nanogpt](/docs/build-nanogpt)

### Lecture 8: GPT Tokenizer*
- BPE（Byte Pair Encoding）分词算法
- Tokenization 是 LLM 的隐藏陷阱
- 相关项目：[minbpe](/docs/minbpe)

> *注：Lecture 7-8 在 [build-nanogpt](/docs/build-nanogpt) 和 [minbpe](/docs/minbpe) 仓库中

## 配套项目
- [micrograd](/docs/micrograd) — 微型 autograd 引擎
- [makemore](/docs/makemore) — 字符级语言模型
- [nanoGPT](/docs/nanogpt) — 最简 GPT 训练
- [minbpe](/docs/minbpe) — BPE 分词器实现
- [build-nanogpt](/docs/build-nanogpt) — 从零搭建 GPT 视频+代码
- [llm.c](/docs/llmc) — 纯 C/CUDA 训练 LLM

## 相关页面
- [micrograd](/docs/micrograd)
- [nanoGPT](/docs/nanogpt)
- [backpropagation](/docs/backpropagation)
- [batch-normalization](/docs/batch-normalization)
- [transformer-architecture](/docs/transformer-architecture)

