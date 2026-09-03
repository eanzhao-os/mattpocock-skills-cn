> 依赖：#1（构建门禁与链接检查依托 `site/` 工程）
> 联动：#2（mermaid 渲染纳入检查范围）

## 背景与现状（实测审计数据）

对 57 篇源文件的审计结果，以下特性存在渲染风险，需要自动化保障：

| 特性 | 现状 | 风险 |
|---|---|---|
| `<details>` 折叠英文原文 | 57 篇均有，块内含 ` ```markdown ` 围栏代码 | GitHub 靠「HTML 块前后空行」规则解析内部 markdown；Astro（remark）默认**不解析 HTML 块内的 markdown**，围栏会按原样文本输出，必须验证并处理 |
| 内部相对链接 `./name.md` | 共 136 处 | 站点侧必须全部重写且不能漏；源文件侧改动文件名即死链 |
| 页内锚点 `](#xxx)` | 5 种用法 | 中文标题的锚点 slug 生成规则 GitHub 与 Astro 可能不一致 |
| mermaid 代码块 | 1 处（`23-teach_LEARNING-RECORD-FORMAT.md`），#2 将新增约 10 处 | 站点默认不渲染；语法写错时 GitHub 显示为纯代码，不易发现 |
| 表格 / yaml 围栏 / 嵌套列表 | 大量 | 低风险，但需回归确认 |

**核心约束**：源文件必须保持**纯 GFM**（GitHub Flavored Markdown）——禁止 MDX 组件语法进入源文件，所有站点侧定制（frontmatter、链接重写、details 处理）只在 sync 脚本与 Starlight 配置层完成。这样 GitHub 网页阅读与 Agent 直接读取源文件两条路径都不受损。

## 目标

任何一篇文档在 **GitHub 网页** 与 **Astro 站点** 两侧渲染都不破版；引入破坏性语法时 CI 立即报错拦截。

## 方案

### 1. 先做一个 Spike：验证 `<details>` 在 Astro 中的实际行为（最先执行）

用最小 demo 验证 Starlight 对「`<details>` + `<summary>` + 内部围栏代码块」组合的渲染结果，然后二选一：

- **方案 A（首选）**：sync 脚本在生成 content docs 时，把 `<details>` 块内的 markdown 片段**预渲染为 HTML**（调用 remark 处理该片段后再嵌入），外层 `<details>/<summary>` 原样保留。GitHub 侧不动，站点侧正确渲染，折叠交互保留；
- **方案 B（降级）**：引入 rehype 插件（如 `rehype-raw` + 自定义处理）在构建期解析 HTML 块内 markdown。若两方案均有不可接受副作用，最终降级：sync 脚本将 details 段转换为 Starlight 原生 `<details>` 等价形态。

Spike 结论记录在本 issue 评论中，再推进后续任务。

### 2. 源文件 lint（防破坏于未然）

新增 `lint-md` 脚本（基于 remark-lint 或自写 Node 脚本），检查规则：

- `<details>` / `</details>` / `<summary>` 前后必须有空行（GitHub 解析内部 markdown 的硬性条件）；
- 围栏代码块必须闭合，语言标识合法；
- `](./xx-yy.md)` 链接目标文件必须存在（全量扫描交叉校验 136 处）；
- `](#anchor)` 锚点必须能由本文标题生成（按 GitHub slug 规则校验）；
- 禁止 MDX 语法（`import ` / `<Component` 大写开头标签）进入源文件；
- mermaid 块语法可解析（用 `mermaid.parse` 校验）。

接入 **pre-commit 或 CI**（仓库已有 `35-setup-pre-commit` 文档，按其约定落地）。

### 3. 构建门禁与产物链接检查（站点侧）

- CI 中 `npm run build`（含 sync）必须**零错误零警告**；开启 Astro 的 `markdown.shiki` 严格模式与 Starlight 的内链检查；
- 构建产物 `dist/` 跑链接扫描：自写脚本提取所有 `href`/`src`，站内路径逐一确认存在对应 HTML 文件（或用 `lychee` 离线模式）；
- mermaid 若采用构建期渲染（#2 任务 2 的方案 A），构建失败即拦截，无需额外检查；若为客户端渲染，加一条冒烟断言（见下）。

### 4. 渲染冒烟测试（代表性页面，Playwright）

选 4 个覆盖全部风险特性的页面（含 details 的常规页、含 mermaid 的页、含大表格的页、含深层嵌套列表的页），CI 中对构建产物起本地服务后截图断言：

- `<details>` 元素存在且可展开、内部代码块被高亮渲染（不是纯文本）；
- mermaid 渲染出 `svg` 节点；
- 页面无横向滚动条（移动端视口 375px）。

截图归档为 CI artifact 供人工抽查。

### 5. 中文锚点一致性

校验 GitHub 与 Astro/Starlight 对中文标题的锚点 slug 生成规则；若不一致，以 GitHub 规则为准，在站点侧配置 rehype-slug 对齐（保证同一锚点链接两侧都跳得通）。

## 任务拆解

- [ ] 1. Spike 验证 details 渲染行为，确定方案 A/B 并记录结论（无依赖，可立即开始）
- [ ] 2. 按 Spike 结论在 sync 脚本中实现 details 处理
- [ ] 3. 编写 `lint-md` 脚本（上述 6 条规则）并全量跑一遍 57 篇，修复存量问题
- [ ] 4. lint 接入 pre-commit 与 CI
- [ ] 5. CI 增加构建门禁 + dist 链接扫描（依赖 #1）
- [ ] 6. Playwright 冒烟测试 4 个代表页面
- [ ] 7. 中文锚点 slug 一致性校验与对齐

## 验收标准

- `lint-md` 全量 57 篇零告警，且对人为注入的 6 类错误样本逐条能拦截；
- CI 构建零错误零警告，dist 链接扫描零 404（覆盖全部 136 处重写后链接）;
- 4 个冒烟页面断言全绿，截图人工确认无破版；
- 同一文档的同一锚点在 GitHub 与站点两侧均可正确跳转；
- 源文件保持纯 GFM：`git grep -nE '^(import |export )' -- '*.md'` 无命中，无大写开头的 JSX 组件标签。
