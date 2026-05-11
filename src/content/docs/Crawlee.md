---
title: "Crawlee"
description: "Crawlee"
sidebar:
  order: 50
  label: "Crawlee"
tags: ["python", "scraping", "crawler", "web", "automation"]
---

# Crawlee

Python 网页爬虫与浏览器自动化框架。内置反爬、并发、代理轮换、数据导出。
⭐ 8.9k · apify/crawlee-python

---

## 概述

Crawlee 是 Apify 出品的 Python 爬虫框架。相比 requests+BeautifulSoup 的手动方案，
它提供一站式能力：浏览器渲染、自动重试、代理轮换、请求队列、数据持久化。

## 核心能力

| 能力 | 说明 |
|:-----|:------|
| 浏览器渲染 | 内置 Playwright，自动渲染 JS 页面 |
| 反爬 | 自动重试、指纹伪装、代理轮换 |
| 并发 | 自动请求队列 + 并发控制 |
| 数据导出 | JSON/CSV/Parquet 等格式 |
| 断点续爬 | 崩溃后自动恢复 |
| 监控 | 请求统计、速率追踪 |

## 与 browser_use 对比

| 维度 | Crawlee | browser_use（CoPaw 内置） |
|:-----|:---------|:--------------------------|
| 定位 | 专业爬虫框架 | 通用浏览器自动化 |
| 反爬 | 内置（代理/指纹/重试） | 无（需手动处理） |
| 并发 | ✅ 多页面并发 | ❌ 单实例 |
| 数据导出 | ✅ 自动格式化 | ❌ 手动解析 |
| 学习成本 | 中 | 低 |

**场景建议**：
- 批量数据采集（多页、多站）→ Crawlee
- 单页面交互、截图、验证 → browser_use

## 相关

- [browser-automation-tips](/docs/browser-automation-tips) — 浏览器自动化实战
- [desktop-control](/docs/desktop-control) — 桌面控制技术
- [copaw-notes](/docs/copaw-notes) — CoPaw 知识库

