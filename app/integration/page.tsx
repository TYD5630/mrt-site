import type { Metadata } from "next";
import { boundaryRows, rules, baseline } from "../integration-data";

export const metadata: Metadata = {
  title: "融合协议 · ZCode Work",
  description:
    "ZCode ↔ 工作区融合协议（ZCODE-INTEGRATION.md 精编）：能力边界对照 + 分流规则 + 版本基线。",
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
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          ZCODE-INTEGRATION.md
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ZCode ↔ 工作区 融合协议
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          原生能力是一等公民；自建只做「原生没有或成本更高」的部分。
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          能力边界对照
        </h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    领域
                  </th>
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    ZCode 原生
                  </th>
                  <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    工作区自建
                  </th>
                  <th className="pb-3 font-medium text-zinc-500 dark:text-zinc-400">
                    分工/边界
                  </th>
                </tr>
              </thead>
              <tbody>
                {boundaryRows.map((row) => (
                  <tr
                    key={row.domain}
                    className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                      {row.domain}
                    </td>
                    <td className="py-3 pr-4 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                      {row.native}
                    </td>
                    <td className="py-3 pr-4 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                      {row.selfBuilt}
                    </td>
                    <td className="py-3 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                      {row.boundary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          分流规则（决策时用）
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          {rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          版本基线
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          {baseline.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
