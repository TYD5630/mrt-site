---
title: "CoPaw 平台知识库"
description: "CoPaw 平台知识库"
sidebar:
  order: 50
  label: "CoPaw 平台知识库"
tags: ["copaw", "configuration", "debugging", "mcp", "plugin", "cli", "skill", "architecture", "agent", "lesson"]
---

# CoPaw 平台知识库

> CoPaw 是一个基于 Qwen 的 Agent 平台（曾用名 QwenPaw / OpenClaw）。
> 当前版本为 PyInstaller 打包的单二进制分发（`D:\QwenPaw\Scripts\copaw.exe`，Python 3.10 构建）。
> 支持多 Agent、多频道通信、技能系统、MCP 协议、插件机制、看板协作。

---

## 架构概览

```
┌─────────────────────────────────────────┐
│              copaw.exe                  │  ← PyInstaller 单文件分发
│  ┌─────────────────────────────────────┐│
│  │  Core Engine                       ││
│  │  ├─ Tool Registry (built-in)       ││  ← execute_shell / read_file / browser_use 等
│  │  ├─ Skill Manager                  ││  ← skills/ 目录加载 SKILL.md
│  │  ├─ Plugin Loader                  ││  ← ~/.copaw/plugins/ 加载 plugin.json+py
│  │  ├─ MCP Client Manager             ││  ← config.json mcp.clients 中配置
│  │  ├─ Memory System (reme-light)     ││  ← memory_manager_backend
│  │  ├─ Context Manager                ││  ← light_context (offload/pruning)
│  │  ├─ Channel Dispatcher             ││  ← dingtalk / console / imessage 等
│  │  ├─ ACP Agent Runner               ││  ← opencode / qwen_code / claude_code / codex
│  │  └─ Cron Scheduler                 ││  ← 定时任务
│  └─────────────────────────────────────┘
└─────────────────────────────────────────┘
```

### 关键目录

| 路径 | 说明 |
|:-----|:------|
| `~/.copaw/config.json` | 全局配置（频道/MCP/Agent/工具/插件） |
| `~/.copaw/settings.json` | 运行时设置 |
| `~/.copaw/workspaces/default/` | 当前工作区 |
| `~/.copaw/workspaces/default/skills/` | 技能目录（SKILL.md + DESCRIPTION.md） |
| `~/.copaw/workspaces/default/memory/` | 每日记忆（YYYY-MM-DD.md） |
| `~/.copaw/workspaces/default/dialog/` | 对话日志（YYYY-MM-DD.jsonl） |
| `~/.copaw/plugins/` | 插件目录（plugin.json + plugin.py） |
| `~/.copaw/skill_pool/` | 技能池（官方技能仓库的本地缓存） |
| `~/.copaw/kanban.db` | 看板 SQLite 数据库 |
| `~/.copaw/token_usage.json` | Token 用量统计 |
| `~/.copaw/copaw.log` | 运行日志 |
| `~/.copaw/qwenpaw.log` | QwenPaw 日志 |
| `~/.copaw/.telemetry_collected` | 遥测标记文件 |

---

## 配置系统

配置文件位于 `~/.copaw/config.json`，JSON 格式，核心模块：

### Agent 配置

```json
{
  "agents": {
    "active_agent": "default",
    "agent_order": ["default"],
    "profiles": {
      "default": {
        "id": "default",
        "workspace_dir": ".../workspaces/default",
        "enabled": true
      }
    },
    "running": {
      "max_iters": 100,
      "llm_retry_enabled": true,
      "llm_max_retries": 3,
      "max_input_length": 1048576,
      "history_max_length": 10000
    },
    "system_prompt_files": ["AGENTS.md", "SOUL.md", "PROFILE.md"],
    "language": "zh"
  }
}
```

- `system_prompt_files`：每次会话自动注入的文件（冻结快照）
- `context_manager_backend`: 上下文管理后端（`light` 模式带 offload/pruning）
- `memory_manager_backend`: 记忆后端（`remelight`）
- `approval_level`: 审批级别（`null`=无审批，可设 `L2`/`L3` 等）

### 频道配置

```json
{
  "channels": {
    "console": { "enabled": true },
    "dingtalk": { "enabled": true, "client_id": "...", "client_secret": "..." },
    "imessage": { "enabled": true },
    "telegram": { "enabled": false },
    "discord": { "enabled": false }
    // ... 共 18 个频道适配器
  }
}
```

已启用：console、dingtalk、imessage（macOS 专属）
可配置：discord、telegram、feishu、qq、wecom、matrix、mattermost、voice、sip、onebot 等

### MCP 客户端配置

