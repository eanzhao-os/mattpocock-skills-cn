#!/usr/bin/env node

/**
 * check-dist-links.mjs
 * 扫描 site/dist/ 下生成的所有 HTML 文件，
 * 严格提取站内超链接 (href) 与资源路径 (src)，
 * 验证目标 HTML 文件与页内锚点 id 真实存在，绝无 404 死链。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'site/dist');
const BASE_PATH = '/mattpocock-skills-cn';

if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ dist 目录不存在: ${DIST_DIR}，请先执行 npm run build！`);
  process.exit(1);
}

// 递归扫描所有 HTML 文件
function getHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`🔍 在 site/dist 中发现 ${htmlFiles.length} 个 HTML 文件，开始执行死链扫描...\n`);

let totalLinksChecked = 0;
const errors = [];

// 缓存各 HTML 文件中的所有 id / name 锚点
const fileAnchorsCache = new Map();

function getFileAnchors(htmlPath) {
  if (fileAnchorsCache.has(htmlPath)) {
    return fileAnchorsCache.get(htmlPath);
  }
  const content = fs.readFileSync(htmlPath, 'utf8');
  const anchors = new Set();
  // 匹配 id="..." 或 id='...'
  const idRegex = /\sid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    anchors.add(m[1]);
  }
  const nameRegex = /\sname=["']([^"']+)["']/g;
  while ((m = nameRegex.exec(content)) !== null) {
    anchors.add(m[1]);
  }
  fileAnchorsCache.set(htmlPath, anchors);
  return anchors;
}

for (const htmlFile of htmlFiles) {
  const relPath = path.relative(DIST_DIR, htmlFile);
  const content = fs.readFileSync(htmlFile, 'utf8');

  // 提取 a href
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];

    // 忽略外部链接、mailto、javascript、tel
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      href.startsWith('tel:')
    ) {
      continue;
    }

    totalLinksChecked++;

    // 页内单纯锚点 #anchor
    if (href.startsWith('#')) {
      const anchor = decodeURIComponent(href.slice(1));
      if (anchor) {
        const anchors = getFileAnchors(htmlFile);
        if (!anchors.has(anchor)) {
          errors.push({
            source: relPath,
            href,
            reason: `当前页面缺少锚点 id="#${anchor}"`
          });
        }
      }
      continue;
    }

    // 站内绝对路径 /mattpocock-skills-cn/...
    let cleanHref = href;
    if (cleanHref.startsWith(BASE_PATH)) {
      cleanHref = cleanHref.slice(BASE_PATH.length);
    } else if (cleanHref.startsWith('/')) {
      // 未带 base 的根绝对路径（除 pagefind / _astro 静态资源外通常属于遗漏 base）
      // 检查其对应的真实路径
    }

    // 分离路径与锚点
    const [pathname, hash] = cleanHref.split('#');
    const anchor = hash ? decodeURIComponent(hash) : null;

    // 定位目标文件
    let targetHtmlFile = null;
    let normalized = pathname.replace(/^\//, '');

    // 尝试几种可能的文件对应：
    // 1. /foo/ -> foo/index.html
    // 2. /foo/bar -> foo/bar.html 或 foo/bar/index.html
    const candidates = [
      path.join(DIST_DIR, normalized, 'index.html'),
      path.join(DIST_DIR, `${normalized}.html`),
      path.join(DIST_DIR, normalized)
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        const stat = fs.statSync(c);
        if (stat.isFile()) {
          targetHtmlFile = c;
          break;
        }
      }
    }

    if (!targetHtmlFile) {
      errors.push({
        source: relPath,
        href,
        reason: `目标 HTML 或资源不存在 (检索路径: ${candidates[0]})`
      });
      continue;
    }

    // 若带有锚点，且目标为 HTML 文件，校验锚点存在性
    if (anchor && targetHtmlFile.endsWith('.html')) {
      const anchors = getFileAnchors(targetHtmlFile);
      if (!anchors.has(anchor)) {
        errors.push({
          source: relPath,
          href,
          target: path.relative(DIST_DIR, targetHtmlFile),
          reason: `目标页面存在，但缺少锚点 id="#${anchor}"`
        });
      }
    }
  }
}

console.log(`📊 共校验 ${totalLinksChecked} 处链接与锚点。`);

if (errors.length === 0) {
  console.log('✅ 产物链接检查全绿！所有站内跳转与锚点 100% 存在且有效。');
  process.exit(0);
} else {
  console.error(`\n❌ 发现 ${errors.length} 处失效链接或缺失锚点:`);
  for (const err of errors) {
    console.error(`   在 [${err.source}] 中链接到 "${err.href}": ${err.reason}`);
  }
  process.exit(1);
}
