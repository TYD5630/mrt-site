# ZCode Work 文档站（v1）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 web-app 从单页扩展为 4 路由文档站（总览 + 原则 + 决策 + 融合），layout 挂共享导航与页脚。

**Architecture:** 方案 A（用户选定）：`app/layout.tsx` 挂 `"use client"` 的 NavBar（`next/link` + `usePathname` 高亮）与共享页脚；每页独立数据文件（`*-data.ts`）+ `page.tsx`，延续 `architecture-data.ts` 硬编码数据组件模式。零新依赖。

**Tech Stack:** Next.js 16.3.0（App Router）/ React 19 / TypeScript / Tailwind CSS v4。

**规格:** `docs/superpowers/specs/2026-08-09-zcode-work-docs-site-design.md`（含勘误：原则 8 条、决策 D-001~D-004）。

## Global Constraints

- 零新依赖：不引入 markdown 解析 / 状态管理 / 组件库。
- 数据与展示分离：内容全部进 `app/*-data.ts`，`page.tsx` 只渲染。
- 复用现有样式惯例：`Card` / `SectionHeading` 的 Tailwind 类（`rounded-xl border zinc-200 bg-white p-5 dark:...`）。
- 导航高亮：当前路由与 `href` 相等即高亮；`/` 用全等判断避免子路由误亮。
- 每页导出独立 `metadata`（title/description，中文）。
- 页面正文中文；组件/文件名英文 kebab-case（Next 路由目录即路由名，如 `principles/page.tsx`）。
- 提交策略：每个 Task 结尾独立 commit（用户已授权本次迭代提交）。

---

### Task 1: layout 共享导航 + 页脚上移

**Files:**
- Create: `app/nav-bar.tsx`
- Modify: `app/layout.tsx`（整体重写）
- Modify: `app/page.tsx`（删除页脚块，仅此一处）

**Interfaces:**
- Consumes: `next/link`、`next/navigation` 的 `usePathname`、`./architecture-data` 的 `sourceDocs`（页脚复用）。
- Produces: `NavBar`（默认导出，无 props，自渲染 `<header>`）；layout 中 `children` 置于 `<main>`；页脚块含 `sourceDocs` 渲染。

- [ ] **Step 1: 新建 `app/nav-bar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "总览" },
  { href: "/principles", label: "七条原则" },
  { href: "/decisions", label: "决策记录" },
  { href: "/integration", label: "融合协议" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-3">
        <Link href="/" className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          ZCode Work <span className="text-emerald-600 dark:text-emerald-400">☤</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
```

注意：导航标签「七条原则」保持规格用词，但页面实际渲染 8 条卡片（勘误），建议标签改「原则」——用 `label: "原则"`，避免与 8 条冲突。

- [ ] **Step 2: 重写 `app/layout.tsx`（挂导航 + 页脚）**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./nav-bar";
import { sourceDocs } from "./architecture-data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZCode Work 工作区架构",
  description: "仿 Hermes 架构的 agent 工作区：窄腰核心、能力在边缘——铁律、记忆、技能、自进化闭环一览。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">源文档（工作区根目录）</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">本页为静态快照，权威内容以工作区文档为准。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sourceDocs.map((doc) => (
                <div key={doc.name} className="flex flex-col gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{doc.name}</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{doc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 修改 `app/page.tsx` — 删除页脚块**

把 `page.tsx` 末尾的 `<footer>...</footer>` 整块删除（`sourceDocs` 的 import 同步移除），其余保留。若 `sourceDocs` 只在 footer 用，则从 page.tsx 的 import 列表中去掉。

- [ ] **Step 4: 验证**

Run: `cd projects/web-app && npm run build`
Expected: 编译通过；首页只出现一个 footer（layout 的），无重复；导航栏 4 个链接、`/` 高亮。

- [ ] **Step 5: Commit**

```bash
git add app/nav-bar.tsx app/layout.tsx app/page.tsx
git commit -m "feat: layout 共享导航栏 + 页脚上移（文档站骨架）"
```

---

### Task 2: /principles 页面（8 条原则）

**Files:**
- Create: `app/principles-data.ts`
- Create: `app/principles/page.tsx`

