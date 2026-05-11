---
title: "MCP 调试方法论"
description: "MCP 调试方法论"
pubDate: 2026-05-05
tags: ["debugging", "mcp", "tool", "lesson"]
---

# MCP 调试方法论

## 分层排查法
1. 确认进程是否存在
2. 读 stderr 日志
3. 直接 CLI 测试 MCP Server（`echo tools/list | node server.js`）
4. handler 内加细粒度 try-catch

## "空 Error" vs "Connection closed" 区别
- **空 Error** = MCP server 进程活着但 handler 返回了错误响应
- **Connection closed** = MCP server 进程 crash 了（更严重但更容易定位，crash 一定有 stderr）

## 杀进程验证法
杀死疑似提供工具的进程后再调用工具，如果从空 Error 变为 `FunctionNotFoundError`，则确认该进程是工具提供者。

## MCP Server 预加载准则
- handler 内动态 `require()` 可导致未捕获异常 → 整个 MCP Server 进程退出
- 所有外部模块必须顶层 require，handler 使用懒缓存 getter
- 必须添加 `process.on('uncaughtException')` + `process.on('unhandledRejection')` 兜底

## MCP 子进程环境变量陷阱
`StdioServerParameters.env` 替换而非合并父进程环境，缺少 PATH 等关键变量会导致静默崩溃。

## 相关页面
- [copaw-notes](/docs/copaw-notes)
- [brain-architecture](/docs/brain-architecture)

