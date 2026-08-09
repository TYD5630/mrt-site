export type Decision = {
  id: string;
  title: string;
  problem: string;
  conclusion: string;
  verify: string;
};

export const decisions: Decision[] = [
  {
    id: "D-001",
    title: "mem-recall.sh 去留（试用期搁置决策）",
    problem:
      "用户提示「你自带索引」，避免再造检索轮子；mem-recall.sh 已实现（200 行、可跑、有 cron 场景价值）但 use=0——未验证的资产是负债。",
    conclusion:
      "保留，降级为「试用期观察」——不再扩容；挂进 cron 周维护的「记忆维护」场景作为可调工具。",
    verify:
      "2026-08-09 立档；复查点 2026-08-23：若 bump mem-recall use 从未发生（无人用它），下月维护按 cron-config-no-drift 收编归档。",
  },
  {
    id: "D-002",
    title: "每周「用不上就下」自检（并入周维护）",
    problem:
      "机制/脚本/技能会「活下来但没人用」，噪音累积（窄核原则、自我失效预案·信号一）。",
    conclusion:
      "周维护新增一步：遍历 .zcode/skills/ 与 scripts/，连续 2 个维护周期 use=0 → 列为降级候选，过异议确认后收编（移 backups/ 保留历史，可回滚）。",
    verify: "2026-08-09 立档，并入周维护 prompt；复查点 = 每次周维护执行。",
  },
  {
    id: "D-003",
    title: "退场必带承接（螺旋收编）",
    problem:
      "D-002 只保证「收编可逆」，仍可能「急流勇退」——能力随组件一起消失。",
    conclusion:
      "周维护升级为「用不上就下 · 螺旋收编」：跑 scripts/deprecation-scan.sh 出候选，每项填「承接方」→ 过异议 → 收编进 backups/deprecated/ + 能力说明书留痕。",
    verify: "2026-08-09 立档，联动 AI-PRINCIPLES 八 + deprecation-scan.sh。",
  },
  {
    id: "D-004",
    title: "projects/ 项目约定 + project-scaffold 固化",
    problem:
      "用户要新建开发项目，但工作区无项目目录约定；bootstrap.sh 只自举当前工作区，不生成新项目骨架。",
    conclusion:
      "新增约定 projects/<kebab-case>/ + scripts/project-scaffold.sh + 技能 project-scaffold（frontmatter 含 name/description/triggers，已登记 usage）。",
    verify:
      "2026-08-09 立档并首用（web-app）；复查点 = skill-usage 报表 bump project-scaffold 计数 + 周维护。",
  },
];
