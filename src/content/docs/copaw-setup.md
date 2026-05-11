---
title: 'CoPaw 环境配置'
description: 'CoPaw Agent 平台安装、配置与常用命令。'
sidebar:
  order: 2
  label: 'CoPaw 配置'
---

## 安装

CoPaw 的安装依赖于 Node.js 和 Python 环境。

### 前置要求

- Node.js >= 22.12.0
- Python 3.12
- Git

### 快速安装

```shell
npx copaw init
```

安装过程中会引导你配置 API Key、Agent 名称等信息。

## 常用命令

```shell
copaw run              # 启动交互模式
copaw cron list        # 查看定时任务
copaw cron create      # 创建定时任务
copaw skill list       # 列出已安装技能
copaw skill install    # 安装新技能
```

## 记忆系统

CoPaw 继承了 Hermes 的记忆设计理念：

- `MEMORY.md` — 长期记忆
- `PROFILE.md` — 用户资料
- `memory/YYYY-MM-DD.md` — 每日笔记
- `memory/.session-bridge.md` — 跨会话桥接

## 技能管理

技能存放在 `skills/` 目录下，每个技能一个文件夹，包含 `SKILL.md` 说明文件。

安装新技能：

```shell
copaw skill install <skill-name>
```

或者从 SkillHub 发现技能：

```shell
copaw skill search <keyword>
```

