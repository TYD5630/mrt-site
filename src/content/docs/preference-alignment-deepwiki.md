---
title: "偏好对齐（DeepWiki 课程笔记）"
description: "偏好对齐（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "偏好对齐（DeepWiki 课程笔记）"
tags: ["llm", "alignment", "rlhf", "dpo", "ppo", "grpo", "orpo", "rejection-sampling"]
---

# 偏好对齐（Preference Alignment）

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/3.5-preference-alignment) 的 AI 生成文档。

## 概述

在 SFT（监督微调）之后，偏好对齐让模型学会区分「好回答」和「差回答」，对齐人类偏好。

## 技术方案对比

| 技术 | 计算成本 | 最佳场景 | 需要奖励模型 |
|:-----|:--------:|:---------|:------------:|
| **DPO** | 低-中 | 通用对话模型 | ❌ |
| **ORPO** | 低 | 单阶段对齐（SFT+对齐一步完成） | ❌ |
| **GRPO** | 中-高 | 推理模型（DeepSeek-R1 使用） | ❌（用 Reward Function） |
| **PPO** | 高 | 复杂推理任务 | ✅ |

## 对齐 Pipeline

```
SFT Model + Preference Data
         │
    ┌────┴────┐
    │         │
  直接优化   RL 方法
    │         │
  ┌─┴──┐   ┌─┴──┐
  DPO  ORPO GRPO PPO
```

## Rejection Sampling（拒绝采样）

用当前模型生成多个候选回答，然后打分选择最好的。

### On-Policy vs Off-Policy

| 维度 | On-Policy（拒绝采样） | Off-Policy（预收集） |
|:-----|:---------------------|:--------------------|
| 分布匹配 | ✅ 匹配当前模型 | ❌ 可能不匹配 |
| 对齐稳定性 | ✅ 稳定 | ❌ 分布偏移风险 |
| 数据新鲜度 | ✅ 实时生成 | ❌ 静态数据 |
| 计算成本 | ❌ 每轮需生成 | ✅ 一次性收集 |

### 评分机制
- **Reward Model**：训练神经网络预测人类偏好
- **规则启发式**：长度、格式合规、事实准确性
- **LLM-as-Judge**：用 GPT-4 等前沿模型打分
- **外部验证器**：代码单元测试、数学求解器

## DPO（Direct Preference Optimization）

将对齐目标重构成偏好对的分类问题，无需奖励模型。

### 算法
```
DPO Loss = -log σ(β * (reward_chosen - reward_rejected))
其中 reward = log(π_θ(y|x) / π_ref(y|x))
```

### 超参数

| 参数 | 典型范围 | 作用 |
|:-----|:---------|:-----|
| β (beta) | 0.1 - 0.5 | KL 惩罚强度 |
| Learning rate | 1e-6 - 5e-6 | 比 SFT 更低 |
| Batch size | 8 - 64 | 取决于显存 |
| Epochs | 1 - 3 | 通常少于 SFT |

### 实现框架
- **TRL**：`DPOTrainer`
- **Unsloth**：优化版 DPO
- **Axolotl**：配置文件驱动

### 优缺点
- ✅ 无需奖励模型训练，实现简单，训练稳定
- ❌ 质量略低于 RL 方法，灵活性有限

## PPO（Proximal Policy Optimization）

经典的强化学习对齐方法，需要奖励模型。

### 架构
```
Policy (Actor) → 生成文本 → Reward Model → 打分 → 更新 Policy
                                  ↑
Value Model (Critic) ←──── 优势估计 ←────
```

### KL 惩罚
PPO 用 KL 散度惩罚防止模型偏离太远：
```
total_reward = reward_model_score - β * KL(π_θ || π_ref)
```

## GRPO（Group Relative Policy Optimization）

DeepSeek-R1 使用的方法，不需要奖励模型，用组内相对分数。

### 流程
```
对每个 prompt 生成一组回答
计算组内每个回答的相对优势
用优势更新策略
```

## ORPO（Odds Ratio Preference Optimization）

SFT + 对齐一步完成，直接在训练中同时学习任务和偏好。

## 数据质量关键

- **Pair Quality > Quantity**：一对高质量偏好对 > 100 对噪声对
- **Diverse Prompts**：覆盖多种任务类型
- **On-Policy Alignment**：用当前模型生成的数据更稳定

## 相关页面

- [llm-architecture-deepwiki](/docs/llm-architecture-deepwiki)
- [transformer-architecture](/docs/transformer-architecture)
- [hermes-agent](/docs/hermes-agent)

