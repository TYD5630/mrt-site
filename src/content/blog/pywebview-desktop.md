---
title: "pywebview Desktop Floating Window"
description: "pywebview Desktop Floating Window"
pubDate: 2026-05-05
tags: ["python", "desktop", "gui", "pywebview", "webview2", "windows", "lesson"]
---

# pywebview Desktop Floating Window

Python 桌面透明浮窗技术。使用 pywebview + WebView2 在 Windows 桌面上创建 HTML 内容的透明覆盖层。适用于桌面宠物、信息面板、装饰性小工具。

## 技术栈

- **pywebview**：Python → 系统 WebView 桥接（Windows 上用 WebView2 / Edge Chromium）
- **WebView2**：微软 Edge Chromium 的嵌入式浏览器引擎
- **Windows API**：WS_EX_LAYERED / WS_EX_TRANSPARENT 实现透明和鼠标穿透

## 关键实现

### 基本结构

```python
import webview

window = webview.create_window(
    "Hermes Deskpet",
    url="hermes-web-pet.html",
    frameless=True,      # 无边框
    transparent=True,    # 透明背景
    on_top=True,         # 置顶
    width=300, height=400,
)

# 重要：webview.start() 第一个参数必须为 callable
# 传字符串（窗口名）会导致进程崩溃
webview.start(window=window)
```

### 鼠标穿透切换

右键菜单实现点击穿透模式的切换，透过窗口操作桌面图标而不干扰。

```python
# 通过 Windows API 设置 WS_EX_TRANSPARENT
# True → 鼠标穿透（点不到窗口）
# False → 可交互（能点击桌宠）
```

## 坑点与教训

| 问题 | 原因 | 修复 |
|:-----|:------|:------|
| 进程闪退 | webview.start("标题") 传字符串 | 改为 webview.start(window=window) |
| 窗口不透明 | 未设置 transparent=True | 加上 transparent=True |
| 始终不在前端 | 默认不置顶 | 加上 on_top=True |

## 启动方式

```bat
@echo off
cd /d "C:\Users\MRT\.copaw\workspaces\default"
start "" python hermes_deskpet.py
exit
```

## 相关

- [hermes-web-pet](/docs/hermes-web-pet) — Hermes 桌面宠物
- [hermes-agent](/docs/hermes-agent) — Hermes Agent 完整架构
- [mcp-debugging](/docs/mcp-debugging) — 调试方法论

