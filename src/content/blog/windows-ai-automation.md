---
title: "Windows AI 桌面控制实操指南"
description: "Windows AI 桌面控制实操指南"
pubDate: 2026-05-05
tags: ["windows", "ai", "desktop", "automation", "pywinauto", "uia", "practice", "lesson"]
---

# Windows AI 桌面控制实操指南

> 前面 [ai-desktop-automation](/docs/ai-desktop-automation) 讲了理论框架，这里讲怎么在 Windows 上真干。
> 从无障碍 API 到 LLM 驱动，从 CoPaw 集成到脚本实现，一步步落地。

---

## Windows 桌面自动化的四种技术路线

```
路线                       原理                         适用场景
──────────────────────────────────────────────────────────────────────
① 坐标/图像（pyautogui）   截图找图→坐标点击            游戏/自定义控件
② 控件属性（pywinauto）   UIA/Win32 API→控件定位       标准 Windows 应用
③ 浏览器（Playwright）    DOM/CSS→元素操作             Web 应用
④ 键盘快捷键（AHK/bat）   模拟热键/命令                快捷操作/批处理
```

在 Windows 上做 AI 桌面控制，最优策略是**以②为主，①③④为辅**。

---

## 路线详解

### ① pyautogui（坐标/图像）

```python
import pyautogui

# 找图点击
loc = pyautogui.locateOnScreen('button.png', confidence=0.8)
if loc:
    pyautogui.click(loc)

# 按坐标
pyautogui.click(500, 300)

# 拖拽
pyautogui.drag(0, 200, duration=0.5)
```

**AI 配合方式**：LLM 分析截图 → 给出坐标 → pyautogui 执行

**局限**：分辨率依赖、多显示器混乱、后台不可用

### ② pywinauto（控件属性）— 推荐首选

```python
from pywinauto import Application
from pywinauto.findwindows import ElementNotFoundError

# 附加已有窗口
app = Application(backend="uia").connect(title_re=".*记事本.*")

# 或启动新进程
app = Application(backend="uia").start("notepad.exe")

# 定位窗口
dlg = app.window(title_re=".*记事本.*")

# 控件操作（按文本/ID/class 定位）
dlg.Edit.type_keys("Hello from AI", with_spaces=True)

# 点击按钮
dlg.Button("确定").click()

# 获取控件状态
edit_ctrl = dlg.Edit
print(edit_ctrl.window_text())      # 读取文本
print(edit_ctrl.is_enabled())       # 是否可用
```

**为什么推荐 pywinauto：**
- ✅ 不依赖屏幕坐标（分辨率变化不影响）
- ✅ 能读取控件内容（不是盲点）
- ✅ 支持后台操作（窗口最小化也能操作）
- ✅ Windows 原生支持（底层 UIA/Win32 API）
- ❌ 不适用于游戏/自定义控件（无标准控件）

**后端选择：**
```python
# UIA 后端（推荐，支持 WinForms/WPF/UWP）
app = Application(backend="uia").connect(...)

# Win32 后端（传统 Win32 控件）
app = Application(backend="win32").connect(...)
```

UIA 比 Win32 能定位更多控件，优先用 UIA。

### ③ Playwright 浏览器

浏览器有完整的 DOM 结构，是 AI 桌面控制里"最好操作"的目标。

参考 [browser-automation-tips](/docs/browser-automation-tips)。

### ④ 键盘快捷键 / AHK

```python
import pyautogui

pyautogui.hotkey("win", "r")       # 打开运行
pyautogui.hotkey("alt", "tab")     # 切换窗口
pyautogui.hotkey("ctrl", "s")      # 保存
pyautogui.press("enter")           # 回车
pyautogui.press("tab", presses=3)  # Tab 三次
```

---

## UIA 详解（Windows 无障碍 API）

UIA（UI Automation）是 Windows 的控件树接口。
pywinauto 底层通过 UIA 获取整个桌面的控件树结构。

### 控件树遍历

```python
from pywinauto import Desktop

# 获取桌面控件树
desktop = Desktop(backend="uia")

# 遍历所有顶层窗口
for w in desktop.windows():
    print(f"{w.window_text()} | {w.class_name()}")

# 递归遍历控件
def dump_controls(elem, depth=0):
    print("  " * depth + f"{elem.element_info.control_type}: '{elem.window_text()[:30]}'")
    for child in elem.children():
        dump_controls(child, depth + 1)

dump_controls(desktop)
```

### 常用控件类型

| UIA Control Type | pywinauto 访问方式 | 说明 |
|:-----------------|:-------------------|:------|
| Edit | `.Edit` 或 `.child_window(control_type="Edit")` | 文本输入框 |
| Button | `.Button("确定")` | 按钮 |
| ComboBox | `.ComboBox` | 下拉框 |
| ListBox / ListItem | `.ListBox` | 列表 |
| CheckBox | `.CheckBox` | 复选框 |
| TabItem | `.TabControl` | 标签页 |
| Menu | `.Menu` | 菜单 |
| DataGrid | `.DataGridView` | 表格 |

### 常用定位方式

```python
# 按文本
dlg.child_window(title="确定", control_type="Button")

# 按 class
dlg.child_window(class_name="Edit")

# 按 automation_id
dlg.child_window(auto_id="txtUserName")

# 组合
dlg.child_window(title="用户名", control_type="Edit", found_index=0)
```

---

