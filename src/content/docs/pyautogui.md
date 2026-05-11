---
title: "pyautogui"
description: "pyautogui"
sidebar:
  order: 50
  label: "pyautogui"
tags: ["python", "gui", "automation", "cross-platform", "desktop", "screenshot"]
---

# pyautogui

跨平台 GUI 自动化 Python 库。模拟鼠标移动/点击、键盘输入、屏幕截图、图像识别。
⭐ 12.5k · asweigart/pyautogui

---

## 概述

pyautogui 是最流行的 Python GUI 自动化库之一。核心优势是**跨平台**（Windows/macOS/Linux）
和**简单**——几行代码就能控制鼠标键盘。

## 核心能力

| 能力 | 说明 |
|:-----|:------|
| 鼠标控制 | 移动、点击、拖拽、滚动 |
| 键盘控制 | 输入、快捷键、组合键 |
| 屏幕截图 | 全屏/区域截图 |
| 图像识别 | 在屏幕上找图并定位 |
| 防失控 | fail-safe（鼠标移到角落暂停） |

## 典型用法

```python
import pyautogui

# 鼠标
pyautogui.moveTo(100, 200, duration=1)  # 移动
pyautogui.click(100, 200)                # 点击
pyautogui.drag(0, 50, duration=0.5)      # 拖拽

# 键盘
pyautogui.write("Hello", interval=0.1)
pyautogui.hotkey("ctrl", "s")            # 快捷键

# 截图与找图
loc = pyautogui.locateOnScreen("button.png")
if loc:
    pyautogui.click(loc)

# 安全
pyautogui.FAILSAFE = True  # 鼠标移到左上角暂停
```

## 局限

- **依赖屏幕分辨率**：在不同分辨率下坐标/截图匹配可能失效
- **无法深入控件**：只能操作坐标，不能读取控件文本/属性
- **后台不可用**：需要激活目标窗口

## 与 pywinauto 配合

pyautogui 适合"看见什么点什么"的场景，pywinauto 适合"找到输入框再填"的场景。
两者互补，可混合使用。

## 相关

- [pywinauto](/docs/pywinauto) — Windows 原生 GUI 自动化
- [desktop-control](/docs/desktop-control) — Windows 桌面控制技术
- [copaw-notes](/docs/copaw-notes) — CoPaw 知识库

