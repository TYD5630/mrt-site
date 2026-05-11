---
title: "screenpipe"
description: "screenpipe"
sidebar:
  order: 50
  label: "screenpipe"
tags: ["ai", "screen", "recording", "agent", "memory", "ocr"]
---

# screenpipe

24/7 本地屏幕与麦克风录制。持续记录你在电脑上看到和听到的一切，
支持全文搜索、AI 查询、自动摘要，所有数据本地存储。
⭐ 18.5k · screenpipe/screenpipe

---

## 概述

screenpipe 是"AI 的长期记忆"。24 小时录制屏幕内容和麦克风音频，
然后用 OCR/ASR 转成文本，支持全文搜索和 AI 语义查询。

## 核心能力

| 能力 | 说明 |
|:-----|:------|
| 屏幕录制 | 定时截图 + OCR 识别文字 |
| 音频录制 | 麦克风输入 + ASR 语音转文字 |
| 全文搜索 | 搜你几天前在屏幕上看到的内容 |
| AI 查询 | 自然语言问"昨天那个文档在哪" |
| 本地存储 | 所有数据在本地，不上传 |
| 插件 | 支持自定义处理管道 |

## 与 Brain 记忆系统的关系

| 维度 | screenpipe | Brain（CoPaw MCP） |
|:-----|:-----------|:-------------------|
| 记录内容 | 屏幕画面+音频 | 对话历史+决策+工具调用 |
| 数据类型 | 截图/音频→OCR文本 | 结构化文本（对话/决策/标签） |
| 粒度 | 持续录制，全量 | 事件驱动，选择性 |
| 隐私 | 全量录制，隐私风险 | 仅记录对话内容 |
| 搜索 | OCR 全文搜索 | 语义向量搜索 |

两者互补：screenpipe 记录"你做了什么"，Brain 记录"你决定了什么"。

## 相关

- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化
- [brain-architecture](/docs/brain-architecture) — Brain MCP 认知架构
- [copaw-notes](/docs/copaw-notes) — CoPaw 知识库（记忆系统部分）

