---
title: "AI 桌面控制自动化（Computer Use）"
description: "AI 桌面控制自动化（Computer Use）"
pubDate: 2026-05-05
tags: ["ai", "desktop", "automation", "computer-use", "agent", "vision", "control"]
---

# AI 桌面控制自动化（Computer Use）

> 让 AI 直接操作电脑屏幕——看画面、点按钮、敲键盘、填表单。
> 这是 Agent 从"对话"走向"动手"的关键能力。

---

## 什么是 Computer Use

Computer Use 是让 AI Agent 像人一样操作电脑的技术栈：

```
人眼看屏幕 → 大脑理解 → 手操作鼠标键盘
      ↓           ↓            ↓
 截图/录屏 → LLM/VLM 理解 → 控制鼠标键盘
```

相比传统 RPA（基于固定规则/坐标），AI Computer Use 的突破在于：

- **视觉理解**：直接"看"屏幕，不依赖 DOM/API
- **自然语言指令**："帮我订一张去北京的机票"
- **自适应**：页面布局变了也能应对

---

## 技术栈

```
┌─────────────────────────────────────────┐
│              应用层                      │
│  CUA / Agent-S / bytebot / screenpipe   │
├─────────────────────────────────────────┤
│              控制层                      │
│  pyautogui / pywinauto / AHK / Playwright│
├─────────────────────────────────────────┤
│              感知层                      │
│  截图（desktop_screenshot）             │
│  OCR（Tesseract / Windows OCR）         │
│  UI 树（Accessibility API）             │
├─────────────────────────────────────────┤
│              模型层                      │
│  GPT-4o / Claude Sonnet / Fara-7B       │
│  专用 CUA 模型（Anthropic/OpenAI）      │
└─────────────────────────────────────────┘
```

### 感知层
- **截图**：全屏/窗口截图，传给多模态模型
- **OCR**：识别屏幕上的文字（按钮文本、表单标签）
- **UI 树**：通过无障碍 API（Windows UIA / macOS Accessibility）获取控件结构

### 控制层
- **鼠标**：pyautogui / pywinauto 控制点击、移动、拖拽
- **键盘**：输入文本、快捷键、组合键
- **浏览器**：Playwright 自动化（比桌面控制更稳定）

### 模型层
| 方案 | 模型 | 特点 |
|:-----|:------|:------|
| Anthropic Computer Use | Claude Sonnet | 内置 Computer Use API，官方支持 |
| OpenAI CUA | GPT-4o | 内置操作电脑能力 |
| 开源 CUA | Fara-7B / ScaleCUA | 可本地部署，精度较低 |
| 通用 VLM | GPT-4o / Claude | 看截图+描述操作，通过工具执行 |

---

## 主要框架对比

| 框架 | ⭐ | 定位 | 平台 | 是否需要 GPU |
|:-----|:---|:-----|:------|:------------|
| [cua](/docs/cua) | 15.6k | CUA 基础设施（沙箱/SDK） | 跨平台 | ❌ |
| [Agent-S](/docs/agent-s) | 11k | 开源 Agent 框架 | 跨平台 | ❌ |
| [bytebot](/docs/bytebot) | 11k | 自托管桌面 Agent | 跨平台 | ❌ |
| [screenpipe](/docs/screenpipe) | 18.5k | 24/7 屏幕+音频录制 | 跨平台 | ❌ |
| Fara-7B | 5k | 专用 CUA 模型 | - | ✅ |
| pywinassistant | 1.3k | Windows ANI Agent | Windows | ❌ |

---

## 在 CoPaw 中的实践

### 方案一：手动 Computer Use（当前能力）

已有的 CoPaw 工具组合就能实现基本的"AI 操作桌面"：

```python
# 1. 截图感知
desktop_screenshot(path="screen.png")
view_image(image_path="screen.png")

# 2. AI 分析截图 → 决定操作
# （模型看到截图后，决定下一步操作）

# 3. 执行操作
execute_shell_command("python -c \"import pyautogui; pyautogui.click(100, 200)\"")
```

优点是零额外依赖，缺点是"看一次截图画一次饼"——没有持续观察反馈。

### 方案二：集成 CUA 框架

安装专业 Computer Use 框架（如 bytebot 或 cua），
让 CoPaw 调用它的 API 来执行桌面任务。

### 方案三：MCP 桥接

通过 MCP Server 暴露桌面操作工具，Agent 直接调用：
```
Agent → MCP DesktopCommander → pyautogui/pywinauto → 桌面操作
```

参考：[DesktopCommanderMCP](/docs/desktopcommandermcp)（6k⭐，Claude 的桌面控制 MCP Server）

---

## 当前局限

| 问题 | 说明 |
|:-----|:------|
| 延迟 | 截图→理解→操作 的循环比人慢（~2-5s/步） |
| 精度 | 坐标点击在分辨率变化时失效 |
| 安全 | AI 操作电脑有风险（误操作/隐私） |
| 上下文 | 长任务需要持续观察屏幕变化 |
| Windows 支持 | 大部分框架优先 macOS/Linux |

---

## 与其他页面的关系

- [desktop-control](/docs/desktop-control) — Windows 桌面控制技术（批处理/进程/浮窗）
- [pywinauto](/docs/pywinauto) — Windows GUI 自动化（控件定位）
- [pyautogui](/docs/pyautogui) — 跨平台 GUI 自动化（鼠标键盘）
- [browser-automation-tips](/docs/browser-automation-tips) — 浏览器自动化
- [copaw-debugging](/docs/copaw-debugging) — 调试指南
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库