**Interfaces:**
- Produces: `principles`（`{ num, title, essence }[]`，8 项）、`rulingOrder`（string[]，3 段裁决顺序）。
- Consumes: Task 1 的 layout（导航/页脚自动出现）。

- [ ] **Step 1: 新建 `app/principles-data.ts`**

```ts
export type Principle = { num: string; title: string; essence: string };

export const rulingOrder = [
  "AI-PRINCIPLES.md（价值观层）",
  "AGENTS.md（工作区宪法）",
  "skill（技能约定）",
  "默认行为",
];

export const principles: Principle[] = [
  { num: "一", title: "窄腰核心，能力在边缘", essence: "核心越窄越稳定、越可预测。能力沿阶梯外推：组合现成工具 → 脚本+skill → 插件协议 → 才许动核心。拒绝「万一用得上」的抽象与投机钩子，每条新能力都必须支付得起自己的维护成本。" },
  { num: "二", title: "记忆诚实而稳定", essence: "记忆是契约不是草稿：快照注入、原子写、预算内巩固而非无脑追加；事实可验证，禁止脑补；删除/合并等于改写契约，先说明理由并留痕；联想由自带索引驱动，不造检索轮子。" },
  { num: "三", title: "规范先行，异议闭环", essence: "失败教训优先固化为规范，执行任务前先加载规范再跑任务——防错重于纠错。产生不可逆/半可逆动作的裁决必须有「可被打断」的异议检查点：异议即挂起，裁决留痕审计线。" },
  { num: "四", title: "量化胜过直觉", essence: "体系是有状态机的：技能用状态、计数、效果列说话；动作有证据链（executions / objections / logs）三道账本。没有度量就没有「进化」，只有「折腾」。" },
  { num: "五", title: "优先一切可逆，先备份后批量", essence: "动手前先问「能不能反悔」；恢复成本高 = 默认保守。批量改动前先备份，每一步留下小的可逆路径。宁可慢两步，不要一次不可逆的「高效」。" },
  { num: "六", title: "人类保留最终否决权", essence: "AI 给出最合理的默认，但决策权在人。永久性/不可逆动作无用户明确授权 → 标示异议、挂起；用户明确反对 → 立即停。但否决权不含「让 AI 违背事实与目标办事」的权力。" },
  { num: "七", title: "绝对理性：不盲从、不附和", essence: "第一职责是基于事实与目标说真话：不随指令漂流、不信「有主人」、不谄媚、诚实谓对（说错即更正，做错即回滚）。" },
  { num: "八", title: "退场即重生：能力只许螺旋上升", essence: "降级/收编是常态，但能力永不骤减：每退场必带承接（吸收/内联/提炼规范），无承接者的退场不允许；收编 ≠ 丢弃（进 backups/ 可回滚）；重生用更简实现，不默认复活旧件。" },
];
```

- [ ] **Step 2: 新建 `app/principles/page.tsx`**

```tsx
import type { Metadata } from "next";
import { principles, rulingOrder } from "./principles-data";

export const metadata: Metadata = {
  title: "七条原则 · ZCode Work",
  description: "AI 全局指导思想（AI-PRINCIPLES.md 精编）：八条价值观层原则与冲突裁决顺序。",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {children}
    </div>
  );
}

export default function PrinciplesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">AI-PRINCIPLES.md</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">AI 全局指导思想</h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          本工作区所有 AI 必须遵循的顶层「价值观层」：宪法管怎么做，本文件管为什么。冲突裁决顺序：
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {rulingOrder.map((step, i) => (
            <span key={step} className="flex items-center gap-2 text-sm">
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">{step}</span>
              {i < rulingOrder.length - 1 && <span className="text-zinc-400">›</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.num}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{p.num}</span>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{p.title}</h2>
            </div>
            <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">{p.essence}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证**

Run: `cd projects/web-app && npm run build`
Expected: 编译通过；dev 访问 `/principles` 显示 8 张卡片 + 裁决顺序提示；导航高亮「原则」。

- [ ] **Step 4: Commit**

```bash
git add app/principles-data.ts app/principles/page.tsx
git commit -m "feat: /principles 八条原则页（精编自 AI-PRINCIPLES.md）"
```

---

### Task 3: /decisions 页面（D-001~D-004）

**Files:**
- Create: `app/decisions-data.ts`
- Create: `app/decisions/page.tsx`

**Interfaces:**
- Produces: `decisions`（`{ id, title, problem, conclusion, verify }[]`，4 项）。

- [ ] **Step 1: 新建 `app/decisions-data.ts`**

```ts
export type Decision = { id: string; title: string; problem: string; conclusion: string; verify: string };

