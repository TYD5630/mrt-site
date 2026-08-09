# ZCode Work 文档站（v1）设计

- 日期：2026-08-09
- 状态：已确认（brainstorming 流程通过）
- 项目：`projects/web-app`

## 背景

web-app 已交付「ZCode Work 工作区架构」单页总览（`app/architecture-data.ts` + `app/page.tsx`，
硬编码数据组件模式）。本次将单页扩展为**多页文档站**：保留首页总览，新增三个子页，顶部导航贯通。

## 目标与成功标准

- `/`、`/principles`、`/decisions`、`/integration` 四个路由均可访问，顶部导航可跳转且高亮当前页
- 三个新页内容为源文档的**结构化精编**（延续 `architecture-data.ts` 模式），无新增依赖
- `npm run build` 通过；Playwright 目检四路由渲染完整、控制台 0 错误
- 预览截图存 `preview/`（沿用 `web-page-preview-check` 技能）

## 方案（用户选定：方案 A）

layout 共享导航 + 每页独立数据文件，不做组件抽象层（YAGNI），不用动态路由。

## 设计细节

### 路由与文件

| 路由 | 页面职责 | 数据文件 |
|---|---|---|
| `/` | 总览（保留现有四区块，微调适配导航） | `app/architecture-data.ts`（已有） |
| `/principles` | 七条原则卡片 | `app/principles-data.ts`（新建） |
| `/decisions` | 决策记录 D-001 / D-002 | `app/decisions-data.ts`（新建） |
| `/integration` | 融合协议：能力边界表 + 分流规则 | `app/integration-data.ts`（新建） |

### 布局（`app/layout.tsx`）

- 顶部 sticky 导航：站点名「ZCode Work」+ 4 个 NavLink；当前页高亮
  - 导航需 `usePathname` → 新建 `"use client"` 组件 `app/nav-bar.tsx`
- 页脚从首页抽到 layout 共享（保留源文档链接块）
- 每页导出独立 `metadata`

### 内容清单

**/principles（AI-PRINCIPLES.md 精编）**：7 条原则卡片
1. 窄腰核心，能力在边缘
2. 记忆诚实而稳定
3. 规范先行，异议闭环
4. 量化胜过直觉
5. 优先一切可逆，先备份后批量
6. 人类保留最终否决权
7. 绝对理性：不盲从、不附和

每条：标题 + 核心要义（精编为 2-3 句）+ 页头冲突裁决顺序提示（AI-PRINCIPLES.md > AGENTS.md > skill > 默认行为）。

**/decisions（DECISIONS.md 精编）**：
- D-001：mem-recall.sh 去留 → 结论「保留降级试用」，复查点 2026-08-23
- D-002：每周「用不上就下」自检 → 结论「并入周维护」

每条：编号 → 问题 → 结论 → 验证/复查点。

**/integration（ZCODE-INTEGRATION.md 精编）**：
- 能力边界对照表（12 行：记忆/联想/技能触发/定时任务/浏览器/桌面自动化/执行记账/记忆卫生/技能度量/插件/规范层/安全）
- 分流规则 5 条
- 版本基线（双写映射）

### 验证

沿用 `web-page-preview-check` 技能：build → dev → Playwright 目检 4 路由 → 截图（亮/暗）存 `preview/`。

## 不做（明确排除）

- 不引入 markdown 解析依赖（继续硬编码数据组件，漂移风险已知，页脚有标注）
- 不做搜索、不做手动暗色切换（沿用系统 `prefers-color-scheme`）
- 不抽共享组件库（等出现样式重复信号再抽）

## 风险与备注

- 内容仍为静态快照：源文档更新后需人工同步（延续现有页脚标注）
- 导航高亮依赖 `usePathname`（客户端组件），SSR 首屏无影响
