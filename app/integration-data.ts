export type BoundaryRow = {
  domain: string;
  native: string;
  selfBuilt: string;
  boundary: string;
};

export const boundaryRows: BoundaryRow[] = [
  {
    domain: "记忆",
    native: "auto-memory（每会话注入 MEMORY.md 索引）",
    selfBuilt: "memory/（MEMORY/USER/topics）+ scripts/mem-*",
    boundary: "已融合：注入层存跨会话事实，档案层存档案/审计",
  },
  {
    domain: "联想",
    native: "会话注入索引 → 定向 Read",
    selfBuilt: "mem-recall.sh（会话外）",
    boundary: "会话内用原生索引；脚本仅供 cron/无人值守",
  },
  {
    domain: "技能触发",
    native: "Skill 工具扫描 SKILL.md 自动触发",
    selfBuilt: "frontmatter 规范 + skills/README.md 索引",
    boundary: "触发入口只在原生；自建只管写 SKILL.md 与登记",
  },
  {
    domain: "定时任务",
    native: "cron automations（CronCreate/CronList）",
    selfBuilt: "cron/jobs.json（定义存档）",
    boundary: "原生是唯一执行源；jobs.json 仅登记/审计",
  },
  {
    domain: "浏览器",
    native: "native IAB（Browser-Use，用户可见）",
    selfBuilt: "scripts/cdp.sh + chrome-cdp 技能",
    boundary: "需要人盯 → IAB；无人值守/批量 → CDP",
  },
  {
    domain: "桌面自动化",
    native: "UIA/MCP（若可用）",
    selfBuilt: "scripts/uia.sh + desktop-ops",
    boundary: "细颗粒走 MCP/UIA；脚本/闭环用 op.sh",
  },
  {
    domain: "执行记账",
    native: "—（无）",
    selfBuilt: "executions.jsonl + objections.jsonl + DECISIONS.md",
    boundary: "审计/证据链属自建（原生没有对应）",
  },
  {
    domain: "记忆卫生",
    native: "—（无）",
    selfBuilt: "scripts/mem-budget.sh / memory-maintenance",
    boundary: "自建（原生无预算概念）",
  },
  {
    domain: "技能度量",
    native: "—（无）",
    selfBuilt: "scripts/skill-usage.sh + .usage.json",
    boundary: "自建（补原生监控能力）",
  },
  {
    domain: "插件",
    native: "插件市场（official/claude）",
    selfBuilt: "plugins/（协议空壳）",
    boundary: "原生市场管第三方能力；自建只含协议约定",
  },
  {
    domain: "规范层",
    native: "skill（负一篇）",
    selfBuilt: "kind: norm + ai-norms",
    boundary: "norm 落点为 SKILL.md → 触发靠原生 SKILL 机制",
  },
  {
    domain: "安全",
    native: "Hook/预控（Mimosa）",
    selfBuilt: "scripts/security-audit.sh",
    boundary: "Hook 管实时拦截；脚本管定期/批量审计",
  },
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
