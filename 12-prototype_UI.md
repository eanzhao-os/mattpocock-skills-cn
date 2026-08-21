# 12-prototype / UI.md 精读

## Meta

| 字段 | 值 |
|---|---|
| 对应主 Skill | `12-prototype` |
| bucket | engineering |
| 上游路径 | `skills/engineering/prototype/UI.md` |
| 角色定位 | UI 界面多变体交互切换原型规范（UI Prototype Specification） |
| 关联模块 | `12-prototype`、`16-codebase-design` |

---

## 原文 (Markdown)

```markdown
# UI Prototype

Generate **several radically different UI variations** on a single route, switchable from a floating bottom bar. The user flips between variants in the browser, picks one (or steals bits from each), then throws the rest away.

If the question is about logic/state rather than what something looks like — wrong branch. Use [LOGIC.md](./12-prototype_LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Two sub-shapes — strongly prefer sub-shape A

A UI prototype is much easier to judge when it's **butting up against the rest of the app** — real header, real sidebar, real data, real density. A throwaway route on its own is a vacuum: every variant looks fine in isolation. Default to sub-shape A whenever there's a plausible existing page to host the variants. Only reach for sub-shape B if the prototype genuinely has no nearby home.

### Sub-shape A — adjustment to an existing page (preferred)

The route already exists. Variants are rendered **on the same route**, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay — only the rendering swaps. This is the default; pick it unless there's a specific reason not to.

If the prototype is for something that doesn't yet have a page but *would naturally live inside one* (a new section of the dashboard, a new card on the settings screen, a new step in an existing flow) — that's still sub-shape A. Mount the variants inside the host page.

### Sub-shape B — a new page (last resort)

Only use this when the thing being prototyped genuinely has no existing page to live inside — e.g. an entirely new top-level surface, or a flow that can't be embedded anywhere sensible.

Create a **throwaway route** following whatever routing convention the project already uses — don't invent a new top-level structure. Name it so it's obviously a prototype (e.g. include the word `prototype` in the path or filename). Same `?variant=` pattern.

Before committing to sub-shape B, sanity-check: is there really no existing page this could be embedded in? An empty route hides design problems that a populated one would expose.

In both sub-shapes the floating bottom bar is identical.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise — cap there.

Write down the plan in one line, in the prototype's location or a top-of-file comment:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

This works whether the user is here to push back or not.

### 2. Generate radically different variants

Draft each variant. Hold each one to:

- The page's purpose and the data it has access to.
- The project's component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever).
- A clear exported component name, e.g. `VariantA`, `VariantB`, `VariantC`.

Variants must be **structurally different** — different layout, different information hierarchy, different primary affordance, not just different colours. Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code — adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A (existing page): keep all the existing data fetching above the switcher; only the rendered subtree changes per variant.

For sub-shape B (new page): the throwaway route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three pieces:

- **Left arrow** — cycles to the previous variant (wraps around).
- **Variant label** — shows the current variant key and, if the variant exports a name, that name too. e.g. `B — Sidebar layout`.
- **Right arrow** — cycles forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param (use the framework's router — `router.replace` on Next, `navigate` on React Router, etc) so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` arrow keys also cycle. Don't intercept arrow keys when an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (e.g. high-contrast pill, subtle shadow) so it's obviously not part of the design being evaluated.
- Hidden in production builds — gate on `process.env.NODE_ENV !== 'production'` or an equivalent check, so a stray prototype merge can't ship the bar to users.

Put the switcher in a single shared component so both sub-shapes can reuse it. Locate it wherever shared UI lives in the project.

### 5. Hand it over

Surface the URL (and the `?variant=` keys). The user will flip through whenever they get to it. The interesting feedback is usually **"I want the header from B with the sidebar from C"** — that's the actual design they want.

### 6. Capture the answer and clean up

Once a variant has won, capture the answer — which variant and why — then capture the prototype the way [SKILL.md](./12-prototype.md) describes. Fold the winner into the real code and move the rest onto the throwaway branch, not into main:

- **Sub-shape A** — fold the winner into the existing page; drop the losing variants and the switcher from main.
- **Sub-shape B** — promote the winning variant to a real route; drop the throwaway route and the switcher from main.

The full set of variants is the primary source, so it lands on the throwaway branch, not the bin — variant components and the switcher left in the main branch rot fast and confuse the next reader.

## Anti-patterns

