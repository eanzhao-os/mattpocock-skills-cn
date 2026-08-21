# 08. to-tickets

## Meta（bucket/path/url/触发方式/companions）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/to-tickets/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets |
| name | `to-tickets` |
| 触发 | description：把 plan / spec / 当前对话拆成 tracer-bullet tickets，并声明 blocking edges；发布到已配置的 tracker |
| 调用策略 | `disable-model-invocation: true`（仅用户显式调用；`agents/openai.yaml` 中 `allow_implicit_invocation: false`） |
| companions | 无独立 companion 文件；依赖 `/setup-matt-pocock-skills` 提供 issue tracker 与 triage label 词表 |
| 下游 | 产出的 tickets 供 `/implement`、triage（`ready-for-agent`）消费 |
| 上游 | 典型来自 `/to-spec`、对话中的 plan、或既有 issue |

## 原文 (SKILL.md)

```markdown
---
name: to-tickets
description: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker — edges as text in one file per ticket locally, or native blocking links on a real tracker.
disable-model-invocation: true
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets** — tracer-bullet vertical slices, each declaring the tickets that **block** it.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests) — vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges** — the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change — rename a column, retype a shared symbol — whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket — green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct — does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the tickets to the configured tracker

Publish the approved tickets. **How** depends on the tracker `/setup-matt-pocock-skills` configured — the tickets are the same either way, only the shape of the blocking edges changes:

- **Local files** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). Each file's "Blocked by" lists the numbers/titles it depends on. Use the per-ticket file template below — one ticket per file, never a single combined file.
- **A real issue tracker (GitHub, Linear, …)** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use the platform's native blocking / sub-issue relationship where it has one; otherwise set each ticket's "Blocked by" to the blocking issues. Apply the `ready-for-agent` triage label unless instructed otherwise — the tickets are agent-grabbable by construction.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

Do NOT close or modify any parent issue.

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective — not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective — not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None — can start immediately".

</issue-template>

In either form, avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.
```

## 中文翻译

```yaml
name: to-tickets
description: 将计划方案、需求规范或当前对话拆解为一组纵深穿透的工单（tracer-bullet tickets，垂直切片），每个工单明确声明其阻塞前置依赖（blocking edges），并发布到已配置的工单系统中 —— 如果是本地跟踪器，则在每个工单文件内以文本记录依赖；如果是真实工单平台，则使用系统原生的 blocking 关联。
disable-model-invocation: true
```

# To Tickets（拆解为可执行工单）

将计划方案、需求规范或当前对话拆解为一组 **工单（tickets）** —— 每一个都是纵深穿透的端到端垂直切片（tracer-bullet vertical slices），并明确声明哪些其他工单会 **阻塞（block）** 本工单的启动。

工单系统（issue tracker）与分类标签（triage labels）的词汇表应该已经预先配置完毕 —— 如果尚未配置，请先运行 `/setup-matt-pocock-skills`。

## 流程

### 1. 收集上下文
优先从当前会话上下文中已有的一切信息出发。如果用户传入了引用参数（例如需求规范的文件路径、已有工单编号或工单 URL），先拉取并通读其完整正文与所有评论。

### 2. 探索代码库（可选）
如果之前尚未探索代码库，先进行探索以掌握当前代码现状。工单的标题与描述必须严格使用项目领域词汇表（domain glossary）中的概念，并遵循所触及区域已有的架构决策记录（ADRs）。

积极寻找在正式实现前做 **预重构（prefactor）** 的机会，让后续实现变得更加轻松 —— 秉承理念：“先让变更变容易，再去实现那个容易的变更（Make the change easy, then make the easy change）”。

### 3. 起草垂直切片工单
将整体工作拆解为 **纵深穿透（tracer bullet）** 工单：

**垂直切片核心规则：**
- **纵深贯穿而非分层横切**：每个切片都应狭窄但**完整地**贯穿整个技术栈各个层次（从数据模型 Schema、API 接口、UI 界面到自动化测试），绝不能做“只写某一层（如只写前端或只写后端）”的水平横切。
- **独立可验证**：完成一个切片后，该切片本身就能够独立进行演示或端到端验证。
- **体量适中**：每个切片的体量必须恰好能够放入一个全新的空白上下文窗口中完成。
- **预重构优先**：任何预先的结构重构（prefactoring）工作必须作为独立的先头工单排在最前面。

为每个工单指定 **阻塞前置依赖（blocking edges）** —— 即在当前工单开始前必须先完成的其他工单。没有前置阻塞依赖的工单可以立即开工。