## LLM + pywinauto：AI 驱动桌面控制

核心流程：

```python
"""
1. 截图 → 给 LLM 看
2. LLM 分析 → 输出要操作的目标描述
3. pywinauto 根据描述定位并操作控件
"""

import pyautogui
from pywinauto import Application, Desktop

# 步骤1：截图
screenshot = pyautogui.screenshot()
screenshot.save("screen.png")

# 步骤2：（伪代码 — LLM 分析截图，返回操作指令）
# LLM response: "点击确定按钮" / "在搜索框输入 hello"

# 步骤3：pywinauto 执行
def click_button(window_title, button_text):
    """AI 调用这个函数执行桌面操作"""
    try:
        app = Application(backend="uia").connect(title_re=window_title)
        dlg = app.window(title_re=window_title)
        btn = dlg.child_window(title=button_text, control_type="Button")
        btn.click()
        return {"status": "ok", "action": f"click {button_text}"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}

def type_text(window_title, control_title, text):
    """AI 调用这个函数在指定控件输入文本"""
    try:
        app = Application(backend="uia").connect(title_re=window_title)
        dlg = app.window(title_re=window_title)
        ctrl = dlg.child_window(title=control_title, control_type="Edit")
        ctrl.type_keys(text, with_spaces=True)
        return {"status": "ok", "action": f"type '{text}' into {control_title}"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}
```

这样 LLM 负责"理解画面、决定操作"，pywinauto 负责"稳定执行"。

---

## 在 CoPaw 中实现

### 方案一：通过 execute_shell 调用

```python
# Agent 调用这个来执行桌面操作
execute_shell_command(
    f'python -c "from pywinauto import Application; '
    f'app = Application(backend=\\\"uia\\\").connect(title_re=.*记事本.*); '
    f'app.window(title_re=.*记事本.*).Edit.type_keys(\\\"Hello\\\", with_spaces=True)"'
)
```

缺点：命令字符串转义麻烦。

### 方案二：注册为 MCP 工具（推荐）

写一个简单的 MCP Server，暴露桌面操作函数：

```python
# desktop_agent_mcp.py
from pywinauto import Application
import json, sys

def handle_request(request):
    action = request.get("action")
    if action == "click_button":
        app = Application(backend="uia").connect(title_re=request["window"])
        app.window(title_re=request["window"])\
           .child_window(title=request["button"], control_type="Button").click()
        return {"status": "ok"}
    elif action == "type_text":
        app = Application(backend="uia").connect(title_re=request["window"])
        app.window(title_re=request["window"])\
           .child_window(title=request["control"], control_type="Edit")\
           .type_keys(request["text"], with_spaces=True)
        return {"status": "ok"}
    # ... 更多操作

# MCP stdio 协议循环
for line in sys.stdin:
    req = json.loads(line)
    result = handle_request(req)
    print(json.dumps(result), flush=True)
```

然后配置到 `config.json` 的 `mcp.clients` 中。

### 方案三：写一个 Python 工具脚本

```python
# desktop_tools.py — 供 execute_shell_command 调用的工具函数
import sys, json, pyautogui
from pywinauto import Application

def click(window, button):
    app = Application(backend="uia").connect(title_re=window)
    app.window(title_re=window).child_window(title=button, control_type="Button").click()
    return "ok"

def type_text(window, control, text):
    app = Application(backend="uia").connect(title_re=window)
    app.window(title_re=window).child_window(title=control, control_type="Edit").type_keys(text, with_spaces=True)
    return "ok"

def screenshot():
    pyautogui.screenshot().save("screen.png")
    return "screenshot saved"

if __name__ == "__main__":
    cmd = json.loads(sys.argv[1])
    fn = globals().get(cmd["action"])
    if fn:
        result = fn(**cmd.get("params", {}))
        print(json.dumps({"status": result}))
    else:
        print(json.dumps({"status": "error", "msg": f"unknown action: {cmd['action']}"}))
```

调用方式：
```bash
python desktop_tools.py '{"action": "click", "params": {"window": "记事本", "button": "确定"}}'
```

---

## Windows 特有坑点

| 问题 | 原因 | 解决 |
|:-----|:------|:------|
| UIA 控件找不到 | 64位应用和32位不互通 | 确认 Python 位数和应用的位数一致 |
| 权限不足 | 部分 UIA 操作需要管理员 | 以管理员身份运行 Python |
| 多显示器坐标系 | pyautogui 在多屏下坐标偏移 | 用 `pyautogui.size()` 确认屏幕尺寸 |
| 控件文本乱码 | 中文字符编码问题 | 确保 Python 编码为 UTF-8 |
| 窗口未激活 | Win32 操作需要窗口在前台 | pywinauto 的 UIA 支持后台操作 |
| 杀软拦截 | pywinauto 操作可能被误报 | 添加白名单 |

## 相关页面

- [ai-desktop-automation](/docs/ai-desktop-automation) — AI 桌面控制自动化总览
- [desktop-control](/docs/desktop-control) — Windows 桌面控制基础
- [pywinauto](/docs/pywinauto) — Windows GUI 自动化详解
- [pyautogui](/docs/pyautogui) — 跨平台 GUI 自动化
- [browser-automation-tips](/docs/browser-automation-tips) — 浏览器自动化
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库
- [DesktopCommanderMCP](/docs/desktopcommandermcp) — 桌面控制 MCP Server

