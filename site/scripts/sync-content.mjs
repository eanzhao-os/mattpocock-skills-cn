#!/usr/bin/env node

/**
 * sync-content.mjs
 * 在 Astro 构建/开发前，将仓库根目录的 59 篇单一事实源 Markdown 转换为 Starlight content docs。
 *
 * 核心功能：
 * 1. 静态维护 59 篇文档与 4 个 bucket 的完整映射表，未登记文件直接阻断报错；
 * 2. 提取首个 H1 注入 frontmatter（title、sidebar.order 等）；
 * 3. 将 136 处内部相对链接重写为站点完整路由路径，保持锚点跳转正常；
 * 4. 将 ```mermaid 代码块包装为 <div class="mermaid">，支持客户端双主题渲染；
 * 5. 生成结构化的 sidebar.json，将 companion 附属协议折叠收纳在主 Skill 下。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const SITE_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(SITE_DIR, 'src/content/docs');
const SIDEBAR_FILE = path.resolve(SITE_DIR, 'src/sidebar.json');

const BASE_PATH = '/mattpocock-skills-cn';

// 59 篇文档的静态显式映射表（若根目录新增或变动未在此登记，脚本会直接报错）
export const BUCKET_MAPPING = {
  // --- engineering/ (35 篇) ---
  '01-ask-matt.md': 'engineering',
  '01-ask-matt_PHASE-BOUNDARIES.md': 'engineering',
  '02-setup-matt-pocock-skills.md': 'engineering',
  '02-setup-matt-pocock-skills_domain.md': 'engineering',
  '02-setup-matt-pocock-skills_issue-tracker-github.md': 'engineering',
  '02-setup-matt-pocock-skills_issue-tracker-gitlab.md': 'engineering',
  '02-setup-matt-pocock-skills_issue-tracker-local.md': 'engineering',
  '02-setup-matt-pocock-skills_triage-labels.md': 'engineering',
  '05-grill-with-docs.md': 'engineering',
  '07-to-spec.md': 'engineering',
  '08-to-tickets.md': 'engineering',
  '09-tdd.md': 'engineering',
  '09-tdd_mocking.md': 'engineering',
  '09-tdd_tests.md': 'engineering',
  '10-implement.md': 'engineering',
  '11-code-review.md': 'engineering',
  '12-prototype.md': 'engineering',
  '12-prototype_LOGIC.md': 'engineering',
  '12-prototype_UI.md': 'engineering',
  '13-research.md': 'engineering',
  '14-diagnosing-bugs.md': 'engineering',
  '15-domain-modeling.md': 'engineering',
  '15-domain-modeling_ADR-FORMAT.md': 'engineering',
  '15-domain-modeling_CONTEXT-FORMAT.md': 'engineering',
  '16-codebase-design.md': 'engineering',
  '16-codebase-design_DEEPENING.md': 'engineering',
  '16-codebase-design_DESIGN-IT-TWICE.md': 'engineering',
  '17-improve-codebase-architecture.md': 'engineering',
  '17-improve-codebase-architecture_HTML-REPORT.md': 'engineering',
  '18-triage.md': 'engineering',
  '18-triage_AGENT-BRIEF.md': 'engineering',
  '18-triage_OUT-OF-SCOPE.md': 'engineering',
  '19-wayfinder.md': 'engineering',
  '20-wizard.md': 'engineering',
  '25-resolving-merge-conflicts.md': 'engineering',

  // --- productivity/ (12 篇) ---
  '03-grill-me.md': 'productivity',
  '04-grilling.md': 'productivity',
  '06-handoff.md': 'productivity',
  '21-wait-what.md': 'productivity',
  '22-writing-for-agents.md': 'productivity',
  '22-writing-for-agents_SKILL-MECHANICS.md': 'productivity',
  '23-teach.md': 'productivity',
  '23-teach_GLOSSARY-FORMAT.md': 'productivity',
  '23-teach_LEARNING-RECORD-FORMAT.md': 'productivity',
  '23-teach_MISSION-FORMAT.md': 'productivity',
  '23-teach_RESOURCES-FORMAT.md': 'productivity',
  '24-to-questionnaire.md': 'productivity',

  // --- in-progress/ (8 篇) ---
  '26-claude-handoff.md': 'in-progress',
  '27-loop-me.md': 'in-progress',
  '28-setup-ts-deep-modules.md': 'in-progress',
  '29-writing-beats.md': 'in-progress',
  '30-writing-fragments.md': 'in-progress',
  '31-writing-shape.md': 'in-progress',
  '36-implement-spec.md': 'in-progress',
  '37-retro.md': 'in-progress',

  // --- misc/ (4 篇) ---
  '32-git-guardrails-claude-code.md': 'misc',
  '33-migrate-to-shoehorn.md': 'misc',
  '34-scaffold-exercises.md': 'misc',
  '35-setup-pre-commit.md': 'misc'
};

const BUCKET_LABELS = {
  engineering: '🛠️ 工程主流程',
  productivity: '💡 效能协作',
  'in-progress': '🔬 探索演进',
  misc: '📦 基础工具'
};

function extractTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    let title = match[1].trim();
    // 移除 markdown 链接与代码
    title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    title = title.replace(/`([^`]+)`/g, '$1');
    return title;
  }
  return fallback;
}

// 正文中剥离首个 H1（frontmatter title 已由 Starlight 渲染为页面标题，避免重复）
function stripLeadingH1(content) {
  return content.replace(/^#\s+.+\n+/, '');
}

// 将 companion 后缀转为可读标签：PHASE-BOUNDARIES -> Phase Boundaries
function humanizeSuffix(suffix) {
  return suffix
    .toLowerCase()
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function syncContent() {
  console.log('🚀 开始执行 content 同步与转换...');

  // 1. 扫描根目录下的所有 Markdown 文件
  const rootFiles = fs.readdirSync(ROOT_DIR)
    .filter(f => /^[0-9]{2}-.*\.md$/.test(f));

  console.log(`📂 根目录共发现 ${rootFiles.length} 个 Skill/Companion Markdown 文件`);

  // 校验：所有扫描到的文件必须在 BUCKET_MAPPING 中
  for (const f of rootFiles) {
    if (!BUCKET_MAPPING[f]) {
      throw new Error(`💥 发现未登记的文件: "${f}"，请在 site/scripts/sync-content.mjs 的 BUCKET_MAPPING 中登记对应分类！`);
    }
  }

  // 校验：BUCKET_MAPPING 中的所有文件必须存在于根目录
  for (const f of Object.keys(BUCKET_MAPPING)) {
    if (!fs.existsSync(path.join(ROOT_DIR, f))) {
      throw new Error(`💥 登记的文件不存在于根目录: "${f}"！`);
    }
  }

  // 确保 public 目录下有本地 mermaid 资源
  const publicDir = path.resolve(SITE_DIR, 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const mermaidSrc = path.resolve(SITE_DIR, 'node_modules/mermaid/dist/mermaid.min.js');
  const mermaidDest = path.join(publicDir, 'mermaid.min.js');
  if (fs.existsSync(mermaidSrc) && !fs.existsSync(mermaidDest)) {
    fs.copyFileSync(mermaidSrc, mermaidDest);
    console.log('📦 成功复制本地 mermaid.min.js 到 public 目录');
  }

  // 确保目标 docs 目录结构存在
  const buckets = ['engineering', 'productivity', 'in-progress', 'misc'];
  for (const b of buckets) {
    fs.mkdirSync(path.join(DOCS_DIR, b), { recursive: true });
  }

  // 建立映射查询表：filename -> target slug
  const fileToSlug = {};
  for (const [file, bucket] of Object.entries(BUCKET_MAPPING)) {
    const baseName = file.replace(/\.md$/, '').toLowerCase();
    fileToSlug[file] = {
      bucket,
      baseName,
      slug: `${bucket}/${baseName}`,
      fullUrl: `${BASE_PATH}/${bucket}/${baseName}/`
    };
  }

  // 2. 逐篇转换并写入 content/docs
  const processedDocs = [];

  for (const file of rootFiles) {
    const { bucket, baseName, slug, fullUrl } = fileToSlug[file];
    const sourcePath = path.join(ROOT_DIR, file);
    const content = fs.readFileSync(sourcePath, 'utf8');

    const title = extractTitle(content, baseName);
    const order = parseInt(file.slice(0, 2), 10);
    const isCompanion = file.includes('_');

    // 转换内容：
    // (a) 将 ```mermaid ... ``` 替换为 <pre class="mermaid">，保证预格式化与 Smartypants 免疫
    let transformed = content.replace(/^```mermaid\s*\n([\s\S]*?)\n```$/gm, (m, code) => {
      const trimmedCode = code.trim();
      const escaped = escapeHtml(trimmedCode);
      return `<pre class="mermaid" data-code="${escaped}">\n${trimmedCode}\n</pre>`;
    });

    // (b) 链接重写：](./xx-yy.md#anchor) 或 (xx-yy.md#anchor)
    // 页内锚点 (#anchor) 保持不动
    transformed = transformed.replace(
      /\[([^\]]+)\]\(((\.\/)?([0-9]{2}-[a-zA-Z0-9_\-]+\.md))(#[^)\s]*)?\)/g,
      (match, linkText, fullHref, prefix, targetFile, anchor) => {
        const targetMeta = fileToSlug[targetFile];
        if (!targetMeta) {
          console.warn(`⚠️ 无法识别的目标文件: ${targetFile} (在 ${file} 中)`);
          return match;
        }
        const targetAnchor = anchor || '';
        return `[${linkText}](${targetMeta.fullUrl}${targetAnchor})`;
      }
    );

    // (c) 剥离正文首个 H1，避免与 Starlight 渲染的页面标题重复
    transformed = stripLeadingH1(transformed);

    // (c) 注入 frontmatter
    // 注意：如果原有内容头部有 frontmatter 或首个 H1，我们构建统一规范的 frontmatter
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `sidebar:`,
      `  order: ${order}`,
      ...(isCompanion ? [`  hidden: true`] : []),
      '---',
      ''
    ].join('\n');

    const finalContent = frontmatter + '\n' + transformed;
    const destPath = path.join(DOCS_DIR, bucket, `${baseName}.md`);
    fs.writeFileSync(destPath, finalContent, 'utf8');

    processedDocs.push({
      file,
      bucket,
      baseName,
      slug,
      title,
      order,
      isCompanion
    });
  }

  console.log(`✅ 成功转换并写入 ${processedDocs.length} 篇 content 文档`);

  // 3. 构建 sidebar 结构
  // 按照 bucket 分组，每个主文档带附属 companion 文档折叠
  const sidebar = buckets.map(bucket => {
    const bucketDocs = processedDocs.filter(d => d.bucket === bucket);
    // 按主文档聚类
    const mainDocs = bucketDocs.filter(d => !d.isCompanion).sort((a, b) => a.order - b.order);
    const companionDocs = bucketDocs.filter(d => d.isCompanion);

    const items = [];
    for (const main of mainDocs) {
      // 提取主文档简洁英文名，如 "01. ask-matt"
      const mainEnglishSlug = main.baseName.replace(/^[0-9]{2}-/, '');
      const mainLabel = `${main.file.slice(0, 2)}. ${mainEnglishSlug}`;

      // 查找属于该主文档的 companion（主文件名前缀一致）
      const prefix = main.file.replace(/\.md$/, '') + '_';
      const companions = companionDocs.filter(c => c.file.startsWith(prefix));

      if (companions.length > 0) {
        // 创建折叠子分组，全部使用简洁英文名
        items.push({
          label: mainLabel,
          collapsed: true,
          items: [
            { label: '📖 正文', slug: main.slug },
            ...companions.map(c => {
              const compSuffix = c.file.replace(/^[0-9]{2}-[^_]+_/, '').replace(/\.md$/, '');
              return {
                label: `📎 ${humanizeSuffix(compSuffix)}`,
                slug: c.slug
              };
            })
          ]
        });
      } else {
        items.push({
          label: mainLabel,
          slug: main.slug
        });
      }
    }

    return {
      label: BUCKET_LABELS[bucket],
      items
    };
  });

  fs.writeFileSync(SIDEBAR_FILE, JSON.stringify(sidebar, null, 2), 'utf8');
  console.log(`📋 成功生成 sidebar 结构: ${SIDEBAR_FILE}`);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  try {
    syncContent();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
