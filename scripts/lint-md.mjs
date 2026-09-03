#!/usr/bin/env node

/**
 * lint-md.mjs
 * Markdown 渲染正确性与语法完整性校验门禁
 *
 * 校验规则：
 * 1. details-blank-lines: <details> / </details> / <summary> 前后空行规则
 * 2. code-fence-closed: 围栏代码块必须正确闭合，语言标识合法
 * 3. relative-links-exist: 相对链接 (./xx-yy.md) 目标文件必须存在
 * 4. anchor-links-valid: 页内锚点 (#anchor) 必须在当前文档有对应标题
 * 5. no-mdx-syntax: 严禁 MDX 语法（import/export、大写 JSX 标签）进入源文件
 * 6. mermaid-syntax: mermaid 块声明与基本语法校验
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

export function githubSlug(text) {
  let clean = text.trim();
  // 移除图片与链接语法：保留文本
  clean = clean.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  clean = clean.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // 移除内联代码
  clean = clean.replace(/`([^`]+)`/g, '$1');
  // 移除粗体/斜体
  clean = clean.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');
  // 移除 HTML 标签
  clean = clean.replace(/<[^>]+>/g, '');

  return clean
    .toLowerCase()
    .trim()
    .replace(/[\s\t]+/g, '-')
    // 保留 Unicode 字母数字、连字符、下划线
    .replace(/[^\p{L}\p{N}\-_]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function lintMarkdown(content, filePath = 'unknown.md', options = {}) {
  const errors = [];
  const lines = content.split('\n');
  const baseDir = path.dirname(path.resolve(ROOT_DIR, filePath));

  // 1. 收集标题并计算 GitHub 锚点 Slug
  const headingSlugs = new Set();
  const slugCounts = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (hMatch) {
      const rawHeading = hMatch[1].trim();
      const baseSlug = githubSlug(rawHeading);
      if (baseSlug) {
        slugCounts[baseSlug] = (slugCounts[baseSlug] || 0) + 1;
        const finalSlug = slugCounts[baseSlug] === 1 ? baseSlug : `${baseSlug}-${slugCounts[baseSlug] - 1}`;
        headingSlugs.add(finalSlug);
      }
    }
  }

  // 2. 逐行解析代码块状态与各项规则
  let fenceStack = []; // 记录打开的围栏反引号数量与行号
  let inDetails = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : null;
    const nextLine = i < lines.length - 1 ? lines[i + 1] : null;

    // --- 围栏代码块解析 ---
    const fenceMatch = line.match(/^(`{3,})(.*)$/);
    if (fenceMatch) {
      const backticks = fenceMatch[1];
      const info = fenceMatch[2].trim();

      if (fenceStack.length === 0) {
        // 打开新围栏
        // 校验语言标识（若有）
        if (info && !/^[a-zA-Z0-9_\-+]+$/.test(info)) {
          errors.push({
            rule: 'code-fence-closed',
            line: lineNum,
            message: `代码块语言标识 "${info}" 包含非法字符`
          });
        }
        fenceStack.push({ length: backticks.length, line: lineNum, lang: info });
      } else {
        const currentFence = fenceStack[fenceStack.length - 1];
        if (backticks.length >= currentFence.length && info === '') {
          // 闭合当前围栏
          fenceStack.pop();
        } else if (backticks.length < currentFence.length) {
          // 嵌套在更长围栏内部的子围栏，允许合法存在
        }
      }
    }

    const inCodeBlock = fenceStack.length > 0;

    // --- 规则 1: details-blank-lines ---
    // 仅对真正的块级 HTML 标签生效（整行仅有标签或 summary），忽略表格与行内正文中的提及
    const trimmedLine = line.trim();
    const isBlockDetailsOpen = /^<details(?:\s+[^>]*)?>\s*$/i.test(trimmedLine);
    const isBlockDetailsClose = /^<\/details>\s*$/i.test(trimmedLine);
    const isBlockSummary = /^<summary(?:\s+[^>]*)?>.*<\/summary>\s*$/i.test(trimmedLine);

    if (isBlockDetailsOpen) {
      inDetails = true;
      if (prevLine !== null && prevLine.trim() !== '') {
        errors.push({
          rule: 'details-blank-lines',
          line: lineNum,
          message: '<details> 标签上一行必须为空行'
        });
      }
      if (nextLine !== null && nextLine.trim() !== '' && !/^<summary/i.test(nextLine.trim())) {
        errors.push({
          rule: 'details-blank-lines',
          line: lineNum,
          message: '<details> 标签下一行必须为空行或 <summary>'
        });
      }
    }

    if (isBlockSummary) {
      if (nextLine !== null && nextLine.trim() !== '') {
        errors.push({
          rule: 'details-blank-lines',
          line: lineNum,
          message: '<summary> 闭合标签下一行必须为空行'
        });
      }
    }

    if (isBlockDetailsClose) {
      inDetails = false;
      if (prevLine !== null && prevLine.trim() !== '') {
        errors.push({
          rule: 'details-blank-lines',
          line: lineNum,
          message: '</details> 标签上一行必须为空行'
        });
      }
      if (nextLine !== null && nextLine.trim() !== '') {
        errors.push({
          rule: 'details-blank-lines',
          line: lineNum,
          message: '</details> 标签下一行必须为空行或文末'
        });
      }
    }

    // --- 在代码块内部的代码检查规则 ---
    // Mermaid 语法检查在独立阶段专门处理

    // --- 代码块外部的检查规则 ---
    if (!inCodeBlock) {
      // 剥离行内反引号内容以防误判
      const lineWithoutInline = line.replace(/`[^`]+`/g, '');

      // 规则 5: no-mdx-syntax (import / export)
      if (/^(import |export )/.test(line.trimStart())) {
        errors.push({
          rule: 'no-mdx-syntax',
          line: lineNum,
          message: `源文件禁止包含 MDX 导入导出语句: "${line.trim()}"`
        });
      }

      // 规则 5: no-mdx-syntax (大写开头的 JSX 标签)
      const jsxMatch = lineWithoutInline.match(/<([A-Z][a-zA-Z0-9]*)[^>]*>/);
      if (jsxMatch) {
        errors.push({
          rule: 'no-mdx-syntax',
          line: lineNum,
          message: `源文件禁止包含大写 JSX 组件标签: <${jsxMatch[1]}>`
        });
      }

      // 规则 3: relative-links-exist (相对链接)
      const linkRegex = /\[([^\]]+)\]\(([^)#\s]+\.md)(#[^)\s]*)?\)/g;
      let lMatch;
      while ((lMatch = linkRegex.exec(lineWithoutInline)) !== null) {
        const href = lMatch[2];
        // 仅检查本地相对链接
        if (!href.startsWith('http://') && !href.startsWith('https://')) {
          const targetPath = path.resolve(baseDir, href);
          if (!fs.existsSync(targetPath)) {
            errors.push({
              rule: 'relative-links-exist',
              line: lineNum,
              message: `相对链接目标文件不存在: "${href}" (解析路径: ${targetPath})`
            });
          }
        }
      }

      // 规则 4: anchor-links-valid (页内锚点)
      const anchorRegex = /\[([^\]]+)\]\(#([^)\s]+)\)/g;
      let aMatch;
      while ((aMatch = anchorRegex.exec(lineWithoutInline)) !== null) {
        const anchor = decodeURIComponent(aMatch[2]);
        if (!headingSlugs.has(anchor)) {
          errors.push({
            rule: 'anchor-links-valid',
            line: lineNum,
            message: `页内锚点 "#${anchor}" 在当前文档中没有匹配的标题`
          });
        }
      }
    }
  }

  // 围栏未闭合检查
  if (fenceStack.length > 0) {
    const unclosed = fenceStack[0];
    errors.push({
      rule: 'code-fence-closed',
      line: unclosed.line,
      message: `代码块未闭合，起始于第 ${unclosed.line} 行 (\`\`\`${unclosed.lang})`
    });
  }

  // --- 规则 6: mermaid-syntax ---
  const mermaidBlocks = extractMermaidBlocks(content);
  for (const mb of mermaidBlocks) {
    const err = validateMermaid(mb.code);
    if (err) {
      errors.push({
        rule: 'mermaid-syntax',
        line: mb.startLine,
        message: `Mermaid 图表语法校验失败: ${err}`
      });
    }
  }

  return errors;
}

function extractMermaidBlocks(content) {
  const blocks = [];
  const lines = content.split('\n');
  let inMermaid = false;
  let startLine = -1;
  let codeLines = [];
  let fenceLength = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(`{3,})mermaid\s*$/);
    if (m && !inMermaid) {
      inMermaid = true;
      startLine = i + 1;
      fenceLength = m[1].length;
      codeLines = [];
      continue;
    }

    if (inMermaid) {
      const closeMatch = line.match(/^(`{3,})\s*$/);
      if (closeMatch && closeMatch[1].length >= fenceLength) {
        inMermaid = false;
        blocks.push({
          startLine,
          code: codeLines.join('\n')
        });
      } else {
        codeLines.push(line);
      }
    }
  }

  return blocks;
}

function validateMermaid(code) {
  const trimmed = code.trim();
  if (!trimmed) {
    return 'Mermaid 代码块内容不能为空';
  }

  const firstLine = trimmed.split('\n')[0].trim();
  const validDeclarations = [
    /^flowchart\s+(TD|TB|BT|RL|LR)/,
    /^graph\s+(TD|TB|BT|RL|LR)/,
    /^sequenceDiagram/,
    /^classDiagram/,
    /^stateDiagram/,
    /^erDiagram/,
    /^gantt/,
    /^pie/,
    /^gitGraph/
  ];

  const hasValidHeader = validDeclarations.some((reg) => reg.test(firstLine));
  if (!hasValidHeader) {
    return `未知的 Mermaid 图表声明类型: "${firstLine}"`;
  }

  // 括号对称性校验（忽略引号内的内容）
  let roundBrackets = 0; // ()
  let squareBrackets = 0; // []
  let curlyBrackets = 0; // {}

  for (const line of trimmed.split('\n')) {
    // 忽略注释
    if (line.trim().startsWith('%%')) continue;

    // 移除双引号字符串内的字符
    const cleanLine = line.replace(/"[^"]*"/g, '""');
    for (const char of cleanLine) {
      if (char === '(') roundBrackets++;
      else if (char === ')') roundBrackets--;
      else if (char === '[') squareBrackets++;
      else if (char === ']') squareBrackets--;
      else if (char === '{') curlyBrackets++;
      else if (char === '}') curlyBrackets--;

      if (roundBrackets < 0 || squareBrackets < 0 || curlyBrackets < 0) {
        return `括号不匹配或提前闭合: 行 "${line.trim()}"`;
      }
    }
  }

  if (roundBrackets !== 0) return `圆括号 () 未平衡闭合 (差值: ${roundBrackets})`;
  if (squareBrackets !== 0) return `方括号 [] 未平衡闭合 (差值: ${squareBrackets})`;
  if (curlyBrackets !== 0) return `花括号 {} 未平衡闭合 (差值: ${curlyBrackets})`;

  return null;
}

// --- CLI 入口 ---
export function runCli(targetPaths = []) {
  const targets = targetPaths.length > 0 ? targetPaths : [ROOT_DIR];
  const mdFiles = [];

  for (const target of targets) {
    const abs = path.resolve(ROOT_DIR, target);
    if (!fs.existsSync(abs)) {
      console.error(`Error: 路径不存在 ${target}`);
      process.exit(1);
    }
    const stat = fs.statSync(abs);
    if (stat.isFile() && abs.endsWith('.md')) {
      mdFiles.push(abs);
    } else if (stat.isDirectory()) {
      // 遍历所有 md 文件，跳过 node_modules / .git / site/dist
      const scanDir = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (['node_modules', '.git', 'dist', '.astro'].includes(entry.name)) continue;
            scanDir(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            mdFiles.push(fullPath);
          }
        }
      };
      scanDir(abs);
    }
  }

  console.log(`🔍 开始检查 ${mdFiles.length} 个 Markdown 文件...`);
  let totalErrors = 0;

  for (const file of mdFiles) {
    const rel = path.relative(ROOT_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    const errors = lintMarkdown(content, rel);

    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`\n❌ ${rel} (${errors.length} 个问题):`);
      for (const err of errors) {
        console.log(`   ${rel}:${err.line} [${err.rule}] ${err.message}`);
      }
    }
  }

  if (totalErrors === 0) {
    console.log(`\n✅ 检查通过！全量 ${mdFiles.length} 篇文档零告警零错误。`);
    return 0;
  } else {
    console.error(`\n💥 检查失败，共发现 ${totalErrors} 处违规。`);
    return 1;
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  const args = process.argv.slice(2);
  const code = runCli(args);
  process.exit(code);
}
