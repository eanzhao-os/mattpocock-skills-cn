# 17-improve-codebase-architecture / HTML-REPORT.md 精读（可视化架构审查报告格式与图表规范（HTML Report Format））

整个代码库架构审查的结果，统一渲染为一个生成在系统临时目录下的**单文件、自包含的 HTML 诊断报告**。通过 CDN 引入 Tailwind CSS 与 Mermaid.js。Mermaid 负责稳定绘制网络拓扑与调用流向图；手写的原生 HTML `<div>` 与行内 SVG 负责排版感更强的图表（如体积块图、剖面切片图）。将两者有机结合 —— 切勿全盘死板依赖 Mermaid，否则页面会显得极其千篇一律与僵硬。

---

## 1. 报告 HTML 骨架（Scaffold）

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>代码库架构深度审查报告 — {{仓库名称}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; } /* 虚线代表架构接缝 */
      .leak { stroke: #dc2626; }       /* 红色线条代表逻辑泄漏 */
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); } /* 深色块代表深模块 */
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

---

## 2. 报告头部（Header）

显示代码库名称、生成日期，以及极其紧凑的图例指南：实线框 = 模块，虚线 = 架构接缝，红色箭头 = 越权泄漏，加粗深色块 = 深模块。**拒绝任何冗长的客套导言**，直接切入核心候选方案。

---

## 3. 候选方案卡片（Candidate card）

**图表是全篇的核心灵魂。文字叙述必须极其精炼、干脆，并严格使用规范术语（来自 `/codebase-design` skill 的术语表）**。

每一个候选改造点作为一个独立的 `<article>` 卡片呈现：
- **标题** — 精悍短小，直击加深本质（例如：“将订单接收管道折叠成深模块”）；
- **推荐等级徽章** — 推荐强度（`强烈推荐 Strong` = 翡翠绿，`值得探索 Worth exploring` = 琥珀黄，`探索性建议 Speculative` = 石板灰），外加一个依赖分类标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）；
- **涉及文件清单** — 等宽字体代码列表；
- **重构前（Before）与重构后（After）对比图** — 整个卡片的视觉中心！双列并排对照；
- **核心痛点（Problem）** — 仅用一句话阐明当前架构哪里最伤；
- **解决方案（Solution）** — 仅用一句话概括重构动作；
- **架构收益（Wins）** — 无序列表，每条不超过 6 个词（如“测试只需命中一个接口”、“彻底杜绝定价逻辑越权泄漏”、“直接删掉 4 个空壳浅包装类”）；
- **ADR 决策提示** — 仅在适用时用琥珀色高亮框提示一行。

> [!IMPORTANT]
> **绝对禁止大段大段的文字解释**。如果一张架构图必须配上一大段文字才能让人看懂，说明这张图画得太烂 —— **直接重新画图**。

---

## 4. 架构图绘制五大经典模式（Diagram patterns）

### 模式一：Mermaid 流程图（依赖关系与调用链的标准主力）
当核心痛点是“X 调用 Y 调用 Z，导致调用链路一团乱麻”时使用。用 `classDef` 将越权泄漏的边标为红色，将聚合后的深模块标为深色。时序图非常适合用来展示“重构前需要 6 次往返调用，重构后只需 1 次”。

### 模式二：手写框线与 SVG 箭头（对抗 Mermaid 布局混乱时的利器）
使用带边框和标签的 `<div>` 模拟模块，使用绝对定位的行内 SVG `<path>` 绘制箭头。当你希望在“重构后”直观呈现一个厚重边框的深模块、内部包含暗化的私有逻辑时使用 —— Mermaid 渲染不出这种厚重感。

### 模式三：剖面切片图（Cross-section，最适合展示无脑层层透传的浅层架构）
使用水平色块堆叠呈现调用所穿透的层级。重构前：6 个极薄的浅层，层层只做转发；重构后：整合成 1 个厚实的深层色块，标注出整合后的业务职责。

### 模式四：体积块图（Mass diagram，用于展示“接口与实现几乎等宽”的浅模块病症）
每个模块画两个矩形 —— 一个代表对外公开接口的面积，一个代表内部实现的面积。重构前：接口矩形几乎和实现矩形一样高（典型的浅模块）；重构后：接口矩形极窄极短，而实现矩形庞大深厚（高质量深模块）。

### 模式五：调用拓扑折叠图（Call-graph collapse）
重构前：繁杂的函数调用树呈现为层层嵌套的碎盒子；重构后：整棵树折叠进一个大盒子，原本的外部调用全部虚化隐入盒子内部。

---

## 5. 语言风格与术语红线（Tone & Terms）

行文严禁含糊其辞（Hedging），杜绝任何“值得一提的是……”等无谓客套话。如果一句话能写成 Bullet 要点，直接写成要点；如果一个要点能删，果断删掉。如果某个术语不在 `/codebase-design` 术语表中，先从中找一个现成的，而不是急着发明新词。

