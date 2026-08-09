import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./nav-bar";
import { sourceDocs } from "./architecture-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZCode Work 工作区架构",
  description:
    "仿 Hermes 架构的 agent 工作区：窄腰核心、能力在边缘——铁律、记忆、技能、自进化闭环一览。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                源文档（工作区根目录）
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                本页为静态快照，权威内容以工作区文档为准。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sourceDocs.map((doc) => (
                <div
                  key={doc.name}
                  className="flex flex-col gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60"
                >
                  <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {doc.name}
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {doc.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
