import type { Metadata } from "next";
import { decisions } from "../decisions-data";

export const metadata: Metadata = {
  title: "决策记录 · ZCode Work",
  description:
    "指导思想下的实际决策记录（DECISIONS.md 精编）：D-001 ~ D-004，结论 + 复查点。",
};

export default function DecisionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          DECISIONS.md
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          决策记录
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          每个动体系决策用七条显式推导，结论 + 依据 + 复查点记录在此；新决策追加，不改旧决策（历史不可篡改）。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {decisions.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div className="mb-3 flex items-baseline gap-3">
              <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                {d.id}
              </span>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {d.title}
              </h2>
            </div>
            <dl className="flex flex-col gap-2 text-[13px] leading-6">
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">问题</dt>
                <dd className="text-zinc-500 dark:text-zinc-400">{d.problem}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">结论</dt>
                <dd className="text-zinc-500 dark:text-zinc-400">{d.conclusion}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">验证/复查</dt>
                <dd className="text-zinc-500 dark:text-zinc-400">{d.verify}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
