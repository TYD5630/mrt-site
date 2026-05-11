---
title: "Hermes Desktop Pet"
description: "Hermes Desktop Pet"
sidebar:
  order: 50
  label: "Hermes Desktop Pet"
tags: ["hermes", "deskpet", "javascript", "html", "css", "animation", "pixel-art"]
---

# Hermes Desktop Pet

HTML/CSS 像素风桌面宠物，Hermes Agent 的视觉化身。悬浮于桌面之上，能呼吸、眨眼、挥手、脉冲闪电。右键切换鼠标穿透模式，与日常工作互不干扰。

## Overview

- **类型**：独立 HTML 文件 + pywebview 桌面浮窗
- **文件**：`hermes-web-pet.html`（~300KB JS 动画引擎）
- **模板来源**：svganimate.ai Herobrine 像素模板（T总已有成果，直接复用而非自创）
- **设计原则**：像素风 + 紫黑配色 + 肉色脸/手臂 + 胸前闪电 + **无天线**

## 设计决策

| 决策 | 选择 | 理由 |
|:-----|:------|:------|
| 骨架 | Herobrine 像素模板 | T总已有现成模板，效果已验证 |
| 配色 | 紫黑主色 + 肉色头臂 | Hermes 品牌色（紫），面部保持人感 |
| 闪电位置 | **胸前**（非额头） | 额头太突兀，胸甲位更自然 |
| 天线 | **取消** | T总要求"头上别长角" |
| 动画引擎 | Canvas + requestAnimationFrame | 像素帧动画需要精确控制 |

## 动画系统

全部 8 种动画，基于 canvas 像素帧和 requestAnimationFrame 循环：

| 动画 | 触发 | 说明 |
|:-----|:------|:------|
| 呼吸 | 常驻循环 | 身体轻微上下起伏 ~1.5s 周期 |
| 摆臂 | 常驻循环 | 手臂前后摆动，约 3s 周期 |
| 闪电脉冲 | 常驻循环 | 胸前闪电标记周期性闪亮 |
| 眨眼 | 常驻循环 | 每 3-5s 随机眨眼 |
| 视线追踪 | 鼠标移动 | 眼球跟随鼠标位置转动 |
| 粒子 | 常驻 | 周围漂浮紫色粒子（渐变出现/消失） |
| 点击爆发 | 鼠标点击 | 点击时粒子爆发效果 |
| Glitch 故障 | 随机（~30s） | 短暂画面撕裂 + 颜色偏移，Cyberpunk 感 |

## 桌面集成

桌面浮窗通过 pywebview 包装为透明窗口：

- **桌面脚本**：`hermes_deskpet.py`（pywebview + WebView2）
- **启动方式**：`Hermes浮窗.bat`（桌面快捷方式）
- **窗口属性**：无边框、置顶、透明背景
- **右键菜单**：切换鼠标穿透（点击穿透 ↔ 可交互）

## 文件清单

| 文件 | 路径 | 说明 |
|:-----|:------|:------|
| `.html` | `C:\Users\MRT\.copaw\workspaces\default\hermes-web-pet.html` | 完整动画页面 |
| `.py` | `C:\Users\MRT\.copaw\workspaces\default\hermes_deskpet.py` | pywebview 包装 |
| `.bat` | `C:\Users\MRT\Desktop\Hermes浮窗.bat` | 桌面启动快捷方式 |

## 相关

- [hermes-agent](/docs/hermes-agent) — Hermes Agent 完整架构
- [pywebview-desktop](/docs/pywebview-desktop) — pywebview 桌面浮窗技术

