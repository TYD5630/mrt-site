---
title: '项目概览'
description: 'MRT 技术栈概览与项目架构说明。'
sidebar:
  order: 1
  label: '项目概览'
---

## 技术栈

| 领域 | 技术 | 说明 |
|------|------|------|
| Agent 框架 | CoPaw | 当前主力 Agent 平台 |
| Agent 框架 | Hermes | 曾用，已迁移 |
| 前端 | Astro + Tailwind | 本网站技术栈 |
| 后端 | Node.js | 必要时的 API 支持 |
| 部署 | Vercel | 静态站点部署 |
| 代码管理 | GitHub | 版本控制 |

## 目录结构

```
D:\mrt-site\           ← 站点根目录
├── src/
│   ├── content/       ← Markdown 内容
│   │   ├── blog/      ← 博客文章
│   │   └── docs/      ← 技术文档
│   ├── layouts/       ← 页面布局
│   ├── components/    ← 可复用组件
│   ├── pages/         ← 路由页面
│   └── styles/        ← 全局样式
├── public/            ← 静态资源
└── astro.config.mjs   ← Astro 配置
```

## 开发命令

```shell
npm run dev      # 启动开发服务器
npm run build    # 构建静态站点
npm run preview  # 预览构建结果
```