```json
{
  "mcp": {
    "clients": {
      "brain": {
        "transport": "stdio",
        "command": "node",
        "args": [".../brain-mcp-server.js"],
        "enabled": true
      },
      "kanban": {
        "transport": "stdio",
        "command": "node",
        "args": [".../kanban-mcp-server.js"],
        "enabled": true
      }
    }
  }
}
```

MCP 协议传递工具列表给 LLM。支持的传输方式：`stdio`（本地）和 HTTP（远程）。
当前启用了 brain (19 工具) 和 kanban (9+ 工具) 两个 MCP 客户端。

### ACP 外部 Agent

```json
{
  "acp": {
    "agents": {
      "opencode": { "enabled": true, "command": "opencode", "args": ["acp"] },
      "qwen_code": { "enabled": true, "command": "qwen", "args": ["--acp"] },
      "claude_code": { "enabled": true, "command": "npx", "args": ["-y", "@zed-industries/claude-agent-acp"] },
      "codex": { "enabled": true, "command": "npx", "args": ["-y", "@zed-industries/codex-acp"] }
    }
  }
}
```

ACP（Agent Communication Protocol）用于内部 Agent 调用外部代码 Agent。

### 内置工具清单

所有 18 个内置工具在 `config.json` 的 `tools.builtin_tools` 中可分别启用/禁用：

| 工具 | 说明 | 图标 |
|:-----|:------|:-----|
| execute_shell_command | Shell 命令执行 | 💻 |
| read_file | 文件读取 | 📄 |
| write_file | 文件写入 | ✍️ |
| edit_file | 文件编辑（查找替换） | 🖊️ |
| grep_search | 文件内容搜索 | 🔍 |
| glob_search | 文件模式匹配 | 📁 |
| browser_use | 浏览器自动化 | 🌐 |
| desktop_screenshot | 桌面截图 | 📸 |
| view_image / view_video | 多媒体查看 | 🖼️ 🎥 |
| send_file_to_user | 发送文件给用户 | 📤 |
| get_current_time | 当前时间 | 🕐 |
| set_user_timezone | 设置时区 | 🌍 |
| get_token_usage | Token 用量 | 📊 |
| list_agents | 列 Agent | 🤖 |
| chat_with_agent | Agent 通信 | 💬 |
| submit_to_agent | 后台任务提交 | 📨 |
| check_agent_task | 后台任务检查 | ⏳ |

---

## CLI 命令

CoPaw 提供 CLI 接口，通过 `copaw` 命令访问：

| 命令 | 说明 |
|:-----|:------|
| `copaw init` | 初始化工作区 |
| `copaw run` | 启动 Agent（控制台交互） |
| `copaw chat` | 进入聊天模式 |
| `copaw session` | 会话管理 |
| `copaw cron list/create/get/state/pause/resume/delete/run` | 定时任务管理 |
| `copaw channels list/send` | 频道管理 |
| `copaw agents list` | Agent 列表 |
| `copaw skill list/install/update/remove` | 技能管理 |
| `copaw tool list` | 工具列表 |
| `copaw config get/set` | 配置管理 |
| `copaw log` | 日志查看 |
| `copaw version` | 版本信息 |

**注意**：`copaw` 命令可能需要从激活的 Python 环境中运行，
或使用完整路径 `D:\QwenPaw\Scripts\copaw.exe`。

---

## 技能系统

### 结构

每个技能是一个目录，包含：

```
skills/<skill-name>/
├── SKILL.md          # 核心技能文档（SOP + 规则）
├── DESCRIPTION.md    # 简短描述
└── ...              # 额外资源（脚本、模板等）
```

### 索引

`skills/INDEX.md` 维护全技能索引列表。Agent 在任务启动时
根据关键词匹配表选择加载的 SKILL.md。

### 技能优先级

技能有优先级分层：🥇 高优先级 → 🥈 中优先级 → 🥉 按需加载。
这在 AGENTS.md 的「技能优先级」表中维护。

### 技能进化

自进化技能系统（元技能，skill-evolution）允许 Agent 在对话中
主动创建、修补、进化技能库。决策树：复杂任务完成 → 判断是否
固化为技能 → create/patch/edit/delete。

参考：[skill-evolution](/docs/skill-evolution)

---

## 插件系统

### 结构

```
~/.copaw/plugins/<plugin-name>/
├── plugin.json       # 插件元数据 + 注册信息
└── plugin.py         # 插件实现
```

