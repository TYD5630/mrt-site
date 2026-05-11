---
title: "LiteLLM"
description: "LiteLLM"
sidebar:
  order: 50
  label: "LiteLLM"
tags: ["llm", "gateway", "proxy", "api", "routing", "cost", "monitoring"]
---

# LiteLLM

LLM Gateway / Proxy，统一接口调用 100+ LLM API。支持负载均衡、限流、成本追踪、模型回退。
⭐ 45.7k · BerriAI/litellm

---

## 概述

LiteLLM 是目前最流行的 LLM 网关方案。与 [Portkey](/docs/portkey) 定位类似但更偏向自托管 Proxy，
而非 SaaS 平台。提供 OpenAI 兼容 API，后端可切换任意模型提供商。

## 核心能力

| 能力 | 说明 |
|:-----|:------|
| 统一 API | OpenAI 格式调用 100+ LLM（OpenAI/Anthropic/Google/DeepSeek 等） |
| 负载均衡 | 多 API Key 轮询/优先级路由 |
| 成本控制 | 按模型/用户/API Key 限流、预算管理 |
| 模型回退 | 主模型失败时自动降级到备选模型 |
| 监控 | 请求日志、延迟追踪、失败统计 |
| 自托管 | Docker 部署，完全控制数据 |

## 典型用法

```python
# Proxy 模式：启动后替代 OpenAI API
# docker run -p 4000:4000 ghcr.io/berriai/litellm:main

# SDK 模式：直接调用
from litellm import completion

response = completion(
    model="gpt-4o",           # OpenAI
    messages=[{"role": "user", "content": "Hello"}]
)

# 切换模型只需改名字符串
response = completion(
    model="claude-3-opus-20240229",  # Anthropic
    messages=[{"role": "user", "content": "Hello"}]
)
```

## 与 Portkey 对比

| 维度 | LiteLLM | Portkey |
|:-----|:---------|:--------|
| ⭐ | 45.7k | 未公开（新项目） |
| 部署 | Docker 自托管 | SaaS / 自托管 |
| 协议 | OpenAI 兼容 | OpenAI 兼容 |
| 强项 | Proxy 功能全、社区大 | 可观测性、Guardrails |
| 适用 | 需要完整网关+自托管 | 需要可观测性+SaaS |

两者可以互补：LiteLLM 做路由/负载均衡，Portkey 做监控/可观测性。

## 相关

- [Portkey](/docs/portkey) — AI Gateway（可观测性）
- [LLMLingua](/docs/llmlingua) — Prompt 压缩
- [GPTCache](/docs/gptcache) — 语义缓存
- [llm-efficiency-methodology](/docs/llm-efficiency-methodology) — LLM 成本优化