- **Variants that differ only in colour or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point. Each variant should be free to throw out the layout.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant needs to mutate, point it at a stub — the question is "what should this look like", not "does the backend work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.
```

---

## 中文翻译

# 界面多变体交互切换原型规范（UI Prototype）

在单个路由上生成**若干套结构上截然不同的 UI 界面变体（UI variations）**，并通过屏幕底部悬浮条实现秒级无缝切换。用户直接在浏览器中自由翻看各个方案、选出最佳胜者（或各取所长拼装出最终方案），随后将多余的未入选代码果断舍弃。

> [!NOTE]
> 如果核心疑问是关于业务逻辑、数据状态而不是视觉与交互呈现 —— 这是错误的探索分支，请使用 [LOGIC.md](./12-prototype_LOGIC.md)。

---

## 1. 判定何时该采用本形态

- “这个全新页面到底该排版成什么模样？”；
- “在正式敲定开发前，我想为这个仪表盘看板多看几种不同的布局方案”；
- “给设置界面尝试一套完全不同的交互形态”；
- 任何如果不开工做原型、用户就得在脑子里纠结一整天的视觉探索场景。

---

## 2. 两种落地形态（强烈优先选择形态 A）

当 UI 原型**直接与真实应用的其余部分挨在一起**（伴随真实的导航栏、真实的侧边栏、真实业务数据与排版密度）时，其优劣立竿见影。完全孤立的空白路由就像无菌真空室：任何糟糕的设计在孤立状态下看起来都不错。只要存在现成页面可以挂载，**默认一律选择形态 A**；唯有在没有任何现成页面可容纳时，才使用形态 B。

### 形态 A：在既有宿主页面内原位微调（强烈推荐）
页面路由已经存在。所有的变体**在同一个路由下渲染**，通过 URL 搜索参数 `?variant=` 控制显隐。保留既有的一切数据获取（Data fetching）、路由参数与权限鉴权 —— **仅仅替换渲染的 UI 子树**。

哪怕原型是一个全新的模块（例如仪表盘中的新卡片、设置页的新 Tab），只要它未来天然会住进某个既有页面，依然属于形态 A —— 直接挂载进该宿主页面。

### 形态 B：挂载在全新临时路由上（最后的兜底手段）
仅用于该探索物料在全项目中完全找不到任何既有页面可以挂载的场景。
使用项目既有的路由规范新建一条**用后即弃的临时路由**（路径名中必须显式包含 `prototype` 标识，例如 `/prototype/settings`），同样采用 `?variant=` 驱动。

---

## 3. 标准落地六步法（Process）

### 第 1 步：明确疑问并锁定变体数量（默认 3 套）
默认产出 **3 套变体**。一旦超过 5 套，就会失去结构差异而沦为无休止的细碎噪音。在文件顶部注释中用一句话明确记录探索目标：
> “设置页面的三套截然不同的变体方案，挂载在既有 `/settings` 路由下，通过 `?variant=` 参数切换。”

### 第 2 步：生成结构上截然不同的变体组件
编写各个变体（`VariantA`、`VariantB`、`VariantC`）。严格约束：
- 变体之间必须是**底层骨架与信息层级上的本质差异**（例如侧边栏布局 vs 顶部 Tab 式 vs 卡片网格流式），而绝不是换个主题色或改两行文案的微调。如果两个方案长得太像，直接重写一个并明确禁止使用相似的排版网格。

### 第 3 步：通过 URL 参数串联各变体
在页面路由中组装多路分支：

```tsx
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

### 第 4 步：构建屏幕底部悬浮切换器（Floating Switcher）
在屏幕底部正中间固定一个轻量的悬浮胶囊栏：
- **左箭头**：循环切换到上一个变体；
- **变体标签**：显示当前变体代号与方案全名（如 `B — 抽屉式侧边栏布局`）；
- **右箭头**：循环切换到下一个变体；
- **交互规范**：点击箭头通过路由跳转实时更新 `?variant=` 参数（页面不刷新的同时支持链接分享与刷新持久化）；支持键盘 `←` 和 `→` 快捷键切换（输入框聚焦时自动放行）；生产环境打包时自动移除。

### 第 5 步：交付给用户并捕获“组合拼装”需求
将带参数的 URL 链接发给用户。用户最真实且高价值的反馈通常是：**“我想要方案 B 的头部导航，搭配方案 C 的侧边列表”** —— 这正是通过并列对照才得以激发的真正设计诉求。

### 第 6 步：吸收胜出方案并清理主干
一旦选出胜者：
- 将胜出方案重构吸收入正式代码，并在主分支中彻底删除未入选的变体代码与切换器组件；
- 将完整的全套变体历史推入用后即弃分支作为一手证据归档，防止残存的变体代码在主分支中腐化。

---

## 4. 常见反模式与避坑清单（Anti-patterns）

- **变体之间仅存在颜色或文案差异**：这不是原型探索，纯属细节微调；
- **变体之间过度共享布局组件**：共享基础按钮很正常，但共享 `<Layout>` 会扼杀排版的多样性可能；
- **为原型接入真实的写入修改接口（Mutations）**：原型是探索视觉排版的只读物料，写入操作统一打桩，不要去折腾真实后端写库；
- **将原型草稿代码直接当成生产代码合入**：原型是在免测试、极简容错的探索约束下编写的，合入生产时必须重新正规重构。