### plugin.json 结构

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "...",
  "author": "...",
  "hooks": {
    "on_tool_call": "on_tool_call",
    "on_message": "on_message"
  },
  "providers": ["channel", "mcp", "tool"],
  "commands": {
    "/command": "handle_command"
  }
}
```

### 已安装插件

| 插件 | 说明 |
|:-----|:------|
| brain-bridge | Brain 记忆桥接 |
| kanban | 看板任务板（SQLite + MCP server） |
| health-monitor | 健康监控 |
| hello-world | 示例插件 |
| orchestrator | 任务编排 |

参考：[copaw-plugin-system](/docs/copaw-plugin-system)（插件开发 SOP）

---

## 记忆系统

CoPaw 使用 `remelight` 作为记忆后端。记忆体系：

| 层级 | 存储 | 说明 |
|:-----|:------|:------|
| 短期记忆 | 上下文窗口（light context） | 当前对话历史 + tool_results |
| 长期记忆 | memory/YYYY-MM-DD.md | 每日原始记录文件 |
| 精华记忆 | MEMORY.md | 精选长期记忆 |
| 用户画像 | PROFILE.md | 用户身份/偏好/背景 |
| 行为准则 | AGENTS.md + SOUL.md | Agent 行为规则 |

记忆还有 Brain MCP 提供的额外能力：语义搜索、跨会话推理、
决策记录、工具经验记忆等。

---

## 多 Agent 协作

CoPaw 支持两种 Agent 通信模式：

1. **chat_with_agent**（前台）：发送消息并等待回复，用于直接咨询
2. **submit_to_agent**（后台）：提交任务不等待，用于异步执行
3. **看板系统**：Kanban SQLite 看板，多 Agent 任务协调（Orchestrator-Worker 模式）

参考：[kanban-system](/docs/kanban-system)

---

## 调试经验

> 详细调试指南请参见 [copaw-debugging](/docs/copaw-debugging)。这里仅列出要点。

### GBK 编码问题

Windows 终端默认 GBK 编码，Python 打印 Unicode（如 emoji）会崩溃：

```python
# ❌ UnicodeEncodeError: 'gbk' codec can't encode character
print("🏗️")  # 崩溃

# ✅ 用 ASCII 纯文本替代
print("[AUDIT]")  # 正常
```

影响范围：
- `print()` 输出的 emoji
- yt-dlp 进度条中的 Unicode
- 文件路径中的非 ASCII 字符

**解决方法：**
- 所有输出用纯文本替代 emoji
- yt-dlp 加 `--no-progress`
- 重定向 stdout：`command > file.log 2>&1`
- 设置环境变量：`PYTHONIOENCODING=utf-8`

### Python 路径

```bash
# ✅ 可用
python

# ❌ 不可用
python3
```

### 浏览器相关问题

- 可见浏览器（headed）是 Google 搜图的必要前提（headless 触发 CAPTCHA）
- CDP 模式共享浏览器时需要通知用户（安全考虑）
- 同一工作区同时只能运行一个浏览器

### pywebview 坑点

- `webview.start("标题")` 传字符串 → 进程崩溃
- 必须传 callable：`webview.start(window=window)`

### yt-dlp 坑点

- Windows 下 `yt-dlp` 命令可能不可用，用 `py -3 -m yt_dlp`
- GBK 编码问题：加 `--no-progress` 或重定向 stdout

### MCP Server 调试

- MCP 工具通过 stdio 传输协议与 Agent 通信
- 配置在 `config.json` 的 `mcp.clients` 中
- Brain MCP 和 Kanban MCP 当前启用

参考：[mcp-debugging](/docs/mcp-debugging)、[yt-dlp-usage](/docs/yt-dlp-usage)

---

## 已知坑点清单

| # | 问题 | 场景 | 解决 |
|:--|:-----|:------|:------|
| 1 | GBK emoji 崩溃 | 所有终端输出 | 纯文本替代 emoji |
| 2 | python3 不存在 | 脚本执行 | 用 `python` |
| 3 | yt-dlp 命令不可用 | 视频下载 | 用 `py -3 -m yt_dlp` |
| 4 | webview.start() 闪退 | pywebview 窗口 | 传 callable 不传 string |
| 5 | headless 触发 CAPTCHA | 浏览器自动化 | 用 headed 模式 |
| 6 | copaw 命令不可用 | CLI 操作 | 用完整路径或激活环境 |
| 7 | pip install copaw 找不到 | 包管理 | CoPaw 不是 pip 包，是 PyInstaller 分发 |

---

## 相关页面

- [hermes-agent](/docs/hermes-agent) — Hermes Agent 能力体系与工作流
- [brain-architecture](/docs/brain-architecture) — Brain MCP 认知架构（19 工具）
- [mcp-debugging](/docs/mcp-debugging) — MCP 调试方法论
- [kanban-system](/docs/kanban-system) — Kanban 看板任务协调
- [skill-evolution](/docs/skill-evolution) — 自进化技能系统
- [copaw-plugin-system](/docs/copaw-plugin-system) — 插件系统详解
- [pywebview-desktop](/docs/pywebview-desktop) — 桌面浮窗技术
- [yt-dlp-usage](/docs/yt-dlp-usage) — 视频下载模式

