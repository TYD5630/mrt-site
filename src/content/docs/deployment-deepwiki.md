---
title: "LLM 部署（DeepWiki 课程笔记）"
description: "LLM 部署（DeepWiki 课程笔记）"
sidebar:
  order: 50
  label: "LLM 部署（DeepWiki 课程笔记）"
tags: ["llm", "deployment", "serving", "api", "docker", "monitoring", "load-balancing"]
---

# LLM 部署（Deployment）

> 来源：DeepWiki 对 [mlabonne/llm-course](https://deepwiki.com/mlabonne/llm-course/4.7-deployment) 的 AI 生成文档。

## 概述

将 LLM 从实验模型变为生产服务，涉及模型服务、API 设计、扩展、监控、安全。

## 部署架构

```
User → Load Balancer → API Gateway
                            │
               ┌────────────┼────────────┐
               ▼            ▼            ▼
          Inference     Inference     Inference
            Server       Server       Server
               │            │            │
               └────────────┼────────────┘
                            ▼
                      Model Registry
                    (HuggingFace / S3)
```

## 服务框架对比

| 框架 | 语言 | 特点 | 场景 |
|:-----|:----:|:------|:-----|
| **vLLM** | Python | PagedAttention, OpenAI 兼容 API | 高吞吐生产 |
| **FastAPI + Transformers** | Python | 自定义灵活，小规模 | 原型/小服务 |
| **Triton Inference Server** | C++/Python | NVIDIA 官方，多模型管理 | 企业级 |
| **BentoML** | Python | 打包→容器化→部署一体化 | ML 平台 |
| **llama.cpp** | C/C++ | CPU 优先，无 GPU 也可用 | 本地/边缘 |
| **Ollama** | Go | 一键运行，模型管理 | 个人开发 |

## Serving API 设计

### OpenAI 兼容 API（事实标准）
```json
POST /v1/chat/completions
{
  "model": "llama-3.1-70b",
  "messages": [{"role": "user", "content": "Hello"}],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": true
}
```

### 流式 vs 非流式

| 模式 | 延迟感知 | 用户体验 | 实现复杂度 |
|:-----|:--------:|:--------:|:---------:|
| **非流式** | 等全部生成完 | ⭐ | 简单 |
| **流式 (SSE)** | 逐 token 返回 | ⭐⭐⭐ | 中等 |
| **WebSocket** | 全双工 | ⭐⭐⭐ | 复杂 |

## 扩展策略

### 水平扩展（Horizontal Scaling）
```
Load Balancer ──→ Instance 1
               ├── Instance 2
               └── Instance 3
```
- **无状态设计**：推理服务器本身无状态，扩展最友好
- **KV Cache 共享**：相同 prompt 前缀复用（如 vLLM Prefix Caching）
- **模型并行**：单模型跨多 GPU（Tensor Parallelism）

### 自动扩展

| 指标 | 策略 |
|:-----|:------|
| **GPU 利用率** | >80% 加实例，<20% 减 |
| **队列深度** | 等待请求数超过阈值加实例 |
| **TTFT 延迟** | P99 TTFT > 2s 扩 |
| **请求速率** | QPS 超过阈值自动扩 |

## 批处理策略

| 策略 | 延迟 | 吞吐 | 适合 |
|:-----|:----:|:----:|:-----|
| **Non-Batched** | 最低 | 最低 | 低负载 |
| **Dynamic Batching** | 中等 | 高 | 多数场景 |
| **Continuous Batching** | 中等 | 最高 | 高吞吐生产 |

## 监控与可观测性

### 核心指标

| 指标 | 意义 |
|:-----|:------|
| **TTFT (Time to First Token)** | 首 token 延迟 |
| **TPOT (Time Per Output Token)** | 每 token 生成时间 |
| **Tokens Per Second** | 生成速度 |
| **GPU Utilization** | GPU 利用率 |
| **VRAM Usage** | 显存使用 |
| **Queue Depth** | 等待队列长度 |
| **Error Rate** | 错误率 |

### 监控栈
- **Metrics**：Prometheus + Grafana
- **Logging**：结构化日志（JSON）
- **Tracing**：OpenTelemetry 分布式追踪

## 安全考虑

### 输入/输出安全

| 风险 | 缓解 |
|:-----|:------|
| **Prompt Injection** | 输入过滤，权限隔离 |
| **Jailbreak** | Guardrails（内容防火墙） |
| **PII Leak** | 脱敏过滤，输出 sanitize |
| **模型盗用** | API Key 认证，速率限制 |
| **拒绝服务** | 配额限制，超时控制 |

### 部署安全
- **容器隔离**：每个模型实例独立容器
- **网络隔离**：推理 API 不与公网直连
- **模型加密**：生产模型文件加密存储
- **审计日志**：记录所有 API 调用

## 生产 Checklist

- [ ] 选择服务框架（vLLM / TRT-LLM / llama.cpp）
- [ ] 启用 Continuous Batching
- [ ] 实现 OpenAI 兼容 API
- [ ] 配置自动扩展策略
- [ ] 设置速率限制和配额
- [ ] 搭建监控（TTFT/TPOT/GPU Utils）
- [ ] 配置结构化日志
- [ ] 实现 Guardrails 安全层
- [ ] 部署健康检查和优雅关闭
- [ ] 写 Smoke Tests

## 相关页面

- [inference-optimization-deepwiki](/docs/inference-optimization-deepwiki)
- [llm-agents-deepwiki](/docs/llm-agents-deepwiki)
- [hermes-agent](/docs/hermes-agent)

