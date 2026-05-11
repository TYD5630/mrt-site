---
title: "Windows 桌面控制技术"
description: "Windows 桌面控制技术"
pubDate: 2026-05-05
tags: ["windows", "desktop", "automation", "screenshot", "process", "batch", "powershell", "lesson"]
---

# Windows 桌面控制技术

> 通过 Agent 工具（execute_shell_command + desktop_screenshot + browser_use）控制 Windows 桌面的方法合集。
> 覆盖截图、进程管理、批处理脚本、窗口控制、桌面集成等常见操作。

---

## 桌面截图

```python
desktop_screenshot()
# 保存到工作区，返回路径
# 配合 view_image() 让 AI 查看
```

| 场景 | 用法 |
|:-----|:------|
| 全屏截图 | `desktop_screenshot()` |
| 截特定窗口 | `desktop_screenshot(capture_window=True)`（macOS 可用，Windows 全屏） |
| 保存到指定路径 | `desktop_screenshot(path="screenshot.png")` |

**限制**：Windows 下不支持单窗口截图（仅全屏），macOS 支持窗口选取。

---

## 进程与窗口管理

### 启动程序

```bat
:: 启动程序（不阻塞）
start "" "C:\Path\to\program.exe"

:: 带参数启动
start "" "notepad.exe" "file.txt"

:: 启动并指定窗口位置
start "" /MAX "notepad.exe"  :: 最大化
start "" /MIN "notepad.exe"  :: 最小化
```

### 查看进程

```bat
:: 简洁列表
tasklist | findstr "chrome"

:: 查看指定进程 PID
tasklist /fi "imagename eq chrome.exe"

:: 查看端口占用
netstat -ano | findstr :9222
```

### 结束进程

```bat
:: 按名称
taskkill /f /im chrome.exe

:: 按 PID
taskkill /f /pid 12345

:: 按端口（两步：先查PID再kill）
netstat -ano | findstr :9222
taskkill /f /pid <PID>
```

### 窗口状态操作（PowerShell）

```powershell
# 隐藏窗口
powershell -command "(New-Object -ComObject Shell.Application).Windows()"
# 或启动时隐藏
powershell -windowstyle hidden -command "..."

# 置顶窗口（需要第三方工具或 Win32 API）
```

---

## 批处理脚本（.bat）

批处理是 Windows 桌面自动化的基础工具。

### 常用模板

**启动工作区脚本：**
```bat
@echo off
title Hermes Deskpet
cd /d "C:\Users\MRT\.copaw\workspaces\default"
start "" python hermes_deskpet.py
exit
```

**定时/循环脚本：**
```bat
@echo off
:loop
python check_status.py
timeout /t 60 /nobreak >nul
goto loop
```

**带判断脚本：**
```bat
@echo off
if exist "flag.txt" (
    echo Flag exists, proceeding...
    python do_work.py
) else (
    echo No flag, skipping.
)
```

### 实用命令

| 命令 | 用途 | 示例 |
|:-----|:------|:------|
| `start` | 启动程序/文件 | `start "" notepad.exe` |
| `timeout` | 等待 N 秒 | `timeout /t 5 /nobreak >nul` |
| `choice` | 等待按键 | `choice /c YN /n /m "Continue?"` |
| `attrib` | 文件属性 | `attrib +h file.jpg`（隐藏） |
| `xcopy` / `robocopy` | 文件复制 | `robocopy src dst /e` |
| `schtasks` | 计划任务 | 见下文 |

### 开机启动

```bat
:: 方式1：启动文件夹
copy "Hermes浮窗.bat" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\"

:: 方式2：计划任务（管理员）
schtasks /create /tn "HermesDeskpet" /tr "C:\path\Hermes浮窗.bat" /sc onlogon /rl highest

:: 方式3：注册表
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "HermesDeskpet" /t REG_SZ /d "C:\path\Hermes浮窗.bat"
```

---

## 桌面集成模式

### pywebview 浮窗

透明、置顶、无边框的 HTML 渲染窗口。

```python
import webview
window = webview.create_window(
    "Title", url="page.html",
    frameless=True, transparent=True, on_top=True,
)
webview.start(window=window)  # 必须传 callable
```

详见 [pywebview-desktop](/docs/pywebview-desktop)。

### 浏览器可见窗口

```python
browser_use(action="start", headed=True)
```

可用于展示信息面板、实时数据、监控仪表盘等。

详见 [browser-automation-tips](/docs/browser-automation-tips)。

### 桌面快捷方式(.bat)

桌面 `.bat` 文件作为启动入口。右键→编辑即可修改。

```bat
@echo off
cd /d "%~dp0"  :: 切到脚本所在目录
start "" python script.py
exit
```

---

## 文件与属性管理

### 隐藏文件/目录

```bat
:: 隐藏单个文件
attrib +h secret.jpg

:: 隐藏目录（含子文件）
attrib +h D:\temp\secret_folder /s /d

:: 取消隐藏
attrib -h secret.jpg

:: PowerShell 查看隐藏文件
powershell -command "Get-ChildItem -Force D:\temp\"
```

### 文件权限

```bat
:: 查看/修改只读属性
attrib -r file.txt    :: 取消只读
attrib +r file.txt    :: 设为只读

:: 完全控制（需要管理员）
icacls file.txt /grant "%USERNAME%:(F)"
```

---

## 信息查询

### 系统信息

```bat
:: 系统信息
systeminfo | findstr /i "os name"

:: 环境变量
echo %USERNAME%
echo %APPDATA%
echo %TEMP%

:: 磁盘空间
wmic logicaldisk get size,freespace,caption

:: 网络配置
ipconfig | findstr "IPv4"
```

### 剪贴板

```bat
:: 写入剪贴板（需要 clip）
echo some text | clip

:: 读取剪贴板（PowerShell）
powershell -command "Get-Clipboard"
```

---

## 相关页面

- [pywebview-desktop](/docs/pywebview-desktop) — pywebview 桌面浮窗技术
- [browser-automation-tips](/docs/browser-automation-tips) — 浏览器自动化实战
- [copaw-debugging](/docs/copaw-debugging) — CoPaw 调试（含浏览器/桌面问题）
- [hermes-web-pet](/docs/hermes-web-pet) — 桌面宠物（桌面集成案例）

