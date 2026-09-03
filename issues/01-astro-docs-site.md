> 阻塞：无（首个实施）
> 被阻塞方：#2（图表站点渲染依赖本站）、#3（CI 门禁依赖本站）

## 背景与现状

- 57 篇 Markdown 平铺在仓库根目录：35 篇主 Skill（`NN-slug.md`）+ 22 篇 Companion（`NN-slug_SUFFIX.md`）+ `README.md`。
- README 已维护 4 个 bucket 分类（`engineering/` `productivity/` `in-progress/` `misc/`）和完整导航，但 GitHub 网页阅读体验有限：无侧边栏、无全文搜索、无页内 TOC、无深色模式。
- 文档间有 **136 处** `./name.md` 形式的相对链接、若干 `#anchor` 页内锚点、每篇文末一个 `<details>` 折叠英文原文块；无图片、无 frontmatter。

## 目标

搭建 Astro 文档站，57 篇文档按 bucket 分组呈现，部署到 GitHub Pages，具备侧边栏导航 / 全文搜索 / 深色模式 / 中文界面。

## 关键决策

### 1. 框架：Astro + Starlight

用 Astro 官方文档主题 [Starlight](https://starlight.astro.build/zh-cn/)，理由：

- 自带侧边栏分组导航、Pagefind 全文搜索、深色模式、移动端适配、页内 TOC、"最后更新"时间、编辑链接，零自研成本；
- 原生支持 `zh-CN` 界面语言；
- 构建产物为纯静态 HTML，直接部署 GitHub Pages。

### 2. 源文件不动，站点放 `site/` 子目录 + 构建期 sync 脚本

根目录的 `.md` 是**单一事实源**（读者仍会在 GitHub 上直接浏览它们，链接与排版不能为站点牺牲）。因此不移动源文件，而是：

```
mattpocock-skills-cn/
├── 01-ask-matt.md              # 源文件，保持不动
├── ...
├── README.md
└── site/                       # Astro Starlight 工程
    ├── astro.config.mjs
    ├── package.json
    ├── scripts/
    │   └── sync-content.mjs    # 构建前把根目录 md 转换生成到 content docs
    └── src/
        └── content/
            └── docs/           # sync 脚本生成，加入 .gitignore
                ├── index.mdx           # 首页（hero + bucket 导航）
                ├── engineering/…
                ├── productivity/…
                ├── in-progress/…
                └── misc/…
```

`sync-content.mjs` 职责：

1. 扫描根目录 `NN-slug[_SUFFIX].md`，解析出序号 / slug / 是否为 companion；
2. 生成 frontmatter：`title` 取自首个 H1，`sidebar.order` 取序号，companion 标记 `sidebar.hidden` 或归入对应主文档的子分组；
3. 按 README 的 bucket 映射写入对应目录（映射表在脚本内显式维护一份，57 个文件名静态列出，新增文件时必须登记——脚本对未登记文件直接报错，防止漏收录）；
4. **链接重写**：`](./xx-yy.md)` → `](/<bucket>/xx-yy/)`；`](./xx-yy.md#anchor)` → 保留锚点同步重写；页内 `](#anchor)` 不动；
5. `README.md` 的分类表作为 `index.mdx` 首页素材来源（可手工定制首页，README 仅作参考）。

`package.json` 中：`"build": "node scripts/sync-content.mjs && astro build"`，`"dev": "node scripts/sync-content.mjs && astro dev"`。

### 3. Starlight 配置要点

- `astro.config.mjs`：`site: 'https://eancuznaivy.github.io'`，`base: '/mattpocock-skills-cn'`，Starlight `defaultLocale: 'zh-CN'`；
- sidebar 显式配置 4 个分组 + 每组按序号排序；companion 文档以「附属协议」子组折叠在所属主 Skill 下；
- 启用 `lastUpdated: true`（git 提交时间）、`editLink` 指回 GitHub 源文件。

### 4. 部署：GitHub Actions → GitHub Pages

`.github/workflows/deploy.yml`：push 到 `main` 触发 → `npm ci && npm run build`（工作目录 `site/`）→ `actions/deploy-pages`。仓库 Settings → Pages → Source 选 GitHub Actions。

## 任务拆解

- [ ] 1. `npm create astro@latest -- --template starlight` 初始化到 `site/`，按上文配置 `astro.config.mjs`
- [ ] 2. 编写 `site/scripts/sync-content.mjs`（文件名解析 + bucket 映射 + frontmatter 注入 + 链接重写 + 未登记文件报错）
- [ ] 3. 配置 sidebar 分组（engineering / productivity / in-progress / misc，companion 折叠到主文档下）
- [ ] 4. 定制首页 `index.mdx`（hero + 4 bucket 入口 + 首篇必读引导，参照 README 结构）
- [ ] 5. 新建 `.github/workflows/deploy.yml`，仓库 Pages 设置切到 GitHub Actions
- [ ] 6. 全量验证：`npm run build` 零错误；57 篇全部可访问且分组正确；136 处内部链接无 404；搜索可命中中文内容

## 验收标准

- `npm run build` 零错误零警告通过；
- 57 篇文档全部上线且归入正确 bucket，序号顺序正确；
- 任意页面的内部链接点击无 404（含锚点跳转）；
- 全文搜索可用，中文分词可命中；
- `https://eancuznaivy.github.io/mattpocock-skills-cn/` 线上可访问；
- 根目录源文件与 GitHub 网页阅读体验无任何变化。
