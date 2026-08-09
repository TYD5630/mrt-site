import {
  hero,
  comparisonRows,
  directoryTree,
  laws,
  loopCards,
} from "./architecture-data";

function SectionHeading({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          {num}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16 sm:py-20">
          <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
            D:\zcode\work · 仿 Hermes 架构的 agent 工作区
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {hero.title} <span className="text-emerald-600 dark:text-emerald-400">☤</span>
          </h1>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
            一句话画像：
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              {hero.motto}
            </span>
          </p>
          <p className="max-w-3xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
            {hero.intro}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{hero.source}</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-14">
        {/* 01 架构对照 */}
        <section>
          <SectionHeading
            num="01"
            title="架构对照：Hermes → 本工作区"
            subtitle="内核窄、边缘活——每个核心组件都能在 Hermes 上找到对应，能力以 skill / 脚本 / 插件长在边缘。"
          />
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                    <th className="pb-3 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                      Hermes 组件
                    </th>
                    <th className="pb-3 font-medium text-zinc-500 dark:text-zinc-400">
                      本工作区对应
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.hermes}
                      className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-800/60"
                    >
                      <td className="py-3 pr-4 font-mono text-[13px] leading-6 text-zinc-700 dark:text-zinc-300">
                        {row.hermes}
                      </td>
                      <td className="py-3 font-mono text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                        {row.zcode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* 02 目录速览 */}
        <section>
          <SectionHeading
            num="02"
            title="目录速览"
            subtitle="窄腰核心的物理布局——核心文件（AGENTS.md / config.yaml / .env.example）在根，能力与记录全部下沉到目录。"
          />
          <Card>
            <pre className="overflow-x-auto text-[13px] leading-6 text-zinc-700 dark:text-zinc-300">
              {directoryTree}
            </pre>
          </Card>
        </section>

        {/* 03 三大铁律 */}
        <section>
          <SectionHeading
            num="03"
            title="三大铁律（AGENTS.md）"
            subtitle="本文件是所有 agent 的工作宪法，冲突裁决顺序：AI-PRINCIPLES.md > AGENTS.md > skill > 默认行为。"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {laws.map((law) => (
              <Card key={law.title}>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    {law.num}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {law.title}
                  </h3>
                </div>
                <p className="mb-3 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    为什么：
                  </span>
                  {law.why}
                </p>
                <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    如何做：
                  </span>
                  {law.how}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* 04 体系运转 */}
        <section>
          <SectionHeading
            num="04"
            title="体系运转（自进化闭环）"
            subtitle="记忆、技能、异议、插件、审计、融合——六条闭环让体系自我进化，且每一步都有证据链。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loopCards.map((card) => (
              <Card key={card.title}>
                <h3 className="mb-2 text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
                  {card.title}
                </h3>
                <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
                  {card.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
