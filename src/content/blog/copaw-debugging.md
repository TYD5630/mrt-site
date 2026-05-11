---
title: "CoPaw 调试知识库"
description: "CoPaw 调试知识库"
pubDate: 2026-05-05
tags: ["copaw", "debugging", "gbk", "mcp", "browser", "pywebview", "yt-dlp", "plugin", "skill", "lesson"]
---

# CoPaw 调试知识库

> CoPaw 在 Windows 环境下的调试经验汇总。
> 大部分问题源于 Windows 的 GBK 编码、PATH 差异、以及 PyInstaller 打包分发带来的限制。
> 每次遇到新问题，先查这里。

---

## 目录

- [GBK 编码故障（头号杀手）](#gbk-编码故障头号杀手)
- [Python 路径问题](#python-路径问题)
- [浏览器自动化调试](#浏览器自动化调试)
- [pywebview 桌面浮窗](#pywebview-桌面浮窗)
- [yt-dlp 视频下载](#yt-dlp-视频下载)
- [MCP 调试](#mcp-调试)
- [技能加载调试](#技能加载调试)
- [插件调试](#插件调试)
- [看板调试](#看板调试)
- [看板 Kanban 调试](#看板-kanban-调试)
- [ACP 外部 Agent 调试](#acp-外部-agent-调试)
- [记忆系统调试](#记忆系统调试)
- [会话上下文调试](#会话上下文调试)
- [通用排错流](#通用排错流)

---

## GBK 编码故障（头号杀手）

### 症状

终端输出包含 emoji 或非 ASCII Unicode 时进程崩溃：

```
UnicodeEncodeError: 'gbk' codec can't encode character '\U0001f3d7'
in position 2: illegal multibyte sequence
```

### 根因

Windows 终端默认编码为 GBK（cp936），Python 的 `print()` 默认
使用系统编码。任何超出 GBK 范围的 Unicode 字符都会抛异常。

### 影响范围

| 场景 | 具体问题 |
|:-----|:---------|
| Python print() | print("🏗️") → GBK 崩溃 |
| yt-dlp 进度条 | 进度条 Unicode 渲染失败 |
| 文件路径 | 包含中文/日文的路径打印 |
| Python 脚本输出 | read_file 中的 emoji 回显 |
| pip install 输出 | 彩色进度条在重定向时也报错 |

### 解决方案

**方案 A：纯文本替代（最可靠）**
```python
# ❌ 崩溃
print("🏗️ Wiki 审计报告")

# ✅ 安全
print("[AUDIT] Wiki 审计报告")
print("[严重] / [警告] / [提示]")  # 替代 🔴 🟡 ⚪
```

**方案 B：重定向 stdout**
```bat
python script.py > output.log 2>&1
type output.log  # 通过文件查看，不走终端编码
```

**方案 C：设置环境变量（不总是有效）**
```bat
set PYTHONIOENCODING=utf-8
python script.py
```

**方案 D：二进制模式输出**
```python
import sys
sys.stdout.reconfigure(encoding='utf-8')  # Python 3.7+
```

**经验教训**：对于要反复运行的脚本（如 wiki-audit.py），
直接在所有输出中避免 emoji，用 ASCII 替代。一次修改，永远安全。

---

## Python 路径问题

### python3 不可用

```bash
# ✅ 可用
python

# ❌ 崩溃
python3
```

当前环境：Python 3.12 (`C:\Users\MRT\AppData\Local\Programs\Python\Python312\python.exe`)

### pip 包安装位置

pip 安装的可执行文件在对应 Python 版本的 `Scripts\` 目录下：
```
C:\Users\MRT\AppData\Local\Programs\Python\Python312\Scripts\
```

### 模块找不到

```
ModuleNotFoundError: No module named 'copaw'
```

CoPaw 不是 pip 包，是 PyInstaller 单二进制分发。不能 `import copaw`。

---

## 浏览器自动化调试

### Headless → CAPTCHA

**现象**：无头浏览器访问 Google 等站点时触发 CAPTCHA。
**解决**：用 headed 模式（可见浏览器窗口）绕过。

```python
# ✅ 可见浏览器
browser_use(action="start", headed=True)

# ❌ headless 模式可能触发 CAPTCHA
browser_use(action="start", headed=False)
```

### CDP 共享

**现象**：需要连接到已运行的 Chrome 浏览器。
**解决**：用 `connect_cdp` + `list_cdp_targets` 扫描端口。

```python
# 扫描本地 CDP 端口
browser_use(action="list_cdp_targets", port_min=9222, port_max=9222)

# 连接
browser_use(action="connect_cdp", cdp_url="http://localhost:9222")
```

### 浏览器单例限制

同一 workspace 同时只能运行一个浏览器。需要切换页面时用
`page_id` 参数管理多标签：

```python
browser_use(action="open", url="https://example.com", page_id="tab1")
browser_use(action="open", url="https://example.org", page_id="tab2")
```

### 截图与快照

`snapshot` 输出 DOM 结构可用于后续 `click`/`type` 的 `ref` 参数。
`screenshot` 用于视觉验证（可配合 `view_image` 查看）。

---

## pywebview 桌面浮窗

### 常见崩溃

| 错误 | 原因 | 修复 |
|:-----|:------|:------|
| 进程闪退（无错误） | `webview.start("标题")` 传了字符串 | `webview.start(window=window)` 传 callable |
| 窗口不透明 | 缺 `transparent=True` | 创建时加 transparent=True |
| 窗口没置顶 | 缺 `on_top=True` | 创建时加 on_top=True |

### 正确启动模板

```python
import webview

window = webview.create_window(
    "标题",
    url="page.html",
    frameless=True,
    transparent=True,   # 透明背景
    on_top=True,        # 置顶
)

# 关键：start() 第一个参数必须是 callable！
webview.start(window=window)  # ✅
# webview.start("标题")       # ❌ 进程闪退
```

### 鼠标穿透切换

通过 Windows API `WS_EX_TRANSPARENT` 实现右键切换点击穿透模式。
方便在工作时让浮窗"透明存在"。

---

## yt-dlp 视频下载

### 命令不可用

Windows pip 安装后，`yt-dlp` 命令可能不在 PATH 中（或需要重启终端）。

```bash
# ✅ 模块方式（总是可用）
py -3 -m yt_dlp [options] URL

# ❌ 可能找不到
yt-dlp [options] URL
```

### GBK 编码崩溃

yt-dlp 输出包含 Unicode 进度条等，在 GBK 终端崩溃。

```bash
# 方案 1：禁用进度条
py -3 -m yt_dlp --no-progress [options] URL

# 方案 2：重定向输出
py -3 -m yt_dlp [options] URL > log.txt 2>&1

# 方案 3：设置编码
set PYTHONIOENCODING=utf-8
py -3 -m yt_dlp [options] URL
```

### 格式选择

```bash
# 1080p 最佳质量
py -3 -m yt_dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" URL

# 720p 简单模式
py -3 -m yt_dlp -f "best[height<=720]" URL

# 按高度排序
py -3 -m yt_dlp -S "height:1080" URL
```

---

## MCP 调试

### MCP 工具不显示

1. 检查 `config.json` 中 `mcp.clients` 配置
2. 确认 `enabled: true`
3. 检查 `command` 和 `args` 路径是否正确
4. 查看 `copaw.log` 中的 MCP 连接错误

### stdio 传输超时

MCP 通过 stdio 与子进程通信，子进程启动慢或崩溃会导致超时。

```json
{
  "mcp": {
    "clients": {
      "brain": {
        "transport": "stdio",
        "command": "node",
        "args": ["path/to/server.js"],
        "enabled": true
      }
    }
  }
}
```

**排查步骤：**
1. 手动运行命令确认能启动：`node path/to/server.js`
2. 检查 args 路径是否正确（Windows 路径中的反斜杠需要用双反斜杠或正斜杠）
3. 查看 copaw.log 中的 MCP 相关错误

### MCP vs 内置工具

内置工具（execute_shell、read_file 等）直接注册在 Agent 中。
MCP 工具通过外部进程提供。两者在 LLM 视角都是工具，但 MCP 工具
通过 stdio/HTTP 协议通信，有额外延迟。

---

## 技能加载调试

### 技能不生效

**排查链：**
1. 技能目录是否存在？ → `skills/<name>/SKILL.md`
2. INDEX.md 中有没有？ → `skills/INDEX.md`
3. AGENTS.md 关键词表配了没？ → AGENTS.md「关键词匹配规则」
4. SKILL.md 格式是否正确？

### SKILL.md 格式

```markdown
---
name: skill-name
description: "..."
metadata:
  copaw:
    emoji: "🔧"
    requires: {}
---

# Skill Name

内容...
```

- 必须包含 YAML frontmatter
- `name` 字段与目录名一致
- frontmatter 后跟 `# {name}` 标题

### 关键词不命中

AGENTS.md 维护一个关键词匹配表，用户输入的关键词控制加载哪些技能。
如果新技能加载不了，检查 AGENTS.md 关键词表是否匹配。

---

## 插件调试

### 插件不加载

1. 确认 `~/.copaw/plugins/<name>/plugin.json` 存在且格式正确
2. 确认 `plugin.py` 导入了必要的模块
3. 查看 `copaw.log` 中的插件加载错误
4. 尝试重启 CoPaw 进程

### plugin.json 格式示例

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "hooks": {
    "on_tool_call": "on_tool_call"
  },
  "providers": [],
  "commands": {}
}
```

### 钩子不触发

1. 确认 `hooks` 字段的方法名与 plugin.py 中的函数名一致
2. 确认钩子签名正确（如 `on_tool_call(tool_name, params)`）
3. 检查 plugin.py 中没有语法错误（可用 `python -c "import plugin"` 测试）
4. 查看 copaw.log 中是否有异常堆栈

---

## 看板调试

### kanban.db 锁

看板使用 SQLite，并发访问时可能出现数据库锁错误。

**解决：** 等待几秒后重试。Kanban 插件有心跳机制（15 分钟 TTL），
长时间不心跳的任务会被自动释放。

### Claim 超时

Claim 的 TTL 默认 15 分钟。Worker Agent 需每 10 分钟调用
`kanban_heartbeat()` 避免超时释放。

```python
# Worker 必须定期心跳
kanban_heartbeat(task_id="<id>", agent="default")
```

### 状态机卡住

```
triage → todo → ready → running → done → archived
                ↑_________|  |
                    unblock   blocked → ready
```

如果任务卡在某个状态，手动调用 `kanban_move()` 或 `kanban_release()`
强制迁移。

---

## ACP 外部 Agent 调试

### 外部 Agent 不响应

ACP 用于调用外部代码 Agent（opencode / qwen_code / claude_code / codex）。

**排查：**
1. `config.json` 中 `acp.agents` 配置是否正确？
2. 外部 Agent 命令本身是否可用？（`opencode --help`）
3. 查看 `copaw.log` 中的 ACP 连接错误
4. 确认 `enabled: true`

---

## 记忆系统调试

### memory_search 不命中

1. 确认搜索的 query 与记忆内容语义匹配
2. memory_search 基于文本匹配（非语义），检查关键词是否一致
3. 检查 memory/ 目录下文件是否包含搜索内容
4. 跨会话记忆需要 MEMORY.md（长期记忆）文件存在

### 记忆文件被覆盖

**问题**：`write_file` 直接覆盖已有文件内容。

**解决**：操作前先用 `read_file` 读取原内容，再用 `edit_file`
做局部修改或追加。

### 记忆不持久

每会话全新启动。记忆只存在于文件系统中：
- memory/YYYY-MM-DD.md → 每日原始记录
- MEMORY.md → 长期精华记忆
- PROFILE.md → 用户画像

Brain MCP 通过 SQLite 提供额外持久化（决策/任务/工具经验）。

---

## 会话上下文调试

### Token 超限

当会话内容过多时，上下文管理器自动触发：

- **offload**：将早期对话卸载到文件存储
- **pruning**：移除低优先级消息

**表现**：AI 突然"失忆"——不记得早些时候的对话。

**解决**：用 `brain_inject()` 重新注入上下文，或用
`brain_cross_session_reason()` 跨会话检索。

### 文件读取截断

`read_file` 输出长文件时可能被截断（tool result 大小限制）。
长文件分段读取：`read_file(file="...", start_line=1, end_line=100)`。

---

## 通用排错流

遇到任何 CoPaw 相关问题，按此顺序排查：

```
问题
  │
  ├─① logs 先看
  │   cat ~/.copaw/copaw.log | tail -50
  │   cat ~/.copaw/qwenpaw.log | tail -50
  │
  ├─② 配置检查
  │   type ~/.copaw/config.json | 检查相关模块是否 enabled
  │
  ├─③ 环境验证
  │   python --version
  │   pip list | find "依赖包名"
  │   which copaw / where copaw
  │
  ├─④ 最小复现
  │   隔离问题到最小单元，排除干扰
  │
  └─⑤ 降级/换方案
       GBK → 纯文本
       命令不可用 → 模块方式
       headless → headed
       webview 闪退 → callable 参数
```

---

## 相关页面

- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库主页面
- [copaw-plugin-system](/docs/copaw-plugin-system) — 插件系统详解
- [mcp-debugging](/docs/mcp-debugging) — MCP 调试方法论
- [pywebview-desktop](/docs/pywebview-desktop) — 桌面浮窗技术
- [yt-dlp-usage](/docs/yt-dlp-usage) — 视频下载模式
- [hermes-agent](/docs/hermes-agent) — Hermes Agent 架构