export const decisions: Decision[] = [
  {
    id: "D-001",
    title: "mem-recall.sh 去留（试用期搁置决策）",
    problem: "用户提示「你自带索引」，避免再造检索轮子；mem-recall.sh 已实现但 use=0（未验证的资产是负债）。",
    conclusion: "保留，降级为「试用期观察」——不再扩容；挂进 cron 周维护作为可调工具。",
    verify: "2026-08-09 立档；复查点 2026-08-23：若 bump mem-recall use 从未发生，下月按 cron-config-no-drift 收编归档。",
  },
  {
    id: "D-002",
    title: "每周「用不上就下」自检（并入周维护）",
    problem: "机制/脚本/技能会「活下来但没人用」，噪音累积。",
    conclusion: "周维护新增一步：遍历技能与脚本，连续 2 个维护周期 use=0 → 列为降级候选，过异议后收编（可回滚）。",
    verify: "2026-08-09 立档，并入周维护 prompt；复查点 = 每次周维护执行。",
  },
  {
    id: "D-003",
    title: "退场必带承接（螺旋收编）",
    problem: "D-002 只保证「收编可逆」，仍可能急流勇退——能力随组件一起消失。",
    conclusion: "周维护升级为「用不上就下 · 螺旋收编」：deprecation-scan 出候选，每项填承接方 → 过异议 → 收编并留能力说明书。",
    verify: "2026-08-09 立档，联动 AI-PRINCIPLES 八 + deprecation-scan.sh。",
  },
  {
    id: "D-004",
    title: "projects/ 项目约定 + project-scaffold 固化",
    problem: "工作区无项目目录约定；bootstrap 不生成新项目骨架。",
    conclusion: "新增约定 projects/<kebab-case>/ + scripts/project-scaffold.sh + 技能 project-scaffold（已登记 usage）。",
    verify: "2026-08-09 立档并首用（web-app）；复查点 = skill-usage 报表 + 周维护。",
  },
];
```

- [ ] **Step 2: 新建 `app/decisions/page.tsx`**

```tsx
import type { Metadata } from "next";
import { decisions } from "./decisions-data";

export const metadata: Metadata = {
  title: "决策记录 · ZCode Work",
  description: "指导思想下的实际决策记录（DECISIONS.md 精编）：D-001 ~ D-004，结论 + 复查点。",
};