> **大范围横向重构是垂直切片的唯一例外**：  
> 所谓的“大范围重构（Wide refactor）”是指那种波及整仓的机械性变更（例如数据库改列名、对跨多个模块的核心共享类型做重命名），这类变更的 **爆炸半径（blast radius）** 极其巨大，单次修改会同时打碎全仓成百上千处调用点，导致没有任何一个垂直切片能够单独保持绿色测试通过（Green）。  
> **切勿强行将其塞入单个纵深切片中**；应采用 **“先扩展后收缩（expand–contract）”** 策略按序推进：  
> 1. **先扩展（Expand）**：新增全新的形式，与旧形式并存，不破坏现有任何行为；  
> 2. **分批迁移（Migrate）**：根据爆炸半径将调用方的迁移拆解为批次工单（按 package 或按目录分批），每个迁移工单都声明被扩展工单所阻塞（blocked by expand）。由于旧形式依然保留，批次迁移期间 CI 测试可以全程保持绿灯通过；  
> 3. **最后收缩（Contract）**：当所有调用点都已彻底迁移完毕后，在最后一个收缩工单中彻底删除旧形式代码，该工单被所有迁移工单所阻塞。  
> 如果某些批次由于强耦合实在无法单独保持绿灯，依然保持上述拆解顺序，但让它们共享同一个集成特性分支（integration branch），并共同阻塞最终的“集成与验证”工单 —— 仅在最终工单处承诺全仓绿灯。

### 4. 向用户提问审核（Quiz）
将起草的拆解方案以编号列表形式向用户展示。每个工单清晰列出：
- **标题（Title）**：简短且富有描述性的名称
- **阻塞前置（Blocked by）**：必须先完成的其他工单（若有）
- **交付内容（What it delivers）**：从用户端到端视角看，该工单让系统的哪项具体行为运转起来

主动向用户询问：
- 粒度划分是否适中？（过粗还是过细？）
- 阻塞依赖关系是否准确？（每个工单是否只依赖那些真正对它构成先决阻碍的工单？）
- 是否有任何工单需要进一步合并或拆解？

与用户反复迭代调整，直到用户完全批准该拆解方案。

### 5. 将工单发布到配置的跟踪系统中
发布经用户批准的工单。**发布的形式**取决于 `/setup-matt-pocock-skills` 所配置的系统 —— 无论哪种形式，工单内容本身是一致的，只有依赖关系的表达形态不同：

- **本地文件形式**：在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 路径下每个工单写入一个独立 Markdown 文件，按依赖顺序（阻塞前置排在前面）从 `01` 开始编号。每个文件内的 "Blocked by" 列出其依赖的工单编号与标题。严格使用下方的单工单文件模板 —— **绝对禁止合并为一个总文件**。
- **真实工单系统（GitHub / Linear 等）**：按依赖顺序（阻塞前置排在前面）为每个工单发布一条独立的 Issue，使阻塞依赖能够直接引用真实的工单 ID 或系统原生的 blocking / sub-issue 关联。除非另有指示，为每个工单打上 `ready-for-agent` 标签 —— 因为经过此流程拆解出的工单在结构上天然就是适合 Agent 独立领取的。

推进 **前沿可执行集合（frontier）**：即所有前置依赖均已完成的工单。对于纯线性的依赖链，这意味着自顶向下逐一执行。

**切勿关闭或随意修改任何父级需求工单（parent issue）**。

---

### 本地工单文件模板（Local Ticket Template）

```markdown
# <NN> — <工单标题>

**What to build:** 从最终用户视角描述本工单所交付的端到端行为 —— 而不是罗列各层的实现步骤。

**Blocked by:** 阻碍本工单开始的前置工单编号/标题，或者注明 "None — can start immediately"（无前置，可立即开工）。

**Status:** ready-for-agent

- [ ] 验收标准 1
- [ ] 验收标准 2
```

### 平台 Issue 工单模板（Issue Template）

```markdown
## Parent
父工单的引用链接（如果原始来源是现有工单；否则省略本节）。

## What to build
从最终用户视角描述本工单所交付的端到端行为 —— 而不是分层实现细节。

## Acceptance criteria
- [ ] 验收标准 1
- [ ] 验收标准 2

## Blocked by
- 关联的前置阻塞工单引用，或注明 "None — can start immediately"。
```

在以上两种形式中，**都要避免罗列具体的文件路径或代码片段** —— 因为它们在开发推进中会极快地过时失效。  
*例外情况*：如果之前的原型产出了某段比自然语言文字更能精确编码决策的代码片段（例如状态机、状态规约函数、Schema 定义或类型声明），可以将该片段内联到工单中，并简要注明其来自原型。只保留富含决策信息的核心部分 —— 不需要贴出完整的可运行演示，只需关键结构。
