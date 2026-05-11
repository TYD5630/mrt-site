/**
 * Wiki → Astro 内容导入脚本 v2
 * - concepts/ → src/content/blog/
 * - entities/ → src/content/docs/
 *
 * 处理：
 * 1. 保留 frontmatter，补充 Astro 必需字段
 * 2. [[wikilinks]] → [text](/docs/page)
 * 3. 覆盖重新导入（修复编码和双 frontmatter 问题）
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const WIKI = 'D:/wiki';
const SITE = 'D:/mrt-site';

const BLOG_TARGET = join(SITE, 'src/content/blog');
const DOCS_TARGET = join(SITE, 'src/content/docs');

const RULES = [
  { src: 'concepts', target: BLOG_TARGET, type: 'blog' },
  { src: 'entities', target: DOCS_TARGET, type: 'docs' },
];

const stats = { blog: 0, docs: 0, skipped: 0, errors: 0 };

// 确保目录存在
[BLOG_TARGET, DOCS_TARGET].forEach(d => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
});

function convertWikilinks(content) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, pageName) => {
    const slug = pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '');
    return `[${pageName}](/docs/${slug})`;
  });
}

function parseFrontmatter(content) {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, '\n');
  
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { fm: {}, body: normalized };

  const fm = {};
  const rawLines = match[1].split('\n');
  
  let currentKey = null;
  let currentArray = [];

  for (const line of rawLines) {
    // Try to match a key: value line
    const keyMatch = line.match(/^(\w[\w_-]*):\s*(.*)/);
    if (keyMatch) {
      // Save previous array if exists
      if (currentKey && currentArray.length > 0) {
        fm[currentKey] = [...currentArray];
        currentArray = [];
      }
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      
      if (val === '' || val === '[]') {
        // Array value follows on next lines
        currentArray = [];
      } else if (val.startsWith('[') && val.endsWith(']')) {
        // Inline array: [a, b, c]
        fm[currentKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      } else if (val === 'true') {
        fm[currentKey] = true;
      } else {
        fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
      }
    } else if (line.trim().startsWith('- ')) {
      // Array item
      currentArray.push(line.trim().slice(2).replace(/^['"]|['"]$/g, ''));
    }
  }
  
  // Flush last array
  if (currentKey && currentArray.length > 0) {
    fm[currentKey] = [...currentArray];
  }

  const body = normalized.slice(match[0].length).trimStart();
  return { fm, body };
}

function buildFrontmatter(fm, type) {
  const title = (fm.title || 'Untitled').replace(/"/g, '\\"');
  const created = (fm.created || '2026-05-05').trim();
  const updated = (fm.updated || created).trim();
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => t.replace(/"/g, '\\"')) : [];
  const desc = (fm.description || title).replace(/"/g, '\\"');

  let out = '---\n';
  out += `title: "${title}"\n`;
  out += `description: "${desc}"\n`;

  if (type === 'blog') {
    out += `pubDate: ${created}\n`;
    if (updated !== created) {
      out += `updatedDate: ${updated}\n`;
    }
    out += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
  } else {
    out += `sidebar:\n  order: 50\n  label: "${title}"\n`;
    if (tags.length > 0) {
      out += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
    }
  }

  out += '---\n\n';
  return out;
}

// Clean existing imported files first
console.log('🧹 Cleaning previously imported files...');
for (const rule of RULES) {
  if (existsSync(rule.target)) {
    const files = readdirSync(rule.target).filter(f => f.endsWith('.md'));
    // Only delete the ones we imported (not the original sample files)
    const wikiFiles = new Set(readdirSync(join(WIKI, rule.src)).filter(f => f.endsWith('.md')));
    for (const f of files) {
      if (wikiFiles.has(f)) {
        unlinkSync(join(rule.target, f));
      }
    }
    console.log(`  Cleaned ${rule.src} -> ${rule.type}/`);
  }
}

console.log('\n' + '='.repeat(50));

for (const rule of RULES) {
  const srcDir = join(WIKI, rule.src);
  if (!existsSync(srcDir)) {
    console.log(`⚠️  Directory not found: ${srcDir}`);
    continue;
  }

  const files = readdirSync(srcDir).filter(f => f.endsWith('.md'));
  console.log(`\n📂 ${rule.src}/ — ${files.length} files`);

  for (const file of files) {
    try {
      const raw = readFileSync(join(srcDir, file), 'utf-8');
      const { fm, body } = parseFrontmatter(raw);
      const convertedBody = convertWikilinks(body);
      const newFm = buildFrontmatter(fm, rule.type);

      const outPath = join(rule.target, file);
      writeFileSync(outPath, newFm + convertedBody + '\n', 'utf-8');
      console.log(`  ✅ ${file} → "${fm.title || file}"`);
      stats[rule.type]++;
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
      stats.errors++;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 导入统计');
console.log(`  📝 博客: ${stats.blog} 篇`);
console.log(`  📖 文档: ${stats.docs} 篇`);
console.log(`  ❌ 错误: ${stats.errors} 篇`);
console.log('='.repeat(50));
