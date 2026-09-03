#!/usr/bin/env node

/**
 * smoke-test.mjs
 * 使用 Playwright 对构建产物进行代表性页面的渲染冒烟断言：
 * 1. 验证 <details> 存在且可展开，内部代码块语法高亮；
 * 2. 验证 Mermaid 流程图正确渲染出 <svg> 节点；
 * 3. 验证 375px 移动端视口下无横向滚动条破版；
 * 4. 保存各页面在桌面端与移动端的截图至 screenshots/ 目录。
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'site/dist');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'screenshots');
const BASE_PATH = '/mattpocock-skills-cn';

if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ dist 目录未找到: ${DIST_DIR}，请先执行 npm run build！`);
  process.exit(1);
}

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// 启动本地静态测试服务器
function createServer() {
  return http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];

    // 适配 BASE_PATH
    if (reqUrl.startsWith(BASE_PATH)) {
      reqUrl = reqUrl.slice(BASE_PATH.length);
    }

    if (reqUrl === '' || reqUrl === '/') {
      reqUrl = '/index.html';
    } else if (reqUrl.endsWith('/')) {
      reqUrl += 'index.html';
    }

    const filePath = path.join(DIST_DIR, reqUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.json': 'application/json'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    }
  });
}

// 选取的 4 个代表性测试页面
const TEST_PAGES = [
  {
    name: '01-ask-matt',
    path: `${BASE_PATH}/engineering/01-ask-matt/`,
    hasMermaid: true,
    hasDetails: true
  },
  {
    name: '09-tdd',
    path: `${BASE_PATH}/engineering/09-tdd/`,
    hasMermaid: true,
    hasDetails: true
  },
  {
    name: '18-triage',
    path: `${BASE_PATH}/engineering/18-triage/`,
    hasMermaid: true,
    hasDetails: true
  },
  {
    name: '23-teach',
    path: `${BASE_PATH}/productivity/23-teach/`,
    hasMermaid: false,
    hasDetails: true
  }
];

async function run() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`🌐 本地测试服务器已启动在 ${baseUrl}${BASE_PATH}/\n`);

  const browser = await chromium.launch({ headless: true });
  let failed = false;

  try {
    for (const testPage of TEST_PAGES) {
      console.log(`🧪 正在冒烟测试页面: ${testPage.name} (${testPage.path})`);

      // 1. 桌面端测试 (1280x800)
      const desktopContext = await browser.newContext({
        viewport: { width: 1280, height: 800 }
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(`${baseUrl}${testPage.path}`, { waitUntil: 'networkidle' });

      // 断言: details 标签存在且可展开
      if (testPage.hasDetails) {
        const detailsEl = await desktopPage.$('details');
        if (!detailsEl) {
          throw new Error(`[${testPage.name}] 未找到 <details> 元素！`);
        }
        // 点击展开
        const summary = await desktopPage.$('details summary');
        if (summary) await summary.click();

        // 验证代码块被高亮渲染（包含 expressive-code 或 pre 节点，非纯文本）
        const codeBlock = await desktopPage.$('details .expressive-code, details pre');
        if (!codeBlock) {
          throw new Error(`[${testPage.name}] <details> 展开后未找到代码高亮块！`);
        }
        console.log(`  ✓ <details> 展开与代码高亮断言通过`);
      }

      // 断言: mermaid 渲染出 <svg> 节点
      if (testPage.hasMermaid) {
        // 等待 mermaid 客户端脚本执行
        await desktopPage.waitForSelector('.mermaid svg', { timeout: 5000 });
        const svgCount = await desktopPage.$$eval('.mermaid svg', (svgs) => svgs.length);
        if (svgCount === 0) {
          throw new Error(`[${testPage.name}] Mermaid 未渲染出 <svg> 节点！`);
        }
        console.log(`  ✓ Mermaid 渲染成功，捕获到 ${svgCount} 个 SVG 节点`);
      }

      // 截图保存
      const desktopScreenshot = path.join(SCREENSHOTS_DIR, `${testPage.name}-desktop.png`);
      await desktopPage.screenshot({ path: desktopScreenshot, fullPage: false });
      await desktopContext.close();

      // 2. 移动端测试 (375x667 视口)
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(`${baseUrl}${testPage.path}`, { waitUntil: 'networkidle' });

      // 移动端无横向滚动条断言
      const hasHorizontalScroll = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
        throw new Error(`[${testPage.name}] 移动端 (375px) 发生横向溢出破版 (scrollWidth=${scrollWidth})！`);
      }
      console.log(`  ✓ 移动端 375px 视口无横向溢出滚动`);

      const mobileScreenshot = path.join(SCREENSHOTS_DIR, `${testPage.name}-mobile.png`);
      await mobilePage.screenshot({ path: mobileScreenshot, fullPage: false });
      await mobileContext.close();

      console.log(`  📸 截图已生成: ${testPage.name}-desktop.png & ${testPage.name}-mobile.png\n`);
    }

    console.log('🎉 所有 4 个代表性页面的渲染冒烟测试全绿！');
  } catch (err) {
    console.error(`💥 冒烟测试失败:`, err.message);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  process.exit(failed ? 1 : 0);
}

run();
