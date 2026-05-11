---
title: "pywinauto"
description: "pywinauto"
sidebar:
  order: 50
  label: "pywinauto"
tags: ["python", "windows", "gui", "automation", "desktop", "testing", "uia"]
---

# pywinauto

Windows GUI 自动化 Python 库。基于 UIA（UI Automation）和 Win32 API，
通过控件属性（文本、ID、class）而非屏幕坐标定位操作目标。
是 Windows 桌面 AI 控制的首选执行层。
⭐ 6.0k · pywinauto/pywinauto

---

## 概述

pywinauto 是 Windows 原生 GUI 自动化的不二之选。区别于 pyautogui
的"截图→找图→点坐标"方案，pywinauto 直接读取 Windows 的控件树，
按控件属性定位——分辨率变了也不影响。

## 后端选择

```python
# UIA 后端（推荐 — 支持 WinForms/WPF/UWP/Modern UI）
app = Application(backend="uia").start("notepad.exe")

# Win32 后端（传统 Win32 控件，旧应用）
app = Application(backend="win32").start("notepad.exe")
```

| 后端 | 适用场景 | 能力 |
|:-----|:---------|:------|
| UIA | 新式应用（WPF/UWP/Electron） | 控件树完整，支持后台操作 |
| Win32 | 旧式应用（MFC/Win32 API） | 稳定，但控件信息有限 |

**优先用 UIA**，只有 UIA 覆盖不到时才切 Win32。

## 核心模式

```python
# 连接已有进程
app = Application(backend="uia").connect(process=1234)
app = Application(backend="uia").connect(title_re=".*记事本.*")

# 启动新进程
app = Application(backend="uia").start("notepad.exe")

# 定位窗口
dlg = app.window(title_re=".*记事本.*")

# 定位控件并操作
dlg.Edit.type_keys("Hello", with_spaces=True)
dlg.Button("确定").click()
```

## 常用操作全集

### 窗口操作

```python
dlg.maximize()           # 最大化
dlg.minimize()           # 最小化
dlg.close()              # 关闭
dlg.move_window(x, y)    # 移动
dlg.set_focus()          # 激活
```

### 控件定位

```python
# 按文本
dlg.child_window(title="确定", control_type="Button")

# 按 class
dlg.child_window(class_name="Edit")

# 按 automation_id（最稳定）
dlg.child_window(auto_id="txtUserName")

# 按类型+索引
dlg.child_window(control_type="Edit", found_index=0)

# 通配符
dlg.child_window(title_re=".*保存.*")
```

### 控件操作

```python
# 文本
ctrl.type_keys("Hello", with_spaces=True)   # 输入
ctrl.set_window_text("Hello")               # 设置文本（不模拟按键）
text = ctrl.window_text()                   # 读取文本

# 选择
combo = dlg.ComboBox
combo.select("选项2")                        # 下拉选择

# 列表
dlg.ListBox.GetItem("item1").click()        # 列表项点击

# 菜单
dlg.menu_select("文件->另存为")               # 菜单操作

# 状态
ctrl.is_enabled()         # 是否可用
ctrl.is_visible()         # 是否可见
ctrl.exists()             # 是否存在
ctrl.wait("visible", timeout=10)  # 等待出现
```

## 与 AI 的结合 —— LLM + pywinauto 工作流

这是 [windows-ai-automation](/docs/windows-ai-automation) 的核心执行层：

```
LLM 分析截图 → "点击确定按钮" → pywinauto 定位并点击
                                 ↓
                           返回操作结果 → LLM 再次截图确认
```

关键在于 pywinauto 的**控件定位不依赖坐标**，LLM 只需要告诉它
"找标题为'确定'的按钮"，它就能稳稳定位——不受分辨率/窗口位置影响。

## 相关

- [windows-ai-automation](/docs/windows-ai-automation) — Windows AI 桌面控制实操指南
- [pyautogui](/docs/pyautogui) — 跨平台 GUI 自动化（坐标/图像方案）
- [desktop-control](/docs/desktop-control) — Windows 桌面控制基础
- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化总览
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库