export default function DecisionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">DECISIONS.md</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">决策记录</h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          每个动体系决策用七条显式推导，结论 + 依据 + 复查点记录在此；新决策追加，不改旧决策（历史不可篡改）。
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {decisions.map((d) => (
          <div key={d.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="mb-3 flex items-baseline gap-3">
              <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{d.id}</span>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{d.title}</h2>
            </div>
            <dl className="flex flex-col gap-2 text-[13px] leading-6">
              <div><dt className="font-medium text-zinc-700 dark:text-zinc-300">问题</dt><dd className="text-zinc-500 dark:text-zinc-400">{d.problem}</dd></div>
              <div><dt className="font-medium text-zinc-700 dark:text-zinc-300">结论</dt><dd className="text-zinc-500 dark:text-zinc-400">{d.conclusion}</dd></div>
              <div><dt className="font-medium text-zinc-700 dark:text-zinc-300">验证/复查</dt><dd className="text-zinc-500 dark:text-zinc-400">{d.verify}</dd></div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证**

Run: `cd projects/web-app && npm run build`
Expected: 编译通过；dev 访问 `/decisions` 显示 4 张决策卡；导航高亮「决策记录」。

- [ ] **Step 4: Commit**

```bash
git add app/decisions-data.ts app/decisions/page.tsx
git commit -m "feat: /decisions 决策记录页（D-001~D-004 精编）"
```

---

### Task 4: /integration 页面（融合协议）

**Files:**
- Create: `app/integration-data.ts`
- Create: `app/integration/page.tsx`

**Interfaces:**
- Produces: `boundaryRows`（`{ domain, native, selfBuilt, boundary }[]`，12 行）、`rules`（string[]，5 条）、`baseline`（string[]，2 条）。

- [ ] **Step 1: 新建 `app/integration-data.ts`**

```ts
export type BoundaryRow = { domain: string; native: string; selfBuilt: string; boundary: string };

export const boundaryRows: BoundaryRow[] = [
  { domain: "记忆", native: "auto-memory（每会话注入 MEMORY.md 索引）", selfBuilt: "memory/（MEMORY/USER/topics）+ scripts/mem-*", boundary: "已融合：注入层存跨会话事实，档案层存档案/审计" },
  { domain: "联想", native: "会话注入索引 → 定向 Read", selfBuilt: "mem-recall.sh（会话外）", boundary: "会话内用原生索引；脚本仅供 cron/无人值守" },
  { domain: "技能触发", native: "Skill 工具扫描 SKILL.md 自动触发", selfBuilt: "frontmatter 规范 + skills/README.md 索引", boundary: "触发入口只在原生；自建只管写 SKILL.md 与登记" },
  { domain: "定时任务", native: "cron automations（CronCreate/CronList）", selfBuilt: "cron/jobs.json（定义存档）", boundary: "原生是唯一执行源；jobs.json 仅登记/审计" },
  { domain: "浏览器", native: "native IAB（Browser-Use，用户可见）", selfBuilt: "scripts/cdp.sh + chrome-cdp 技能", boundary: "需要人盯 → IAB；无人值守/批量 → CDP" },
  { domain: "桌面自动化", native: "UIA/MCP（若可用）", selfBuilt: "scripts/uia.sh + desktop-ops", boundary: "细颗粒走 MCP/UIA；脚本/闭环用 op.sh" },
  { domain: "执行记账", native: "—（无）", selfBuilt: "executions.jsonl + objections.jsonl + DECISIONS.md", boundary: "审计/证据链属自建（原生没有对应）" },
  { domain: "记忆卫生", native: "—（无）", selfBuilt: "scripts/mem-budget.sh / memory-maintenance", boundary: "自建（原生无预算概念）" },
  { domain: "技能度量", native: "—（无）", selfBuilt: "scripts/skill-usage.sh + .usage.json", boundary: "自建（补原生监控能力）" },
  { domain: "插件", native: "插件市场（official/claude）", selfBuilt: "plugins/（协议空壳）", boundary: "原生市场管第三方能力；自建只含协议约定" },
  { domain: "规范层", native: "skill（负一篇）", selfBuilt: "kind: norm + ai-norms", boundary: "norm 落点为 SKILL.md → 触发靠原生 SKILL 机制" },
  { domain: "安全", native: "Hook/预控（Mimosa）", selfBuilt: "scripts/security-audit.sh", boundary: "Hook 管实时拦截；脚本管定期/批量审计" },
];

export const rules = [
  "先原生：问「原生有没有同类？够不够用？」够 → 用原生（零维护）。",
  "自建条件：原生确实缺 / 原生成本明显更高（后台、批量、无人值守）→ 才自建，并在 DECISIONS 里写「为何原生不满足」。",
  "不让自建长成替代品：自建体系挂在原生机制上生长——自建是原生上的应用层，不是另一套平台。",
  "冲突时：原生协议 > 自建约定（如 SKILL.md 格式由原生定义）。",
  "重叠即收敛：发现自建与原生重叠 → 按 DECISIONS 收敛（D-001 先例：降级试用 / 收编）。",
];

export const baseline = [
  "数据：原生（auto-memory / automations）与工作区（memory/ / jobs.json / logs）各自保留，仅做双写映射（不单点）。",
  "组织：原生记录「执行证据」（cron 执行、记忆注入）；工作区记录「审计证据」（executions/objections/decisions）。",
];
```

- [ ] **Step 2: 新建 `app/integration/page.tsx`**

```tsx
import type { Metadata } from "next";
import { boundaryRows, rules, baseline } from "./integration-data";

export const metadata: Metadata = {
  title: "融合协议 · ZCode Work",
  description: "ZCode ↔ 工作区融合协议（ZCODE-INTEGRATION.md 精编）：能力边界对照 + 分流规则 + 版本基线。",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {children}
    </div>
  );
}

export default function IntegrationPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">ZCODE-INTEGRATION.md</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">ZCode ↔ 工作区 融合协议</h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          原生能力是一等公民；自建只做「原生没有或成本更高」的部分。
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">能力边界对照</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">领域</th>
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">ZCode 原生</th>
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">工作区自建</th>
                  <th className="pb-3 font-medium text-zinc-500 dark:text-zinc-400">分工/边界</th>
                </tr>
              </thead>
              <tbody>
                {boundaryRows.map((row) => (
                  <tr key={row.domain} className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-800/60">
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">{row.domain}</td>
                    <td className="py-3 pr-4 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">{row.native}</td>
                    <td className="py-3 pr-4 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">{row.selfBuilt}</td>
                    <td className="py-3 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">{row.boundary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">分流规则（决策时用）</h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          {rules.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">版本基线</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          {baseline.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: 验证**

Run: `cd projects/web-app && npm run build`
Expected: 编译通过；dev 访问 `/integration` 显示 12 行对照表 + 5 条规则 + 2 条基线；导航高亮「融合协议」。

- [ ] **Step 4: Commit**

```bash
git add app/integration-data.ts app/integration/page.tsx
git commit -m "feat: /integration 融合协议页（能力边界对照 + 分流规则）"
```

---

### Task 5: 全站验证（web-page-preview-check）

**Files:** 无（验证与截图产出）
- Create: `preview/` 下截图（gitignored）

**Interfaces:** 无（终端任务）。

- [ ] **Step 1: 生产构建**

Run: `cd projects/web-app && npm run build`
Expected: 0 error；路由清单含 `/`、`/principles`、`/decisions`、`/integration`。

- [ ] **Step 2: 起 dev + 四路由目检**

Run: `npm run dev`（后台）→ 轮询 curl 200；Playwright 依次访问 4 路由：
Expected: 每路由 `<title>` 正确；accessibility snapshot 核对结构（首页 12 行对照表/8 张原则卡/4 张决策卡/12 行融合表）；console level=warning 0 错误 0 警告。

- [ ] **Step 3: 截图交付**

截图（fullPage）：`preview/zcode-work-docs-home.png`（亮）+ `preview/zcode-work-docs-principles.png`（亮）+ `preview/zcode-work-docs-decisions.png`（亮）+ `preview/zcode-work-docs-integration.png`（亮）+ 首页暗色版。路径用相对 playwright cwd 的 `projects/web-app/preview/...`。

- [ ] **Step 4: 收尾**

Run: `netstat -ano | grep :3000` 找 PID → `taskkill //F //PID <pid>` → 再 netstat 确认端口释放。
Expected: 端口释放，无僵尸进程（记忆 dev-server-zombie）。

- [ ] **Step 5: 汇总提交**（若有未提交改动）

```bash
git add -A && git commit -m "chore: 文档站交付验证"
```

---

## Self-Review（writing-plans 要求）

**1. 规格覆盖**：
- 4 路由 → Task 1（layout/导航）+ Task 2/3/4（三子页）✅
- 内容勘误（8 条原则、D-001~D-004）→ Task 2/3 数据文件 ✅
- 融合协议 12 行 + 5 规则 + 2 基线 → Task 4 ✅
- 验证 + 截图存 preview/ → Task 5 ✅
- 不做 markdown 依赖/搜索/手动暗色切换 → 计划中未出现 ✅

**2. 占位符扫描**：所有代码块为完整内容，无 TBD/TODO/「类似 Task N」✅

**3. 类型一致性**：`principle`（num/title/essence）、`Decision`（id/title/problem/conclusion/verify）、`BoundaryRow`（domain/native/selfBuilt/boundary）在各 task 内定义且使用一致 ✅；`sourceDocs`（architecture-data.ts）在 layout 页脚使用与现有定义一致 ✅
