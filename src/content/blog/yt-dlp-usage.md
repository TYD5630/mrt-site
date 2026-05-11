---
title: "yt-dlp Download Patterns"
description: "yt-dlp Download Patterns"
pubDate: 2026-05-05
tags: ["python", "video", "download", "yt-dlp", "ffmpeg", "media", "lesson"]
---

# yt-dlp Download Patterns

yt-dlp 视频下载的使用模式与经验教训。覆盖安装、调用方式、格式选择、站点头适配、Windows 编码坑点。

## 安装

```bash
pip install yt-dlp
# 安装位置（Windows）：Python 3.14 的 Scripts 目录
# 如果直接 yt-dlp 命令不可用，用模块方式调用
```

## 调用方式

在 `yt-dlp` 命令不可用时（常见于 Windows pip 安装后 PATH 没刷新）：

```bash
# 推荐：模块方式（总是可用）
py -3 -m yt_dlp [options] URL

# 备选：直接命令
yt-dlp [options] URL
```

## 常用命令模式

### 最佳质量下载（限制 1080p）

```bash
py -3 -m yt_dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" -o "D:\path\%(title)s.%(ext)s" URL
```

### 按高度排序

```bash
py -3 -m yt_dlp -S "height:1080" -o "D:\path\%(title)s.%(ext)s" URL
```

### 简单模式（720p）

```bash
py -3 -m yt_dlp -f "best[height<=720]" -o "D:\path\%(title)s.%(ext)s" URL
```

### 输出模板变量

| 变量 | 说明 |
|:-----|:------|
| `%(title)s` | 视频标题 |
| `%(id)s` | 视频 ID |
| `%(ext)s` | 文件扩展名 |
| `%(height)s` | 视频高度 |
| `%(uploader)s` | 上传者 |

## 站点适配

| 站点 | 状态 | 备注 |
|:-----|:------|:------|
| PornHub | ✅ 可用 | 1080p cosplay 258MB + 720p 195MB 已验证 |
| YouTube | ✅ 可用 | 标准支持 |

## Windows 坑点

### GBK 编码问题

yt-dlp 默认输出包含 unicode 字符（如进度条、视频标题中的非 ASCII），Windows 控制台 GBK 编码无法渲染：

```bash
# 症状：UnicodeEncodeError 或乱码
# 解决方法1：禁用进度条
py -3 -m yt_dlp --no-progress [options] URL

# 解决方法2：重定向 stdout（写入文件）
py -3 -m yt_dlp [options] URL > output.log 2>&1

# 解决方法3：设置 PYTHONIOENCODING
set PYTHONIOENCODING=utf-8
py -3 -m yt_dlp [options] URL
```

### 文件名特殊字符

Windows 文件名不支持 `\ / : * ? " < > |`，yt-dlp 会自动替换，但某些 Unicode 字符仍可能出错。建议用 `%(id)s` 作为文件名后备。

## 实际下载记录

| 文件 | 大小 | 来源 | 格式 |
|:-----|:------|:------|:------|
| ph_jp_cosplay_001.mp4 | 258MB | PornHub | 1080p |
| ph_pirates2_720p.mp4 | 195MB | PornHub | 720p |

## 相关

- [mcp-debugging](/docs/mcp-debugging) — 工具调试方法论（编码问题）
- [hermes-agent](/docs/hermes-agent) — Hermes Agent 能力体系

