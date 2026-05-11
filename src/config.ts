/**
 * Site configuration
 * Edit this file to customize your site settings.
 */

export const SITE = {
  /** Site title */
  title: 'MRT · 不见长安',
  /** Site description */
  description: '技术笔记 · Agent 实践 · 工具折腾 · 双城杂记',
  /** Site URL (used for RSS, sitemap, etc.) */
  url: 'https://mrt.vercel.app',
  /** Author name */
  author: 'MRT',
  /** Language */
  lang: 'zh-CN',
};

export const ANALYTICS = {
  /** Set to true to enable analytics */
  enabled: false,
  /** Analytics provider: 'umami' | 'plausible' | 'google' */
  provider: 'umami',
  /** Umami configuration */
  umami: {
    src: '', // e.g. 'https://umami.example.com/script.js'
    websiteId: '', // your website ID
  },
  /** Plausible configuration */
  plausible: {
    src: '', // e.g. 'https://plausible.example.com/js/script.js'
    domain: '', // your domain
  },
};
