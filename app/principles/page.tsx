import type { Metadata } from "next";
import { principles, rulingOrder } from "../principles-data";

export const metadata: Metadata = {
  title: "原则 · ZCode Work",
  description:
    "AI 全局指导思想（AI-PRINCIPLES.md 精编）：八条价值观层原则与冲突裁决顺序。",
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
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          AI-PRINCIPLES.md
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI 全局指导思想
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          本工作区所有 AI 必须遵循的顶层「价值观层」：宪法管怎么做，本文件管为什么。冲突裁决顺序：
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {rulingOrder.map((step, i) => (
            <span key={step} className="flex items-center gap-2 text-sm">
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {step}
              </span>
              {i < rulingOrder.length - 1 && (
                <span className="text-zinc-400">›</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.num}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                {p.num}
              </span>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {p.title}
              </h2>
            </div>
            <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
              {p.essence}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
