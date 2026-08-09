# web-app

> Next.js 全栈 Web 应用（逐步建设中）。
> 当前页面：**ZCode Work 工作区架构**单页总览（数据源 `app/architecture-data.ts`，内容镜像工作区根目录文档）。

## 技术栈

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript
- **样式**：Tailwind CSS v4
- **构建**：`npm run build` / `npm run dev`
- **包管理**：npm（`package-lock.json` 已锁版本）

## 快速开始

```bash
npm install       # 已装过则跳过
cp .env.example .env.local   # 本地密钥占位（.env.local 已被 git 忽略）
npm run dev       # http://localhost:3000
npm run build     # 生产构建验证
```

## 目录

```
app/             # App Router 页面与 API 路由
public/          # 静态资源
AGENTS.md        # 项目专属 agent 指令（工作目录上溯自动加载）
```

## 规范（对齐工作区）

- 密钥只放 `.env.local`（git 忽略），`.env.example` 是占位模板，绝不提交真实值。
- 可复用流程沉淀成工作区技能（`skill-capture`），不堆进项目文档。
- 需要定时任务 → ZCode CronCreate 注册 + `cron/jobs.json` 登记（双源一致）。
- 项目档案指针见工作区 `memory/`（只指路不复制代码文档）。