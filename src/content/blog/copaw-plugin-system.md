---
title: "CoPaw 插件系统"
description: "CoPaw 插件系统"
pubDate: 2026-05-05
tags: ["copaw", "plugin", "architecture", "development", "hook", "provider", "mcp"]
---

# CoPaw 插件系统

CoPaw 的插件机制允许通过 `plugin.json` + `plugin.py` 扩展 Agent 的能力。
插件可以注册钩子（hooks）、提供者（providers）、命令（commands）和 MCP 工具。

---

## 插件生命周期

```
加载 → 初始化 → 注册钩子 → 运行 → 卸载
 │        │           │
plugin.json  plugin.py   钩子在运行时被调用
被读取      被导入        (on_tool_call / on_message 等)
```

## 插件结构

```
~/.copaw/plugins/<plugin-name>/
├── plugin.json    # 元数据 + 注册信息
└── plugin.py      # Python 实现
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "插件说明",
  "author": "作者",
  "hooks": {
    "on_tool_call": "on_tool_call",
    "on_message": "on_message"
  },
  "providers": ["channel", "mcp", "tool"],
  "dependencies": ["kanban"],
  "commands": {
    "/mycommand": "handle_command"
  }
}
```

| 字段 | 说明 |
|:-----|:------|
| `hooks` | 运行时钩子，值是 plugin.py 中的方法名 |
| `providers` | 插件提供的服务类型 |
| `commands` | 斜杠命令映射 |
| `dependencies` | 依赖的其他插件 |

### 支持的钩子

| 钩子 | 触发时机 | 方法签名 |
|:-----|:---------|:---------|
| `on_tool_call` | 每次工具调用前 | `on_tool_call(tool_name, params)` → 可修改参数 |
| `on_tool_result` | 工具返回后 | `on_tool_result(tool_name, params, result)` |
| `on_message` | 收到用户消息 | `on_message(message)` |
| `on_llm_call` | LLM 调用前 | `on_llm_call(messages)` |
| `on_llm_result` | LLM 返回后 | `on_llm_result(messages, response)` |
| `on_session_start` | 会话启动 | `on_session_start()` |
| `on_session_end` | 会话结束 | `on_session_end()` |

### Providers

| Provider | 说明 |
|:---------|:------|
| `channel` | 注册频道适配器（如 dingtalk、discord） |
| `mcp` | 注册 MCP 客户端/服务端 |
| `tool` | 注册内置工具 |

---

## 已安装插件

| 插件 | plugin.json 关键内容 | 功能 |
|:-----|:---------------------|:------|
| **brain-bridge** | hooks: on_tool_call → interceptor | 拦截工具调用，记录到 Brain 记忆 |
| **kanban** | providers: mcp + tool, commands: /kanban | SQLite 看板 + MCP Server |
| **health-monitor** | hooks: on_session_start/end | 健康状态监控 |
| **hello-world** | 示例插件 | 演示插件开发基础 |
| **orchestrator** | hooks: on_session_start | 任务编排与调度 |

### Kanban 插件（参考实现）

Kanban 是功能最完整的参考插件：

- **数据层**：SQLite（`~/.copaw/kanban.db`）
- **MCP Server**：通过 Node.js 进程暴露 9+ Kanban 工具
- **Commands**：`/kanban` 命令查看看板
- **核心能力**：任务状态机（triage→todo→ready→running→done→archived）、Claim 机制（15min TTL）、心跳续约、依赖图

参考：[kanban-system](/docs/kanban-system)

---

## 插件开发 SOP

详见「plugin-dev」技能文档（skills/plugin-dev/SKILL.md），核心步骤：

1. 创建 `~/.copaw/plugins/<name>/` 目录
2. 编写 `plugin.json`（hooks/providers/commands）
3. 编写 `plugin.py`（实现钩子方法）
4. 调试：查看 `copaw.log`
5. 发布：分享 plugin.json 即可

---

## 与 MCP 的关系

插件和 MCP 是两种不同的扩展机制：

| 维度 | 插件 | MCP |
|:-----|:------|:------|
| 语言 | Python | 任意语言（stdio/HTTP） |
| 部署 | 本地文件系统 | 本地进程或远程服务 |
| 粒度 | 钩子 + 提供者 | 工具列表 |
| 配置位置 | `~/.copaw/plugins/` | `config.json` → `mcp.clients` |
| 典型用途 | 拦截工具调用、频道适配 | 提供新工具给 LLM |

两者可以配合使用：插件内启动 MCP Server，Kanban 插件正是这种模式。

---

## 相关页面

- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库主页面
- [kanban-system](/docs/kanban-system) — Kanban 看板系统
- [hermes-agent](/docs/hermes-agent) — Hermes Agent 架构
- [skill-evolution](/docs/skill-evolution) — 自进化技能系统

