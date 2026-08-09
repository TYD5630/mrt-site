/**
 * ZCode Work 工作区架构 —— 单页总览的结构化数据源。
 *
 * 内容以工作区根目录文档为准（README.md / AGENTS.md / AI-PRINCIPLES.md /
 * DECISIONS.md / ZCODE-INTEGRATION.md），v1 硬编码于此，便于逐条精修排版。
 * 注意：文档更新后此处可能漂移，需人工同步。
 */

/** Hero 区 */
export const hero = {
  title: "ZCode Work 工作区",
  motto: "窄腰核心，能力在边缘",
  intro:
    "一个仿 Hermes 架构的 agent 工作区：内核（铁律 + 记忆 + 少量脚本）保持极窄，一切新能力以 skill / 脚本 / 插件的形式长在边缘。",
  source: "架构理念借鉴自 WSL 里的 Hermes Agent（Nous Research 的自进化 AI agent）。",
};

/** 架构对照表（Hermes → 本工作区） */
export type ComparisonRow = { hermes: string; zcode: string };

export const comparisonRows: ComparisonRow[] = [
  {
    hermes: "AGENTS.md（项目宪法 + Footprint 阶梯）",
    zcode: "AGENTS.md",
  },
  {
    hermes: "~/.hermes/memories/MEMORY.md（§ 分隔 + 字符预算 + 原子写）",
    zcode: "memory/",
  },
  {
    hermes: "skills/ 每目录一个 SKILL.md（frontmatter: name/description/triggers）",
    zcode: ".zcode/skills/（Skill 工具可发现；skills/ 仅作索引）",
  },
  {
    hermes: "curator 周期性收编技能（active→stale→archived 状态机）",
    zcode: "scripts/skill-usage.sh + .zcode/skills/.usage.json",
  },
  {
    hermes: "cron/scheduler + jobs.json + 执行记录",
    zcode: "cron/",
  },
  {
    hermes: "hermes doctor / backup / 运维脚本",
    zcode: "scripts/",
  },
  {
    hermes: "computer-use / UIA 桌面自动化（WSL 版移植）",
    zcode: "scripts/uia.sh + uia-cmd.ps1（见 windows-uia-automation 技能）",
  },
  {
    hermes: "Chrome CDP 浏览器自动化（WSL 版移植）",
    zcode: "scripts/cdp.sh + cdp-eval.js（见 chrome-cdp-control 技能）",
  },
  {
    hermes: "统一操作入口（app + UIA + CDP + OCR 一键）",
    zcode: "scripts/op.sh（见 desktop-ops 技能）",
  },
  {
    hermes: "插件协议 plugin.yaml + register(ctx)，四源发现",
    zcode: "plugins/",
  },
  {
    hermes: "config.yaml（行为配置）vs .env（密钥）分离",
    zcode: "config.yaml + .env.example",
  },
  {
    hermes: "logs / state / 备份",
    zcode: "logs/ / state/ / backups/",
  },
];

/** 目录速览（与 README.md 目录树一致） */
export const directoryTree = `work/
├── AGENTS.md       打工宪法：窄腰核心 + Footprint 阶梯 + 记忆铁律（每次开始必读）
├── README.md       本文件
├── config.yaml     行为配置（工作区偏好、预算、任务参数）
├── .env.example    密钥占位（真实密钥放 .env，永不入库）
├── memory/         记忆文件栈（MEMORY.md / USER.md / topics/）
├── .zcode/skills/  技能本体（SKILL.md，ZCode 可发现可触发）
├── skills/         技能索引清单（README，指向 .zcode/skills/）
├── scripts/        可执行运维脚本（bootstrap / healthcheck / backup / mem-budget）
├── cron/           定时任务清单 jobs.json + 执行记录 executions.jsonl
├── plugins/        扩展协议说明 + 示例插件骨架（暂不写真实代码）
├── logs/           运行日志
├── state/          会话/状态快照（异议裁决日志 objections.jsonl，只追加）
└── backups/        backup.sh 的输出目录`;

/** 三大铁律（AGENTS.md） */
export type Law = { num: string; title: string; why: string; how: string };

export const laws: Law[] = [
  {
    num: "壹",
    title: "窄腰核心，能力在边缘",
    why: "Hermes 的教训——每个核心工具/核心规则都会随每次调用支付成本（上下文、维护、出错面）。核心越窄，越不容易乱，越可预测。",
    how: "新增能力优先级：先用现有工具组合 → 写成 bash 脚本 + skill → 插件协议 → 最后才改核心。拒绝投机钩子、为「万一用得上」造的抽象、一个需求一张配置开关。",
  },
  {
    num: "贰",
    title: "记忆与上下文稳定性",
    why: "Hermes 把「前缀缓存神圣不可侵犯」当设计第一原则——长会话里反复重建上下文会放大成本和不一致。记忆文件就是「缓存前缀」。",
    how: "MEMORY.md / USER.md 快照式注入，会话中途不改写；写入走原子替换（临时文件 → rename）；预算超限时巩固（consolidate）而不是追加；删除记忆前确认过时且不影响进行中任务。",
  },
  {
    num: "叁",
    title: "行为配置与密钥分离",
    why: "密钥一旦进配置/代码/记忆/技能，就进了 .git 与备份，泄密不可逆。",
    how: "密钥只进 .env（git 忽略）；行为开关放 config.yaml；环境变量只承载「指向工作区路径」这类非密钥配置；新写文件前审视绝对路径/用户名/密钥，提交前跑 scripts/security-audit.sh。",
  },
];

/** 体系运转（自进化闭环） */
export type LoopCard = { title: string; desc: string };

export const loopCards: LoopCard[] = [
  {
    title: "记忆 · 双层融合",
    desc: "memory/ 档案层（MEMORY.md ≤2200 / USER.md ≤1375 / topics/ 长记忆）+ ZCode auto-memory 注入层（跨会话事实）。写入分流不双写、只指路。",
  },
  {
    title: "技能 · 自进化循环",
    desc: "skill-capture 捕获 → skill-usage.sh 登记（active→stale 30 天→archived 90 天状态机）→ 每周日审查收编 → 使用即 bump 刷新活跃。",
  },
  {
    title: "异议 · 裁决熔断",
    desc: "自动化裁决（归档/删除/cron 决策）先过 objection-checkpoint：预告 → 用户异议则挂起 → 执行或维持原状 → 留痕 state/objections.jsonl。",
  },
  {
    title: "插件 · 协议占位",
    desc: "plugins/ 保留 Hermes 形状协议（plugin.yaml 清单 + register(ctx)），目前是规格空壳，真实能力走技能路线。",
  },
  {
    title: "审计 · 三道账",
    desc: "cron/executions.jsonl（执行）+ state/objections.jsonl（裁决）+ logs/（运行日志）。动作有证据链，不靠感觉。",
  },
  {
    title: "原生融合",
    desc: "ZCode 原生能力是一等公民，自建只补原生缺的（如审计账本、记忆预算、技能度量）。冲突时原生协议 > 自建约定，见 ZCODE-INTEGRATION.md。",
  },
];

/** 页脚源文档 */
export const sourceDocs = [
  { name: "README.md", desc: "架构总览（本页数据源）" },
  { name: "AGENTS.md", desc: "打工宪法 · 三大铁律" },
  { name: "AI-PRINCIPLES.md", desc: "全局指导思想 · 价值观层" },
  { name: "DECISIONS.md", desc: "决策记录（七条推导）" },
  { name: "ZCODE-INTEGRATION.md", desc: "原生融合协议" },
];