### 严格统一的术语体系：
- 严格使用：`module`（模块）、`interface`（接口）、`implementation`（实现）、`depth`（深度）、`deep`（深模块）、`shallow`（浅模块）、`seam`（接缝）、`adapter`（适配器）、`leverage`（杠杆率）、`locality`（局部性）；
- **严禁滥用模糊替代词**：绝不要用 component / service / unit 替代 module；绝不要用 API / signature 替代 interface；绝不要用 boundary 替代 seam；绝不要用 layer / wrapper 替代 module；
- 收益清单中严禁用“更容易维护”或“代码更整洁”等毫无信息量的空话废话 —— 必须使用架构词汇精准量化（如 *“locality: 所有的 Bug 全部收拢在单个模块内”*、*“leverage: 仅暴露 1 个精简接口，服务 N 个调用点”*、*“接口收窄；实现吸收掉包装”*）。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `17-improve-codebase-architecture` |
| bucket | engineering |
| 上游路径 | `skills/engineering/improve-codebase-architecture/HTML-REPORT.md` |
| 角色定位 | 可视化架构审查报告格式与图表排版规范（HTML Report Format） |
| 关联模块 | `17-improve-codebase-architecture`、`16-codebase-design` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# HTML Report Format

The architectural review is rendered as a single self-contained HTML file in the OS temp directory. Tailwind and Mermaid both come from CDNs. Mermaid handles graph-shaped diagrams reliably; hand-built divs and inline SVG handle the more editorial visuals (mass diagrams, cross-sections). Mix the two — don't lean on Mermaid for everything, it'll start to look generic.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

Repo name, date, and a compact legend: solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module. No introduction paragraph — straight into the candidates.

## Candidate card

The diagrams carry the weight. Prose is sparse, plain, and uses the glossary terms (from the `/codebase-design` skill) without ceremony.

Each candidate is one `<article>`:

- **Title** — short, names the deepening (e.g. "Collapse the Order intake pipeline").
- **Badge row** — recommendation strength (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), plus a tag for the dependency category (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** — monospaced list, `font-mono text-sm`.
- **Before / After diagram** — the centrepiece. Two columns, side by side. See patterns below.
- **Problem** — one sentence. What hurts.
- **Solution** — one sentence. What changes.
- **Wins** — bullets, ≤6 words each. e.g. "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (if applicable) — one line in an amber-tinted box.

No paragraphs of explanation. If the diagram needs a paragraph to be understood, redraw the diagram.

## Diagram patterns

Pick the pattern that fits the candidate. Mix them. Don't make every diagram look the same — variety is part of the point.

### Mermaid graph (the workhorse for dependencies / call flow)

Use a Mermaid `flowchart` or `graph` when the point is "X calls Y calls Z, and look at the mess." Wrap it in a Tailwind-styled card so it doesn't feel parachuted in. Style with classDef to colour leakage edges red and the deep module dark. Sequence diagrams work well for "before: 6 round-trips; after: 1."

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Hand-built boxes-and-arrows (when Mermaid's layout fights you)

Modules as `<div>`s with borders and labels. Arrows as inline SVG `<line>` or `<path>` elements positioned absolutely over a relative container. Reach for this when you want the "after" diagram to feel like one thick-bordered deep module with greyed-out internals — Mermaid won't render that with the right weight.

### Cross-section (good for layered shallowness)

Stack horizontal bands (`h-12 border-l-4`) to show layers a call passes through. Before: 6 thin layers each doing nothing. After: 1 thick band labelled with the consolidated responsibility.

### Mass diagram (good for "interface as wide as implementation")

Two rectangles per module — one for interface surface area, one for implementation. Before: interface rectangle is nearly as tall as the implementation rectangle (shallow). After: interface rectangle is short, implementation rectangle is tall (deep).

### Call-graph collapse

Before: a tree of function calls rendered as nested boxes. After: the same tree collapsed into one box, with the now-internal calls shown faded inside it.

## Style guidance

- Lean editorial, not corporate-dashboard. Generous whitespace. Serif optional for headings (`font-serif` works well with stone/slate).
- Colour sparingly: one accent (emerald or indigo) plus red for leakage and amber for warnings.
- Keep diagrams ~320px tall so before/after sits comfortably side by side without scrolling.
- Use `text-xs uppercase tracking-wider` for module labels inside diagrams — they should read as schematic, not as UI.
- The only scripts are the Tailwind CDN and the Mermaid ESM import. The report is otherwise static — no app code, no interactivity beyond Mermaid's own rendering.

## Top recommendation section

One larger card. Candidate name, one sentence on why, anchor link to its card. That's it.

## Tone

Plain English, concise — but the architectural nouns and verbs come straight from the `/codebase-design` skill. Concision is not an excuse to drift.

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit (for module) · API, signature (for interface) · boundary (for seam) · layer, wrapper (for module, when you mean module).

**Phrasings that fit the style:**

- "Order intake module is shallow — interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** name the gain in glossary terms: *"locality: bugs concentrate in one module"*, *"leverage: one interface, N call sites"*, *"interface shrinks; implementation absorbs the wrappers"*. Don't write *"easier to maintain"* or *"cleaner code"* — those terms aren't in the glossary and don't earn their place.

No hedging, no throat-clearing, no "it's worth noting that…". If a sentence could be a bullet, make it a bullet. If a bullet could be cut, cut it. If a term isn't in the `/codebase-design` glossary, reach for one that is before inventing a new one.
````

</details>
