# 17. improve-codebase-architecture

## Meta（bucket/path/url/触发方式/companions）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/improve-codebase-architecture/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture |
| name | `improve-codebase-architecture` |
| 触发方式 | description：Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick（model-invoked） |
| companions | [HTML-REPORT.md](./17-improve-codebase-architecture_HTML-REPORT.md)——本页只列角色，不全文翻译 |
| 产物 | HTML 报告 + deepening opportunities |
| 消费方 | `/grill-with-docs`（生成 idea） |

## 原文 (SKILL.md)

```markdown
---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Run the `/codebase-design` skill for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use these terms exactly in every suggestion — don't drift into "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## Process

### 1. Explore

**Scope before you scan — YAGNI.** Deepening a module pays off by making future changes to it easier, so put extra weight on the parts of the codebase that have recently changed. Decide *where* to look before you look:

- If the user named a direction — a module, a subsystem, a pain point — take it, and skip the inference below.
- Otherwise, walk back a good stretch of the commit history (`git log --oneline`) to find the codebase's hot spots — the files and areas that keep coming up — and let those paths pull your attention first. If the changes are scattered with no clear hot spot, widen the net.

Read the project's domain glossary (`CONTEXT.md`) and any ADRs in the area you're touching first.

Then spawn a sub-agent to walk the codebase. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.

The report uses **Tailwind via CDN** for layout and styling, and **Mermaid via CDN** for diagrams where a graph/flow/sequence reliably communicates the structure. Mix Mermaid with hand-crafted CSS/SVG visuals — use Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), and hand-built divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

For each candidate, render a card with:

- **Files** — which files/modules are involved
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge

End the report with a **Top recommendation** section: which candidate you'd tackle first and why.

**Use CONTEXT.md vocabulary for the domain, and the `/codebase-design` vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

See [HTML-REPORT.md](./17-improve-codebase-architecture_HTML-REPORT.md) for the full HTML scaffold, diagram patterns, and styling guidance.

Do NOT propose interfaces yet. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, run the `/grilling` skill to walk the decision tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize — run the `/domain-modeling` skill to keep the domain model current as you go:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md`. Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Run the `/codebase-design` skill and use its design-it-twice parallel sub-agent pattern.
```

## 中文翻译

```yaml
name: improve-codebase-architecture
description: 扫描代码库以寻找加深模块内聚的机会（deepening opportunities），将它们呈现为可视化的 HTML 诊断报告，然后通过深度追问访谈协助用户敲定选中的重构方案。
disable-model-invocation: true
```

# Improve Codebase Architecture（代码库架构优化与内聚深化）

主动暴露代码库中的架构摩擦点，并提出 **加深模块内聚的重构机会（deepening opportunities）** —— 即将浅薄的模块重构为内聚且深厚的深模块。其核心目标是大幅提升代码的**可测试性**以及对 **AI 导航与理解的友好度**。

本命令的工作完全建立在项目的领域模型以及统一的架构设计语言之上：
- 查阅 `/codebase-design` skill 以获取架构专业词汇（**module 模块**、**interface 接口**、**depth 深度**、**seam 接缝**、**adapter 适配器**、**leverage 杠杆率**、**locality 局部性**）及其核心原则（代码删除测试法、接口即测试表面、一个适配器意味着假设的接缝等）。在提出的每一项优化建议中精准使用这些术语 —— 严禁漂移到 "component"、"service"、"API" 或 "boundary" 等含糊用词。
- `CONTEXT.md` 中的领域语言为优质架构接缝赋予准确命名；`docs/adr/` 中的架构决策记录则沉淀了历史决策，本命令绝不应当对其进行无意义的重复争论。

---

## 流程

### 1. 探索与勘测（Explore）

**在扫描前先明确范围 —— 坚持 YAGNI 原则（如无必要勿增实体）**。加深一个模块的内聚性，其核心回报在于让该模块在未来的修改变得更加容易，因此应该将更多权重放在代码库近期频繁变更的高发区域。在动手前先决定**去哪里看**：
- 如果用户明确指定了探索方向 —— 某个具体模块、子系统或痛点区域 —— 直接采纳，跳过下方的自动推断。
- 否则，向前翻阅一段适度长度的 commit 提交历史（`git log --oneline`）以寻找代码库中的**热点区域（hot spots）** —— 即那些反复被修改的文件和目录 —— 优先让这些路径吸引你的注意力。如果提交记录极其分散且无明显热点，再扩大排查网。

首先阅读项目的领域词汇表（`CONTEXT.md`）以及所触及区域已有的任何 ADR 记录。

随后派发一个子代理（sub-agent）去遍历代码库。不要死板遵循僵化的套路 —— 自主有机地探索，并敏锐记录你在何处感受到了架构摩擦：
- 理解某一个单一概念是否需要你在大量细碎的小模块之间来回跳转？
- 哪些模块属于 **浅模块（shallow）** —— 接口的复杂度几乎与内部实现的复杂度一样高？
- 哪些纯函数纯粹只是为了应付测试而被抽离出来，而真正的 Bug 却隐藏在它们被外部调用的方式之中（缺乏**局部内聚性 locality**）？
- 哪些紧耦合的模块在它们本该干净的接缝处到处泄露细节？
- 代码库的哪些部分处于未经测试的状态，或者通过其现有接口极其难以编写测试？

对任何你怀疑属于浅模块的代码应用 **代码删除测试法（deletion test）**：如果删除该模块，整体复杂度是随之消失了，还是仅仅转移散落到了别处？如果答案是“复杂度随之消失并暴露出其实质是个多余传声筒”，这正是你需要捕捉的核心信号。

### 2. 将候选方案呈现为 HTML 报告（Present candidates as an HTML report）

在操作系统的临时目录（temp directory）中写入一个独立的 HTML 文件，确保不会对代码仓库本身造成任何文件污染。优先使用 `$TMPDIR`，降级回退到 `/tmp`（Windows 上为 `%TEMP%`），写入路径 `<tmpdir>/architecture-review-<timestamp>.html`，确保每次运行都能生成一份全新文件。直接为用户在默认浏览器中打开该报告 —— Linux 上使用 `xdg-open <path>`，macOS 上使用 `open <path>`，Windows 上使用 `start <path>` —— 并向用户输出该文件的绝对路径。

报告统一使用 **Tailwind CDN** 进行排版与样式美化；在图表、流程图或时序图能更加清晰传达结构的地方，使用 **Mermaid CDN** 渲染。将 Mermaid 流程图与精细手写的 CSS/SVG 视觉元素相结合 —— 对于图状关系（调用链图、依赖拓扑、时序交互）使用 Mermaid，对于更具设计感的板块（体积块图、剖面切片图、折叠展开动画）使用手写的 div 和 SVG。为每一个重构候选方案都提供一份 **重构前与重构后的直观对比可视化（before/after visualisation）**。一定要做到生动直观。

针对每一个候选优化点，渲染一张卡片，包含：
- **涉及文件（Files）** — 涉及哪些文件与模块
- **当前问题（Problem）** — 为什么当前的架构正在引发开发摩擦与阻碍
- **解决方案（Solution）** — 用大白话清晰描述具体将做出什么改变
- **重构收益（Benefits）** — 从局部内聚性（locality）和接口杠杆率（leverage）的角度解释收益，并说明测试将如何变得更加简明可靠
- **重构前后对比图（Before / After diagram）** — 并排呈现、精心绘制的图解，生动展示模块的浅薄现状以及加深内聚后的形态
- **推荐力度（Recommendation strength）** — `Strong（强烈推荐）`、`Worth exploring（值得探索）`、`Speculative（探索性建议）` 之一，以徽章形式呈现

报告结尾以 **首要推荐（Top recommendation）** 章节收尾：明确指出你建议最优先解决哪一个候选方案，并阐述核心理由。

**领域概念严格使用 CONTEXT.md 中的词汇，架构设计严格使用 `/codebase-design` 中的词汇**。例如如果 `CONTEXT.md` 中定义了 "Order（订单）"，就称其为 "Order intake module（订单接收模块）" —— 而不是 "FooBarHandler"，也不是 "Order service"。

**ADR 冲突处理**：如果某个候选方案与现有的某篇 ADR 产生冲突，仅在架构摩擦极其严重、确实值得重新审视该 ADR 时才予以暴露。在卡片中予以鲜明警示（例如警告标注：*“与 ADR-0007 冲突 —— 但因……原因值得重新开启审议”*）。切勿罗列每一项被 ADR 理论上禁止的无意义重构。

完整的 HTML 脚手架、图表范式与样式指南请参阅 [HTML-REPORT.md](./17-improve-codebase-architecture_HTML-REPORT.md)。

**此时绝对不要提前提出具体的代码接口设计**。在文件写完并打开后，直接向用户提问：“您希望深入探索其中的哪一项方案？”

### 3. 深度追问访谈循环（Grilling loop）

一旦用户选定了某个具体的重构候选点，运行 `/grilling` skill 与用户共同推演整个决策树 —— 厘清边界约束、前置依赖、加深后模块的形态、接缝背后放置什么逻辑、以及哪些测试能够存活下来。

随着决策的逐步明朗，各种副作用同步原位落盘 —— 实时调用 `/domain-modeling` skill 保持领域模型处于最新状态：
- **给加深后的模块起了一个尚未收录在 `CONTEXT.md` 中的新概念名字？** 立刻将该术语追加到 `CONTEXT.md` 中。如果文件不存在，惰性创建它。
- **在对话沟通过程中打磨澄清了一个模糊术语？** 当场就地更新 `CONTEXT.md`。
- **用户基于某个极其站得住脚的核心理由拒绝了该候选方案？** 主动提议创建一篇 ADR，话术为：*“是否需要我将这个理由记录为一篇 ADR，以便未来的架构审查不会再次重复提出此建议？”* 仅当该理由确实需要被未来的探索者知晓以防重复提议时才创建 —— 忽略那些临时性的理由（如“现在没时间弄”）以及显而易见的事实。
- **想要为加深后的模块探索不同的替代接口形态？** 运行 `/codebase-design` skill，并应用其中的“二次平行设计模式（design-it-twice parallel sub-agent pattern）”。
